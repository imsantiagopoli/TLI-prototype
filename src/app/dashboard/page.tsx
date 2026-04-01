import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy loading de componentes pesados
const SectionCards = React.lazy(() => import("@/components/section-cards").then(m => ({ default: m.SectionCards })))
const ChartAreaInteractive = React.lazy(() => import("@/components/chart-area-interactive").then(m => ({ default: m.ChartAreaInteractive })))
const DataTable = React.lazy(() => import("@/components/data-table").then(m => ({ default: m.DataTable })))

import data from "./data.json"

// Loading component for dashboard
const DashboardLoading = () => (
  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    {/* Section cards skeleton */}
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    
    {/* Chart skeleton */}
    <div className="px-4 lg:px-6">
      <Skeleton className="h-96 w-full" />
    </div>
    
    {/* Data table skeleton */}
    <div className="px-4 lg:px-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  </div>
)

export default function Page() {
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
                <div className="px-4 lg:px-6">
                  <DataTable data={data} />
                </div>
              </React.Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}