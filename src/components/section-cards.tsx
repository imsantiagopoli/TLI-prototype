import {
  AlertTriangleIcon,
  AnchorIcon,
  DollarSignIcon,
  FlameIcon,
  PackageIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { containers } from "@/data/at21-data"
import { orders } from "@/data/at22-data"
import { actions } from "@/lib/rules"

export function SectionCards() {
  const hotCount = containers.filter((c) => c.isHot).length
  const criticalContainers = containers.filter((c) => c.urgency === "critical").length
  const uniqueContainers = new Set(containers.map((c) => c.containerNumber)).size

  const totalRevenue = orders.reduce((sum, o) => sum + o.salesValue, 0)
  const criticalOrders = orders.filter((o) => o.urgency === "critical").length
  const pastCancelDate = orders.filter((o) => o.diffOfDays < 0).length

  const pendingActions = actions.filter((a) => a.status === "pending").length
  const criticalActions = actions.filter((a) => a.type === "critical").length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HOT Containers</CardTitle>
          <FlameIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div>
            <div className="text-2xl font-bold">{hotCount}</div>
            <p className="text-xs text-muted-foreground">
              {criticalContainers} critical across {uniqueContainers} total containers
            </p>
          </div>
        </CardFooter>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue at Risk</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div>
            <div className="text-2xl font-bold">
              ${(totalRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              ${totalRevenue.toLocaleString()} across all active orders
            </p>
          </div>
        </CardFooter>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Past Cancel Date</CardTitle>
          <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div>
            <div className="text-2xl font-bold">{pastCancelDate}</div>
            <p className="text-xs text-muted-foreground">
              {criticalOrders} critical orders needing immediate action
            </p>
          </div>
        </CardFooter>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          <ZapIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div>
            <div className="text-2xl font-bold">{pendingActions}</div>
            <p className="text-xs text-muted-foreground">
              {criticalActions} critical, ready to process
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
