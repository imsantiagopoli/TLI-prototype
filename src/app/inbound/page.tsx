import * as React from "react"
import {
  AlertTriangleIcon,
  DownloadIcon,
  FlameIcon,
  SearchIcon,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  containers,
  AT21_SECTION_LABELS,
  AT21_SECTION_ORDER,
  getContainersBySection,
} from "@/data/at21-data"
import { CUSTOMER_MAP, SHIPPING_LINE_MAP, TERMINAL_MAP } from "@/data/types"
import { exportContainersCsv } from "@/lib/csv-export"

const URGENCY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-700 border-red-200",
  urgent: "bg-orange-500/10 text-orange-700 border-orange-200",
  warning: "bg-amber-500/10 text-amber-700 border-amber-200",
  normal: "bg-green-500/10 text-green-700 border-green-200",
}

const SECTION_COLORS: Record<string, string> = {
  "not-routed": "border-l-amber-500",
  "do-not-sent": "border-l-red-500",
  "lfd-not-updated": "border-l-orange-500",
  "not-picked-up": "border-l-violet-500",
  "not-returned": "border-l-blue-500",
  "receiving-pending": "border-l-cyan-500",
}

export default function InboundPage() {
  const [search, setSearch] = React.useState("")
  const [activeSection, setActiveSection] = React.useState("all")

  const filteredContainers =
    activeSection === "all"
      ? containers
      : getContainersBySection(activeSection)

  const searched = search
    ? filteredContainers.filter(
        (c) =>
          c.containerNumber.toLowerCase().includes(search.toLowerCase()) ||
          c.comments.toLowerCase().includes(search.toLowerCase()) ||
          c.shippingLine.toLowerCase().includes(search.toLowerCase()) ||
          c.terminal.toLowerCase().includes(search.toLowerCase())
      )
    : filteredContainers

  const hotFirst = [...searched].sort((a, b) => {
    if (a.isHot && !b.isHot) return -1
    if (!a.isHot && b.isHot) return 1
    const urgencyOrder = { critical: 0, urgent: 1, warning: 2, normal: 3 }
    return (
      urgencyOrder[a.urgency] - urgencyOrder[b.urgency] ||
      a.diffOfDays - b.diffOfDays
    )
  })

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Section summary cards */}
            <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 md:grid-cols-3 lg:grid-cols-6">
              {AT21_SECTION_ORDER.map((section) => {
                const sectionContainers = getContainersBySection(section)
                const critCount = sectionContainers.filter(
                  (c) => c.urgency === "critical" || c.isHot
                ).length
                return (
                  <Card
                    key={section}
                    className={`cursor-pointer border-l-4 ${SECTION_COLORS[section]} transition-colors hover:bg-muted/50 ${activeSection === section ? "ring-2 ring-primary" : ""}`}
                    onClick={() =>
                      setActiveSection(activeSection === section ? "all" : section)
                    }
                  >
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                        {AT21_SECTION_LABELS[section]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold">
                          {sectionContainers.length}
                        </span>
                        {critCount > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-700 border-red-200 text-xs"
                          >
                            {critCount} critical
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 lg:px-6">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search containers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              {activeSection !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSection("all")}
                >
                  Clear filter
                </Button>
              )}
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById("pdf-upload-inbound")?.click()}>
                  <UploadIcon className="mr-1 h-4 w-4" />
                  Upload PDF
                </Button>
                <input id="pdf-upload-inbound" type="file" accept=".pdf" className="hidden" onChange={() => {}} />
                <Button variant="outline" size="sm" onClick={exportContainersCsv}>
                  <DownloadIcon className="mr-1 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="px-4 lg:px-6">
              <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Container #</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Terminal</TableHead>
                        <TableHead>Shipping Line</TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>Ship Ref</TableHead>
                        <TableHead>ETA Date</TableHead>
                        <TableHead>LFD</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead className="max-w-[200px]">Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotFirst.map((c) => (
                        <TableRow
                          key={c.id}
                          className={
                            c.isHot
                              ? "bg-red-50 dark:bg-red-950/20"
                              : c.urgency === "critical"
                                ? "bg-red-50/50 dark:bg-red-950/10"
                                : ""
                          }
                        >
                          <TableCell>
                            {c.isHot && (
                              <FlameIcon className="h-4 w-4 text-red-500" />
                            )}
                            {!c.isHot && c.urgency === "critical" && (
                              <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">
                            {c.containerNumber}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs whitespace-nowrap"
                            >
                              {AT21_SECTION_LABELS[c.section]?.split("—")[0]?.trim() ||
                                c.section}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {c.terminal}
                          </TableCell>
                          <TableCell className="text-sm">{c.shippingLine}</TableCell>
                          <TableCell className="text-sm">{c.warehouse}</TableCell>
                          <TableCell className="text-sm">{c.shipRef}</TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {c.etaDate}
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {c.lfd || c.lfdToReturn || "—"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-sm font-medium ${c.diffOfDays < 0 ? "text-red-600" : c.diffOfDays <= 2 ? "text-orange-600" : "text-green-600"}`}
                            >
                              {c.diffOfDays > 0 ? `+${c.diffOfDays}` : c.diffOfDays}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${URGENCY_COLORS[c.urgency]} text-xs`}
                            >
                              {c.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                            {c.comments}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Showing {hotFirst.length} of {containers.length} container records
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
