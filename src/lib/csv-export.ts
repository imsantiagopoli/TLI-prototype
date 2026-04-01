import { containers } from "@/data/at21-data"
import { orders } from "@/data/at22-data"
import type { Action } from "@/data/types"

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function exportContainersCsv() {
  const headers = [
    "Container#",
    "Section",
    "Terminal",
    "Shipping Line",
    "Warehouse",
    "Ship Ref",
    "ETA Date",
    "D/O Sent",
    "LFD",
    "LFD to Return",
    "Pickup Date",
    "Customer Type",
    "Drayage Type",
    "Days Diff",
    "Urgency",
    "HOT",
    "Comments",
  ]

  const rows = containers.map((c) =>
    [
      c.containerNumber,
      c.section,
      c.terminal,
      c.shippingLine,
      c.warehouse,
      c.shipRef,
      c.etaDate,
      c.doSentDate,
      c.lfd,
      c.lfdToReturn,
      c.pickupDate,
      c.custType,
      c.drayageType,
      c.diffOfDays,
      c.urgency,
      c.isHot ? "YES" : "",
      c.comments,
    ].map(escapeCsv).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")
  downloadCsv(`TLI_AT21_Containers_${new Date().toISOString().slice(0, 10)}.csv`, csv)
}

export function exportOrdersCsv() {
  const headers = [
    "TLI Ref#",
    "Pipeline",
    "Section",
    "Customer",
    "PO#",
    "Category",
    "Sales Value",
    "Cancel Date",
    "Start Date",
    "Status",
    "Ship Ref",
    "Warehouse",
    "Cartons",
    "Pallets",
    "Days Diff",
    "Urgency",
    "Comments",
  ]

  const rows = orders.map((o) =>
    [
      o.tliRef,
      o.pipeline,
      o.section,
      o.custCode,
      o.custPO,
      o.category,
      o.salesValue,
      o.cancelDate,
      o.startDate,
      o.status,
      o.shipRef,
      o.warehouse,
      o.cartons,
      o.appPallets,
      o.diffOfDays,
      o.urgency,
      o.comments,
    ].map(escapeCsv).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")
  downloadCsv(`TLI_AT22_Orders_${new Date().toISOString().slice(0, 10)}.csv`, csv)
}

export function exportActionsCsv(actions: Action[]) {
  const headers = [
    "Priority",
    "Type",
    "Title",
    "Description",
    "Container#",
    "Order Ref",
    "Suggested Action",
    "Assignee",
    "Status",
    "Category",
  ]

  const rows = actions.map((a) =>
    [
      a.priority,
      a.type,
      a.title,
      a.description,
      a.relatedContainerNumber,
      a.relatedOrderRef,
      a.suggestedAction,
      a.assignee,
      a.status,
      a.category,
    ].map(escapeCsv).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")
  downloadCsv(`TLI_Actions_${new Date().toISOString().slice(0, 10)}.csv`, csv)
}

export function exportFullReport() {
  exportContainersCsv()
  setTimeout(() => exportOrdersCsv(), 500)
}
