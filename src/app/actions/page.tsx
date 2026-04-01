import * as React from "react"
import {
  CheckCircle2Icon,
  DownloadIcon,
  FilterIcon,
  MailIcon,
  SearchIcon,
  XCircleIcon,
  ZapIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { actions as initialActions } from "@/lib/rules"
import { generateEmailDraft } from "@/lib/email-templates"
import { exportActionsCsv } from "@/lib/csv-export"
import type { Action, ActionStatus } from "@/data/types"

const URGENCY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-700 border-red-200",
  urgent: "bg-orange-500/10 text-orange-700 border-orange-200",
  warning: "bg-amber-500/10 text-amber-700 border-amber-200",
  normal: "bg-green-500/10 text-green-700 border-green-200",
}

const URGENCY_BG: Record<string, string> = {
  critical: "border-l-red-500",
  urgent: "border-l-orange-500",
  warning: "border-l-amber-500",
  normal: "border-l-green-500",
}

export default function ActionsPage() {
  const [actionList, setActionList] = React.useState<Action[]>(initialActions)
  const [search, setSearch] = React.useState("")
  const [filterType, setFilterType] = React.useState("all")
  const [filterAssignee, setFilterAssignee] = React.useState("all")

  const filtered = actionList.filter((a) => {
    if (filterType !== "all" && a.type !== filterType) return false
    if (filterAssignee !== "all" && a.assignee !== filterAssignee) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.relatedContainerNumber?.toLowerCase().includes(q) ?? false) ||
        (a.relatedOrderRef?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const updateStatus = (actionId: string, status: ActionStatus) => {
    setActionList((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status } : a))
    )
    if (status === "approved") {
      toast.success("Action approved — email draft generated")
    } else if (status === "dismissed") {
      toast.info("Action dismissed")
    }
  }

  const counts = {
    total: actionList.length,
    critical: actionList.filter((a) => a.type === "critical").length,
    urgent: actionList.filter((a) => a.type === "urgent").length,
    warning: actionList.filter((a) => a.type === "warning").length,
    pending: actionList.filter((a) => a.status === "pending").length,
    approved: actionList.filter((a) => a.status === "approved").length,
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 md:grid-cols-5">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Critical</div>
                  <div className="text-2xl font-bold">{counts.critical}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Urgent</div>
                  <div className="text-2xl font-bold">{counts.urgent}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Warning</div>
                  <div className="text-2xl font-bold">{counts.warning}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold">{counts.pending}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Approved</div>
                  <div className="text-2xl font-bold">{counts.approved}</div>
                </CardContent>
              </Card>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 lg:px-6">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search actions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  <SelectItem value="Jasmin">Jasmin</SelectItem>
                  <SelectItem value="Rima">Rima</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportActionsCsv(actionList)}
                >
                  <DownloadIcon className="mr-1 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Action list */}
            <div className="flex flex-col gap-3 px-4 lg:px-6">
              {filtered.map((action) => (
                <Card
                  key={action.id}
                  className={`border-l-4 ${URGENCY_BG[action.type]} ${action.status === "approved" ? "opacity-60" : ""} ${action.status === "dismissed" ? "opacity-40" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`${URGENCY_COLORS[action.type]} text-xs`}
                          >
                            {action.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {action.assignee}
                          </Badge>
                          {action.status !== "pending" && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${action.status === "approved" ? "bg-green-500/10 text-green-700" : "bg-gray-500/10 text-gray-700"}`}
                            >
                              {action.status}
                            </Badge>
                          )}
                          {action.relatedContainerNumber && (
                            <span className="text-xs font-mono text-muted-foreground">
                              {action.relatedContainerNumber}
                            </span>
                          )}
                          {action.relatedOrderRef && (
                            <span className="text-xs font-mono text-muted-foreground">
                              TLI#{action.relatedOrderRef}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-sm">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.description}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                          <strong>Suggested:</strong> {action.suggestedAction}
                        </div>
                      </div>
                      {action.status === "pending" && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => updateStatus(action.id, "approved")}
                          >
                            <CheckCircle2Icon className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const draft = generateEmailDraft(action)
                              toast.success(
                                `Email draft generated for ${draft.recipientType}`
                              )
                              updateStatus(action.id, "approved")
                            }}
                          >
                            <MailIcon className="mr-1 h-3 w-3" />
                            Send Email
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => updateStatus(action.id, "dismissed")}
                          >
                            <XCircleIcon className="mr-1 h-3 w-3" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ZapIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p>No actions match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
