import type { ContactRole } from "./contacts"

export interface EmailTemplate {
  id: string
  category: string
  name: string
  description: string
  recipientRole: ContactRole
  sender: string
  subjectTemplate: string
  bodyTemplate: string
  availableVariables: TemplateVariable[]
}

export interface TemplateVariable {
  key: string
  label: string
  example: string
}

const CONTAINER_VARS: TemplateVariable[] = [
  { key: "contactName", label: "Contact First Name", example: "Michael" },
  { key: "containerNumber", label: "Container Number", example: "TIIU5037901" },
  { key: "shippingLine", label: "Shipping Line Code", example: "EMC" },
  { key: "terminal", label: "Terminal Code", example: "APM" },
  { key: "etaDate", label: "ETA Date", example: "2026-03-26" },
  { key: "shipRef", label: "Ship Reference", example: "7798" },
  { key: "lfd", label: "Last Free Date", example: "2026-04-01" },
  { key: "lfdToReturn", label: "Return Deadline", example: "2026-04-05" },
  { key: "warehouse", label: "Warehouse Code", example: "LA-FTD" },
  { key: "freeDays", label: "Free Days", example: "4" },
  { key: "urgencyNote", label: "Urgency Note (auto)", example: "URGENT — ..." },
]

const ORDER_VARS: TemplateVariable[] = [
  { key: "contactName", label: "Contact First Name", example: "Mark" },
  { key: "tliRef", label: "TLI Reference", example: "12345" },
  { key: "custCode", label: "Customer Code", example: "RO" },
  { key: "custPO", label: "Customer PO#", example: "PO-9876" },
  { key: "category", label: "Product Category", example: "Furniture" },
  { key: "cancelDate", label: "Cancel Date", example: "2026-04-10" },
  { key: "warehouse", label: "Warehouse Code", example: "LA-FTD" },
  { key: "cartons", label: "Carton Count", example: "240" },
  { key: "salesValue", label: "Sales Value", example: "$12,500" },
]

