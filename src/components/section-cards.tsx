import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Badge variant="outline" className="flex gap-1 text-xs">
            <TrendingUpIcon className="h-3 w-3" />
            +12.5%
          </Badge>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div className="text-2xl font-bold">$1,250.00</div>
          <p className="text-xs text-muted-foreground">
            Trending up this month
          </p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          <Badge variant="outline" className="flex gap-1 text-xs">
            <TrendingDownIcon className="h-3 w-3" />
            -20%
          </Badge>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">
            Down 20% this period
          </p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          <Badge variant="outline" className="flex gap-1 text-xs">
            <TrendingUpIcon className="h-3 w-3" />
            +12.5%
          </Badge>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div className="text-2xl font-bold">45,678</div>
          <p className="text-xs text-muted-foreground">
            Strong user retention
          </p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <Badge variant="outline" className="flex gap-1 text-xs">
            <TrendingUpIcon className="h-3 w-3" />
            +4.5%
          </Badge>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div className="text-2xl font-bold">4.5%</div>
          <p className="text-xs text-muted-foreground">
            Steady performance
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}