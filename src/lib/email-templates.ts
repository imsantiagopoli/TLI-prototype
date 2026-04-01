import type { Action, EmailDraft } from "@/data/types"
import type { EmailTemplate } from "@/data/email-template-defaults"
import { defaultTemplates } from "@/data/email-template-defaults"
import { containers } from "@/data/at21-data"
import { orders } from "@/data/at22-data"
import { resolveRecipient, type Contact } from "@/data/contacts"

let _userTemplates: EmailTemplate[] | null = null

export function setUserTemplates(templates: EmailTemplate[]) {
  _userTemplates = templates
}

export function getActiveTemplates(): EmailTemplate[] {
  return _userTemplates ?? defaultTemplates
}

function getTemplate(category: string): EmailTemplate | undefined {
  return getActiveTemplates().find((t) => t.category === category)
}

function findContainer(containerNumber: string) {
  return containers.find((c) => c.containerNumber === containerNumber)
}

function findOrder(tliRef: string) {
  return orders.find((o) => o.tliRef === tliRef)
}

function formatTo(contact: Contact | undefined, fallbackType: string): string {
  if (!contact) return `<${fallbackType}@example.com>`
  return `${contact.name} <${contact.email}>`
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "")
}

function buildContainerVars(
  action: Action,
  contact: Contact | undefined
): Record<string, string> {
  const c = action.relatedContainerNumber
    ? findContainer(action.relatedContainerNumber)
    : null

  const isOverdue = action.type === "critical"
  let urgencyNote = ""
  if (action.category === "schedule-pickup") {
    urgencyNote = isOverdue
      ? "URGENT — This container is past its Last Free Date and demurrage fees are accruing.\n\n"
      : ""
  } else if (action.category === "return-empty") {
    urgencyNote = isOverdue
      ? "This empty container is past its return deadline. Detention fees are being charged.\n\n"
      : "Please arrange return of the following empty container before the deadline.\n\n"
  }

  return {
    contactName: contact ? contact.name.split(" ")[0] : "",
    containerNumber: action.relatedContainerNumber ?? "",
    shippingLine: c?.shippingLine ?? "",
    terminal: c?.terminal ?? "",
    etaDate: c?.etaDate ?? "",
    shipRef: c?.shipRef ?? "",
    lfd: c?.lfd ?? "",
    lfdToReturn: c?.lfdToReturn ?? "",
    warehouse: c?.warehouse ?? "",
    freeDays: c?.freeDays?.toString() ?? "",
    urgencyNote: isOverdue ? "URGENT: " : "",
  }
}

function buildOrderVars(
  action: Action,
  contact: Contact | undefined
): Record<string, string> {
  const o = action.relatedOrderRef ? findOrder(action.relatedOrderRef) : null

  return {
    contactName: contact ? contact.name.split(" ")[0] : "",
    tliRef: action.relatedOrderRef ?? "",
    custCode: o?.custCode ?? "",
    custPO: o?.custPO ?? "",
    category: o?.category ?? "",
    cancelDate: o?.cancelDate ?? "",
    warehouse: o?.warehouse ?? "",
    cartons: o?.cartons?.toString() ?? "",
    salesValue: o ? `$${o.salesValue.toLocaleString()}` : "",
  }
}

function resolveContainerContext(containerNumber: string | undefined) {
  const c = containerNumber ? findContainer(containerNumber) : null
  return {
    shippingLine: c?.shippingLine,
    terminal: c?.terminal,
    drayageCode: c?.prodType,
    warehouse: c?.warehouse,
    custCode: c?.custType,
  }
}

function resolveOrderContext(tliRef: string | undefined) {
  const o = tliRef ? findOrder(tliRef) : null
  return {
    warehouse: o?.warehouse,
    custCode: o?.custCode,
  }
}

const CONTAINER_CATEGORIES = new Set([
  "request-do",
  "update-lfd",
  "schedule-pickup",
  "return-empty",
  "confirm-receipt",
])

export function generateEmailDraft(action: Action): EmailDraft {
  const tpl = getTemplate(action.category)
  if (!tpl) {
    return {
      id: `email-${action.id}`,
      actionId: action.id,
      to: "",
      from: "jasmin@tli.com",
      subject: action.title,
      body: action.description,
      status: "draft",
      recipientType: "broker",
      relatedContainer: action.relatedContainerNumber,
      relatedOrder: action.relatedOrderRef,
      priority: action.type,
    }
  }

  const isContainer = CONTAINER_CATEGORIES.has(action.category)

  const ctx = isContainer
    ? resolveContainerContext(action.relatedContainerNumber)
    : resolveOrderContext(action.relatedOrderRef)

  const { contact, recipientType } = resolveRecipient(action.category, ctx)

  const vars = isContainer
    ? buildContainerVars(action, contact)
    : buildOrderVars(action, contact)

  const subject = interpolate(tpl.subjectTemplate, vars)
  const body = interpolate(tpl.bodyTemplate, vars)

  return {
    id: `email-${action.id}`,
    actionId: action.id,
    to: formatTo(contact, tpl.recipientRole),
    from: tpl.sender,
    subject,
    body,
    status: "ready",
    recipientType,
    relatedContainer: isContainer ? action.relatedContainerNumber : undefined,
    relatedOrder: !isContainer ? action.relatedOrderRef : undefined,
    priority: action.type,
  }
}

export function generateAllDrafts(actions: Action[]): EmailDraft[] {
  return actions.map(generateEmailDraft)
}
