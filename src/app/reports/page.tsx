import * as React from "react"
import {
  BarChart3Icon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { containers, AT21_SECTION_LABELS, getContainersBySection } from "@/data/at21-data"
import { orders, getDomesticOrders, getDirectOrders, getTotalRevenue } from "@/data/at22-data"
import { actions } from "@/lib/rules"
import {
  exportContainersCsv,
  exportOrdersCsv,
  exportActionsCsv,
  exportFullReport,
} from "@/lib/csv-export"
import { CUSTOMER_MAP } from "@/data/types"

export default function ReportsPage() {
  const domesticRevenue = getTotalRevenue("domestic")
  const directRevenue = getTotalRevenue("direct")
  const totalRevenue = domesticRevenue + directRevenue

  const inboundSections = [
    "not-routed",
    "do-not-sent",
    "lfd-not-updated",
    "not-picked-up",
    "not-returned",
    "receiving-pending",
  ]

  const customerBreakdown = orders.reduce(
    (acc, o) => {
      const key = o.custCode
      if (!acc[key]) acc[key] = { count: 0, revenue: 0 }
      acc[key].count++
      acc[key].revenue += o.salesValue
      return acc
    },
    {} as Record<string, { count: number; revenue: number }>
  )

  const sortedCustomers = Object.entries(customerBreakdown).sort(
    ([, a], [, b]) => b.revenue - a.revenue
  )

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Export buttons */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Reports</CardTitle>
                  <CardDescription>
                    Download structured data as CSV for ERP import or offline analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-1 p-4"
                      onClick={() => {
                        exportContainersCsv()
                        toast.success("AT21 Containers CSV downloaded")
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileSpreadsheetIcon className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">AT21 Containers</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {containers.length} container records with all tracking data
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-1 p-4"
                      onClick={() => {
                        exportOrdersCsv()
                        toast.success("AT22 Orders CSV downloaded")
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileSpreadsheetIcon className="h-5 w-5 text-violet-500" />
                        <span className="font-medium">AT22 Orders</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {orders.length} order records with values and dates
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-1 p-4"
                      onClick={() => {
                        exportActionsCsv(actions)
                        toast.success("Actions CSV downloaded")
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Action Queue</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {actions.length} auto-generated actions with priorities
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-1 p-4"
                      onClick={() => {
                        exportFullReport()
                        toast.success("Full report download started")
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <DownloadIcon className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Full Report</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Download all datasets as separate CSV files
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary report */}
            <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
              {/* Inbound Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Inbound Summary (AT21)
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Container status by pipeline stage — March 25, 2026
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Critical</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inboundSections.map((section) => {
                        const sc = getContainersBySection(section)
                        const crit = sc.filter(
                          (c) => c.urgency === "critical" || c.isHot
                        ).length
                        return (
                          <TableRow key={section}>
                            <TableCell className="text-sm">
                              {AT21_SECTION_LABELS[section]}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {sc.length}
                            </TableCell>
                            <TableCell className="text-right">
                              {crit > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="bg-red-500/10 text-red-700 border-red-200 text-xs"
                                >
                                  {crit}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow className="font-medium">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {containers.length}
                        </TableCell>
                        <TableCell className="text-right">
                          {containers.filter(
                            (c) => c.urgency === "critical" || c.isHot
                          ).length}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Customer breakdown */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Revenue by Customer
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Order value distribution across customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCustomers.map(([code, data]) => (
                        <TableRow key={code}>
                          <TableCell className="text-sm">
                            <span className="font-medium">{code}</span>
                            <span className="text-muted-foreground ml-1 text-xs">
                              {CUSTOMER_MAP[code] || ""}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{data.count}</TableCell>
                          <TableCell className="text-right font-medium">
                            {data.revenue > 0
                              ? `$${data.revenue.toLocaleString()}`
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{orders.length}</TableCell>
                        <TableCell className="text-right">
                          ${totalRevenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline overview */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Outbound Revenue Pipeline
                  </CardTitle>
                  <CardDescription>
                    Total revenue under active management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">
                        Domestic Pipeline
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        ${domesticRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getDomesticOrders().length} orders
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">
                        Direct Pipeline
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        ${directRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getDirectOrders().length} orders
                      </div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="text-sm font-medium">
                        Total Under Management
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        ${totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Requires daily human attention
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
