import { containers } from "@/data/at21-data"
import { orders } from "@/data/at22-data"
import type { Action, Container, Order, UrgencyLevel, ActionPriority } from "@/data/types"

const REPORT_DATE = "2026-03-25"

function daysDiff(dateStr: string): number {
  const d = new Date(dateStr)
  const ref = new Date(REPORT_DATE)
  return Math.round((d.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24))
}

function containerAction(
  c: Container,
  type: UrgencyLevel,
  priority: ActionPriority,
  title: string,
  description: string,
  suggestedAction: string,
  category: string
): Action {
  return {
    id: `act-${c.id}-${category}`,
    type,
    priority,
    title,
    description,
    relatedContainerNumber: c.containerNumber,
    suggestedAction,
    assignee: "Jasmin",
    status: "pending",
    category,
    createdAt: REPORT_DATE,
  }
}

function orderAction(
  o: Order,
  type: UrgencyLevel,
  priority: ActionPriority,
  title: string,
  description: string,
  suggestedAction: string,
  category: string
): Action {
  return {
    id: `act-${o.id}-${category}`,
    type,
    priority,
    title,
    description,
    relatedOrderRef: o.tliRef,
    suggestedAction,
    assignee: "Rima",
    status: "pending",
    category,
    createdAt: REPORT_DATE,
  }
}