export const defaultTemplates: EmailTemplate[] = [
  {
    id: "tpl-request-do",
    category: "request-do",
    name: "D/O Request",
    description: "Request a Delivery Order from the customs broker for a specific container",
    recipientRole: "broker",
    sender: "jasmin@tli.com",
    subjectTemplate: "D/O Request — Container {{containerNumber}}",
    bodyTemplate: `Hi {{contactName}},

We need a Delivery Order issued for the following container:

Container #: {{containerNumber}}
Shipping Line: {{shippingLine}}
Terminal: {{terminal}}
ETA: {{etaDate}}
Ship Ref: {{shipRef}}

Please issue the D/O at your earliest convenience so we can arrange drayage pickup.

Thank you,
Jasmin
Trade Lines Inc.`,
    availableVariables: CONTAINER_VARS,
  },
  {
    id: "tpl-update-lfd",
    category: "update-lfd",
    name: "LFD Update Request",
    description: "Request the Last Free Date from the broker to plan pickup and avoid demurrage",
    recipientRole: "broker",
    sender: "jasmin@tli.com",
    subjectTemplate: "LFD Update Request — Container {{containerNumber}}",
    bodyTemplate: `Hi {{contactName}},

Could you please provide the Last Free Date (LFD) for the following container?

Container #: {{containerNumber}}
Terminal: {{terminal}}
Shipping Line: {{shippingLine}}
ETA: {{etaDate}}

We need the LFD to plan our pickup schedule and avoid demurrage.

Thank you,
Jasmin
Trade Lines Inc.`,
    availableVariables: CONTAINER_VARS,
  },
  {
    id: "tpl-schedule-pickup",
    category: "schedule-pickup",
    name: "Pickup Request",
    description: "Request drayage company to schedule a container pickup from terminal",
    recipientRole: "drayage",
    sender: "jasmin@tli.com",
    subjectTemplate: "{{urgencyNote}}Pickup Request — Container {{containerNumber}}",
    bodyTemplate: `Hi {{contactName}},

{{urgencyNote}}

Please schedule a pickup for:

Container #: {{containerNumber}}
Terminal: {{terminal}}
LFD: {{lfd}}
Destination: {{warehouse}}
Shipping Line: {{shippingLine}}

Please confirm pickup date and time.

Thank you,
Jasmin
Trade Lines Inc.`,
    availableVariables: CONTAINER_VARS,
  },
  {
    id: "tpl-return-empty",
    category: "return-empty",
    name: "Empty Return",
    description: "Request drayage company to return an empty container before the deadline",
    recipientRole: "drayage",
    sender: "jasmin@tli.com",
    subjectTemplate: "{{urgencyNote}}Empty Return — Container {{containerNumber}}",
    bodyTemplate: `Hi {{contactName}},

{{urgencyNote}}

Container #: {{containerNumber}}
Return to: {{terminal}}
Return Deadline: {{lfdToReturn}}
Shipping Line: {{shippingLine}}
Free Days: {{freeDays}}

Please confirm the return date.

Thank you,
Jasmin
Trade Lines Inc.`,
    availableVariables: CONTAINER_VARS,
  },
  {
    id: "tpl-confirm-receipt",
    category: "confirm-receipt",
    name: "Receiving Confirmation",
    description: "Request warehouse to confirm a container has been fully received",
    recipientRole: "warehouse",
    sender: "jasmin@tli.com",
    subjectTemplate: "Receiving Confirmation — Container {{containerNumber}}",
    bodyTemplate: `Hi {{contactName}},

Could you please confirm if the following container has been fully received?

Container #: {{containerNumber}}
Warehouse: {{warehouse}}

We need to update our ERP system with the receiving date and carton count. If the container has been received, please provide:
- Date received
- Total cartons received
- Any discrepancies or damages

Thank you,
Jasmin
Trade Lines Inc.`,
    availableVariables: CONTAINER_VARS,
  },
  {
    id: "tpl-confirm-shipment",
    category: "confirm-shipment",
    name: "Shipment Status (Urgent)",
    description: "Urgent request to carrier to confirm shipment status for past-due orders",
    recipientRole: "carrier",
    sender: "rima@tli.com",
    subjectTemplate: "URGENT: Shipment Status — TLI#{{tliRef}}",
    bodyTemplate: `Hi {{contactName}},

We need an immediate update on the following shipment:

TLI Ref: {{tliRef}}
Customer: {{custCode}}
PO#: {{custPO}}
Category: {{category}}
Cancel Date: {{cancelDate}}

This order is past its cancel date. Please confirm if it has shipped and provide tracking information.

If not yet shipped, please advise on earliest possible ship date.

Thank you,
Rima
Trade Lines Inc.`,
    availableVariables: ORDER_VARS,
  },
  {
    id: "tpl-schedule-shipment",
    category: "schedule-shipment",
    name: "Schedule Pickup",
    description: "Request carrier to schedule pickup for a routed order",
    recipientRole: "carrier",
    sender: "rima@tli.com",
    subjectTemplate: "Schedule Pickup — TLI#{{tliRef}}",
    bodyTemplate: `Hi {{contactName}},

Please schedule a pickup for the following order:

TLI Ref: {{tliRef}}
Customer: {{custCode}}
Warehouse: {{warehouse}}
Cartons: {{cartons}}
Cancel Date: {{cancelDate}}

This order is routed and ready for pickup. Please confirm date and time.

Thank you,
Rima
Trade Lines Inc.`,
    availableVariables: ORDER_VARS,
  },
  {
    id: "tpl-route-picks",
    category: "route-picks",
    name: "Route Pick Tickets",
    description: "Request warehouse to route pick tickets to a carrier",
    recipientRole: "warehouse",
    sender: "rima@tli.com",
    subjectTemplate: "Route Pick Tickets — TLI#{{tliRef}}",
    bodyTemplate: `Hi {{contactName}},

The following pick tickets have been sent but are not yet routed:

TLI Ref: {{tliRef}}
Customer: {{custCode}}
Category: {{category}}
Cartons: {{cartons}}
Cancel Date: {{cancelDate}}

Please route these pick tickets to a carrier as soon as possible.

Thank you,
Rima
Trade Lines Inc.`,
    availableVariables: ORDER_VARS,
  },
  {
    id: "tpl-pick-order",
    category: "pick-order",
    name: "Pick & Ship",
    description: "Request warehouse to generate pick tickets for a direct order",
    recipientRole: "warehouse",
    sender: "rima@tli.com",
    subjectTemplate: "Pick & Ship — TLI#{{tliRef}}",
    bodyTemplate: `Hi {{contactName}},

The following direct order has been received but not yet picked:

TLI Ref: {{tliRef}}
Customer: {{custCode}}
PO#: {{custPO}}
Value: {{salesValue}}

Please generate pick tickets and coordinate shipment.

Thank you,
Rima
Trade Lines Inc.`,
    availableVariables: ORDER_VARS,
  },
]

export function getTemplateByCategory(category: string): EmailTemplate | undefined {
  return defaultTemplates.find((t) => t.category === category)
}
