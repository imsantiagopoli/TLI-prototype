import { useLocation } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PAGE_TITLES: Record<string, string> = {
  "/": "Operations Dashboard",
  "/inbound": "Inbound Container Tracking (AT21)",
  "/outbound": "Outbound Orders Monitor (AT22)",
  "/actions": "Action Queue",
  "/emails": "Email Center",
  "/reports": "Reports & Export",
  "/contacts": "Contacts Directory",
}

export function SiteHeader() {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || "TLI Operations"

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <Badge variant="outline" className="ml-2 text-xs font-normal text-muted-foreground">
          Report: Mar 25, 2026 7:04 AM
        </Badge>
      </div>
    </header>
  )
}
