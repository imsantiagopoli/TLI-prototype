import * as React from "react"
import {
  DownloadIcon,
  SearchIcon,
  AlertTriangleIcon,
  UploadIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  orders,
  AT22_DOMESTIC_SECTIONS,
  AT22_DIRECT_SECTIONS,
  getDomesticOrders,
  getDirectOrders,
  getTotalRevenue,
} from "@/data/at22-data"
import { CUSTOMER_MAP } from "@/data/types"
import { exportOrdersCsv } from "@/lib/csv-export"

const URGENCY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-700 border-red-200",
  urgent: "bg-orange-500/10 text-orange-700 border-orange-200",
  warning: "bg-amber-500/10 text-amber-700 border-amber-200",
  normal: "bg-green-500/10 text-green-700 border-green-200",
}

function OrderTable({ data }: { data: typeof orders }) {
  const sorted = [...data].sort((a, b) => {
    const urgencyOrder = { critical: 0, urgent: 1, warning: 2, normal: 3 }
    return (
      urgencyOrder[a.urgency] - urgencyOrder[b.urgency] ||
      a.diffOfDays - b.diffOfDays
    )
  })

  return (
    <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>TLI Ref#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>PO#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Cancel Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Cartons</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Urgency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((o) => (
              <TableRow
                key={o.id}
                className={
                  o.urgency === "critical"
                    ? "bg-red-50/50 dark:bg-red-950/10"
                    : o.urgency === "urgent"
                      ? "bg-orange-50/30 dark:bg-orange-950/10"
                      : ""
                }
              >
                <TableCell className="font-mono text-sm font-medium">
                  {o.tliRef}
                </TableCell>
                <TableCell className="text-sm">
                  <span title={CUSTOMER_MAP[o.custCode] || o.custCode}>
                    {o.custCode}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-mono">{o.custPO}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {o.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {o.salesValue > 0 ? `$${o.salesValue.toLocaleString()}` : "—"}
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap">
                  {o.cancelDate}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {AT22_DOMESTIC_SECTIONS[o.section] ||
                    AT22_DIRECT_SECTIONS[o.section] ||
                    o.section}
                </TableCell>
                <TableCell className="text-sm">{o.warehouse}</TableCell>
                <TableCell className="text-sm">
                  {o.cartons > 0 ? o.cartons : "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-medium ${o.diffOfDays < 0 ? "text-red-600" : o.diffOfDays <= 3 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {o.diffOfDays > 0 ? `+${o.diffOfDays}` : o.diffOfDays}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${URGENCY_COLORS[o.urgency]} text-xs`}
                  >
                    {o.urgency}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}

export default function OutboundPage() {
  const [search, setSearch] = React.useState("")
  const domesticOrders = getDomesticOrders()
  const directOrders = getDirectOrders()

  const filterOrders = (orderList: typeof orders) =>
    search
      ? orderList.filter(
          (o) =>
            o.tliRef.toLowerCase().includes(search.toLowerCase()) ||
            o.custCode.toLowerCase().includes(search.toLowerCase()) ||
            o.custPO.toLowerCase().includes(search.toLowerCase()) ||
            o.category.toLowerCase().includes(search.toLowerCase())
        )
      : orderList

  const domesticRevenue = getTotalRevenue("domestic")
  const directRevenue = getTotalRevenue("direct")
  const criticalOrders = orders.filter((o) => o.urgency === "critical")
  const urgentOrders = orders.filter((o) => o.urgency === "urgent")

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 md:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Domestic Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">
                    ${domesticRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {domesticOrders.length} orders
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-violet-500">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Direct Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">
                    ${directRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {directOrders.length} orders
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Critical Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">{criticalOrders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Past cancel date or overdue
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Urgent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">{urgentOrders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Approaching deadlines
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 lg:px-6">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById("pdf-upload-outbound")?.click()}>
                  <UploadIcon className="mr-1 h-4 w-4" />
                  Upload PDF
                </Button>
                <input id="pdf-upload-outbound" type="file" accept=".pdf" className="hidden" onChange={() => {}} />
                <Button variant="outline" size="sm" onClick={exportOrdersCsv}>
                  <DownloadIcon className="mr-1 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="domestic">
                <TabsList>
                  <TabsTrigger value="domestic">
                    Domestic
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                    >
                      {domesticOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="direct">
                    Direct (POE)
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                    >
                      {directOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All Orders
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                    >
                      {orders.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="domestic" className="mt-4">
                  <OrderTable data={filterOrders(domesticOrders)} />
                </TabsContent>
                <TabsContent value="direct" className="mt-4">
                  <OrderTable data={filterOrders(directOrders)} />
                </TabsContent>
                <TabsContent value="all" className="mt-4">
                  <OrderTable data={filterOrders(orders)} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