export function generateActions(): Action[] {
  const actions: Action[] = []

  for (const c of containers) {
    if (c.section === "not-routed" || c.section === "do-not-sent") {
      if (c.isHot) {
        actions.push(
          containerAction(
            c,
            "critical",
            1,
            `HOT: Request D/O for ${c.containerNumber}`,
            `Container ${c.containerNumber} at ${c.terminal} is HOT with ETA ${c.etaDate}. No D/O has been sent. Shipping line: ${c.shippingLine}.`,
            `Email broker to request immediate D/O issuance for ${c.containerNumber}`,
            "request-do"
          )
        )
      } else if (c.diffOfDays <= 3) {
        actions.push(
          containerAction(
            c,
            "urgent",
            2,
            `Request D/O for ${c.containerNumber}`,
            `Container ${c.containerNumber} arriving in ${c.diffOfDays} day(s) at ${c.terminal}. No D/O sent. Ship ref: ${c.shipRef}.`,
            `Email broker to request D/O for ${c.containerNumber}, shipping line ${c.shippingLine}`,
            "request-do"
          )
        )
      }
    }

    if (c.section === "lfd-not-updated") {
      actions.push(
        containerAction(
          c,
          "urgent",
          2,
          `Update LFD for ${c.containerNumber}`,
          `Container ${c.containerNumber} at ${c.terminal} has no LFD on file. Cannot track demurrage risk without it.`,
          `Contact terminal/shipping line to obtain LFD for ${c.containerNumber}`,
          "update-lfd"
        )
      )
    }

    if (c.section === "not-picked-up") {
      if (c.lfd && daysDiff(c.lfd) < 0) {
        actions.push(
          containerAction(
            c,
            "critical",
            1,
            `OVERDUE: Pick up ${c.containerNumber}`,
            `Container ${c.containerNumber} at ${c.terminal} is ${Math.abs(daysDiff(c.lfd))} day(s) past LFD (${c.lfd}). Demurrage fees are accruing.`,
            `Schedule emergency drayage pickup for ${c.containerNumber} from ${c.terminal}`,
            "schedule-pickup"
          )
        )
      } else if (c.lfd && daysDiff(c.lfd) <= 1) {
        actions.push(
          containerAction(
            c,
            "urgent",
            2,
            `Schedule pickup for ${c.containerNumber}`,
            `Container ${c.containerNumber} at ${c.terminal} has LFD ${c.lfd} (${daysDiff(c.lfd)} day(s) remaining). Must schedule pickup immediately.`,
            `Contact drayage company to schedule pickup for ${c.containerNumber} from ${c.terminal}`,
            "schedule-pickup"
          )
        )
      }
    }

    if (c.section === "not-returned") {
      if (c.lfdToReturn && daysDiff(c.lfdToReturn) < 0) {
        actions.push(
          containerAction(
            c,
            "critical",
            1,
            `OVERDUE RETURN: ${c.containerNumber}`,
            `Empty container ${c.containerNumber} is ${Math.abs(daysDiff(c.lfdToReturn))} day(s) past return deadline (${c.lfdToReturn}). Detention fees are accruing.`,
            `Contact drayage to return empty ${c.containerNumber} to ${c.terminal} immediately`,
            "return-empty"
          )
        )
      } else if (c.lfdToReturn && daysDiff(c.lfdToReturn) <= 2) {
        actions.push(
          containerAction(
            c,
            "warning",
            3,
            `Return empty: ${c.containerNumber}`,
            `Empty container ${c.containerNumber} return deadline is ${c.lfdToReturn} (${daysDiff(c.lfdToReturn)} day(s)). Schedule return to avoid detention.`,
            `Remind drayage company to return empty ${c.containerNumber} to ${c.terminal}`,
            "return-empty"
          )
        )
      }
    }

    if (c.section === "receiving-pending") {
      actions.push(
        containerAction(
          c,
          "warning",
          3,
          `Confirm receipt: ${c.containerNumber}`,
          `Container ${c.containerNumber} was picked up on ${c.pickupDate} but receiving has not been confirmed in ERP. ${Math.abs(c.diffOfDays)} days since pickup.`,
          `Confirm with warehouse that goods from ${c.containerNumber} have been received and update ERP`,
          "confirm-receipt"
        )
      )
    }
  }

  for (const o of orders) {
    if (o.section === "scheduled-not-shipped" && o.diffOfDays < 0) {
      actions.push(
        orderAction(
          o,
          "critical",
          1,
          `OVERDUE SHIPMENT: TLI#${o.tliRef}`,
          `Order TLI#${o.tliRef} for ${o.custCode} (PO: ${o.custPO}) is ${Math.abs(o.diffOfDays)} day(s) past cancel date. Category: ${o.category}. ${o.cartons} cartons.`,
          `Contact carrier to confirm shipment status for TLI#${o.tliRef}. Escalate if not shipped today.`,
          "confirm-shipment"
        )
      )
    }

    if (o.section === "routed-not-scheduled" && o.diffOfDays <= 0) {
      actions.push(
        orderAction(
          o,
          "critical",
          1,
          `SCHEDULE NOW: TLI#${o.tliRef}`,
          `Order TLI#${o.tliRef} for ${o.custCode} (PO: ${o.custPO}) cancel date is today or passed (${o.cancelDate}). Routed but not scheduled. ${o.cartons} cartons at ${o.warehouse}.`,
          `Schedule carrier pickup for TLI#${o.tliRef} immediately`,
          "schedule-shipment"
        )
      )
    } else if (o.section === "routed-not-scheduled" && o.diffOfDays <= 5) {
      actions.push(
        orderAction(
          o,
          "warning",
          3,
          `Schedule pickup: TLI#${o.tliRef}`,
          `Order TLI#${o.tliRef} for ${o.custCode} cancel date is ${o.cancelDate} (${o.diffOfDays} days). Routed but not yet scheduled.`,
          `Coordinate carrier scheduling for TLI#${o.tliRef}`,
          "schedule-shipment"
        )
      )
    }

    if (o.section === "sent-not-routed" && o.diffOfDays <= 3) {
      actions.push(
        orderAction(
          o,
          "urgent",
          2,
          `Route pick tickets: TLI#${o.tliRef}`,
          `Pick tickets for TLI#${o.tliRef} (${o.custCode}, ${o.category}) sent but not routed. Cancel date: ${o.cancelDate} (${o.diffOfDays} days).`,
          `Follow up with warehouse to route pick tickets for TLI#${o.tliRef}`,
          "route-picks"
        )
      )
    }

    if (
      o.pipeline === "direct" &&
      o.section === "open-not-received" &&
      o.comments.toLowerCase().includes("waiting d/o")
    ) {
      actions.push(
        orderAction(
          o,
          "urgent",
          2,
          `D/O needed for direct order TLI#${o.tliRef}`,
          `Direct order TLI#${o.tliRef} for ${o.custCode} ($${o.salesValue.toLocaleString()}) is waiting for D/O. Ship ref: ${o.shipRef}.`,
          `Request D/O from broker for ship ref ${o.shipRef} to unblock order TLI#${o.tliRef}`,
          "request-do"
        )
      )
    }

    if (o.pipeline === "direct" && o.section === "received-not-picked" && o.diffOfDays < 0) {
      actions.push(
        orderAction(
          o,
          "urgent",
          2,
          `Pick direct order: TLI#${o.tliRef}`,
          `Direct order TLI#${o.tliRef} for ${o.custCode} ($${o.salesValue.toLocaleString()}) received but not picked. ${Math.abs(o.diffOfDays)} day(s) in warehouse.`,
          `Coordinate with warehouse to pick and ship TLI#${o.tliRef} for ${o.custCode}`,
          "pick-order"
        )
      )
    }
  }

  actions.sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title))
  return actions
}

export const actions = generateActions()

export function getActionsByPriority(type: UrgencyLevel): Action[] {
  return actions.filter((a) => a.type === type)
}

export function getActionsByAssignee(name: string): Action[] {
  return actions.filter((a) => a.assignee === name)
}

export function getPendingActions(): Action[] {
  return actions.filter((a) => a.status === "pending")
}
