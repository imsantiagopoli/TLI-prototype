import * as React from "react"
import { Link } from "react-router-dom"
import {
  AnchorIcon,
  ArrowRightIcon,
  PackageIcon,
  ZapIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { containers, AT21_SECTION_LABELS, getContainersBySection } from "@/data/at21-data"
import { orders, AT22_DOMESTIC_SECTIONS, getDomesticOrders, getDirectOrders, getTotalRevenue } from "@/data/at22-data"
import { actions } from "@/lib/rules"

const SectionCards = React.lazy(() =>
  import("@/components/section-cards").then((m) => ({ default: m.SectionCards }))
)
const ChartAreaInteractive = React.lazy(() =>
  import("@/components/chart-area-interactive").then((m) => ({
    default: m.ChartAreaInteractive,
  }))
)

const DashboardLoading = () => (
  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="px-4 lg:px-6">
      <Skeleton className="h-96 w-full" />
    </div>
  </div>
)

const URGENCY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-700 border-red-200",
  urgent: "bg-orange-500/10 text-orange-700 border-orange-200",
  warning: "bg-amber-500/10 text-amber-700 border-amber-200",
  normal: "bg-green-500/10 text-green-700 border-green-200",
}

export default function Page() {
  const inboundSections = [
    "not-routed",
    "do-not-sent",
    "lfd-not-updated",
    "not-picked-up",
    "not-returned",
    "receiving-pending",
  ]

  const domesticOrders = getDomesticOrders()
  const directOrders = getDirectOrders()
  const domesticRevenue = getTotalRevenue("domestic")
  const directRevenue = getTotalRevenue("direct")
  const criticalActions = actions.filter((a) => a.type === "critical").slice(0, 5)

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <React.Suspense fallback={<DashboardLoading />}>
                <div className="px-4 lg:px-6">
                  <SectionCards />
                </div>

                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>

                <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Inbound Summary */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-base">Inbound Pipeline</CardTitle>
                        <CardDescription>AT21 Container Tracking</CardDescription>
                      </div>
                      <AnchorIcon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {inboundSections.map((section) => {
                          const sectionContainers = getContainersBySection(section)
                          const critCount = sectionContainers.filter(
                            (c) => c.urgency === "critical" || c.urgency === "urgent"
                          ).length
                          return (
                            <div
                              key={section}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {AT21_SECTION_LABELS[section]}
                              </span>
                              <div className="flex items-center gap-2">
                                {critCount > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-500/10 text-red-700 border-red-200 text-xs"
                                  >
                                    {critCount}
                                  </Badge>
                                )}
                                <span className="font-medium">
                                  {sectionContainers.length}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <Link to="/inbound">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 w-full justify-between"
                        >
                          View all containers
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Outbound Summary */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-base">Outbound Pipeline</CardTitle>
                        <CardDescription>AT22 Orders Monitor</CardDescription>
                      </div>
                      <PackageIcon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Domestic
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{domesticOrders.length} orders</span>
                            <span className="font-medium">
                              ${domesticRevenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Direct (POE)
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{directOrders.length} orders</span>
                            <span className="font-medium">
                              ${directRevenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Revenue Under Management</span>
                            <span>
                              ${(domesticRevenue + directRevenue).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link to="/outbound">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 w-full justify-between"
                        >
                          View all orders
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Action Queue Preview */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-base">Critical Actions</CardTitle>
                        <CardDescription>
                          Top priority items requiring attention
                        </CardDescription>
                      </div>
                      <ZapIcon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {criticalActions.map((action) => (
                          <div
                            key={action.id}
                            className="rounded-md border p-2 text-sm"
                          >
                            <div className="flex items-start gap-2">
                              <Badge
                                variant="outline"
                                className={`${URGENCY_COLORS[action.type]} text-xs shrink-0 mt-0.5`}
                              >
                                {action.type}
                              </Badge>
                              <span className="line-clamp-2">{action.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link to="/actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 w-full justify-between"
                        >
                          View all {actions.length} actions
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </React.Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
