export type ContainerSection =
  | "not-routed"
  | "do-not-sent"
  | "lfd-not-updated"
  | "not-picked-up"
  | "not-returned"
  | "receiving-pending"

export type UrgencyLevel = "critical" | "urgent" | "warning" | "normal"

export interface Container {
  id: string
  containerNumber: string
  terminal: string
  truckingCompany: string
  shippingLine: string
  warehouse: string
  shipRef: string
  etaDate: string
  doSentDate: string | null
  lfd: string | null
  lfdToReturn: string | null
  pickupDate: string | null
  custType: string
  prodType: string
  diffOfDays: number
  comments: string
  isHot: boolean
  section: ContainerSection
  drayageType: string
  freeDays: number | null
  coast: string
  recvDate: string | null
  urgency: UrgencyLevel
}

export type OrderSection =
  | "open-not-received"
  | "received-not-picked"
  | "pick-tickets-not-sent"
  | "sent-not-routed"
  | "routed-not-scheduled"
  | "scheduled-not-shipped"
  | "invoiced-not-updated"

export type OrderPipeline = "domestic" | "direct"

export interface Order {
  id: string
  tliRef: string
  custCode: string
  custPO: string
  category: string
  salesValue: number
  cancelDate: string
  startDate: string
  status: string
  shipRef: string
  warehouse: string
  cartons: number
  appPallets: number
  pickNo: string
  pickDate: string | null
  scheduleDate: string | null
  section: OrderSection
  pipeline: OrderPipeline
  comments: string
  diffOfDays: number
  curETA: string | null
  origETA: string | null
  urgency: UrgencyLevel
  orderType: string
}

export type ActionPriority = 1 | 2 | 3 | 4
export type ActionStatus = "pending" | "approved" | "sent" | "completed" | "dismissed"

export interface Action {
  id: string
  type: UrgencyLevel
  priority: ActionPriority
  title: string
  description: string
  relatedContainerNumber?: string
  relatedOrderRef?: string
  suggestedAction: string
  assignee: "Jasmin" | "Rima"
  status: ActionStatus
  category: string
  createdAt: string
}

export interface EmailDraft {
  id: string
  actionId: string
  to: string
  from: string
  subject: string
  body: string
  status: "draft" | "ready" | "sent"
  recipientType: "broker" | "drayage" | "warehouse" | "carrier" | "customer"
  relatedContainer?: string
  relatedOrder?: string
  priority: UrgencyLevel
}

export interface DashboardSummary {
  inbound: {
    totalContainers: number
    hotContainers: number
    notRouted: number
    doNotSent: number
    lfdNotUpdated: number
    notPickedUp: number
    notReturned: number
    receivingPending: number
    criticalCount: number
    urgentCount: number
  }
  outbound: {
    totalOrders: number
    domesticRevenue: number
    directRevenue: number
    totalRevenue: number
    pastCancelDate: number
    approachingCancel: number
    receivedNotPicked: number
    routedNotScheduled: number
    scheduledNotShipped: number
  }
  actions: {
    total: number
    critical: number
    urgent: number
    warning: number
    pending: number
  }
}

export const CUSTOMER_MAP: Record<string, string> = {
  RO: "Ross Dress for Less",
  TJ: "TJ Maxx",
  MA: "Marshalls",
  HG: "HomeGoods",
  BU: "Burlington",
  BEL: "Bealls",
  GAB: "Gabriel Brothers",
  HS: "HomeSense",
  SR: "Sierra Trading Post",
}

export const WAREHOUSE_MAP: Record<string, string> = {
  "LA-FTD": "LA - FTD Warehouse",
  "LA-GPA": "LA - GPA Warehouse",
  "LA-TAC": "LA - TAC Warehouse",
  DIRLA: "Direct LA",
}

export const TERMINAL_MAP: Record<string, string> = {
  APM: "APM Terminals",
  PIERA: "Pier A",
  WBCT: "West Basin Container Terminal",
  ITS: "International Transportation Service",
  TRAPAC: "TraPac",
  TTI: "Total Terminals International",
}

export const SHIPPING_LINE_MAP: Record<string, string> = {
  EMC: "Evergreen Marine",
  SML: "SM Line",
  HYN: "HMM (Hyundai)",
  ONE: "Ocean Network Express",
  MRSK: "Maersk",
  WAN: "Wan Hai Lines",
}

export const DRAYAGE_MAP: Record<string, string> = {
  CNC: "CNC Drayage",
  FTDI: "FTD Inc.",
  NRT: "NRT Trucking",
  HWW: "HWW Transport",
  "E-DRAY": "E-Dray Services",
  POETR: "POE Transport",
}
