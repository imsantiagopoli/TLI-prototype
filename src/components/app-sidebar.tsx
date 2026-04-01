import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  AnchorIcon,
  BarChart3Icon,
  BookUserIcon,
  ClipboardListIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MailIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShipIcon,
  ZapIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Dhaval Jhaveri",
    email: "dhaval@tli.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Inbound (AT21)",
      url: "/inbound",
      icon: AnchorIcon,
    },
    {
      title: "Outbound (AT22)",
      url: "/outbound",
      icon: PackageIcon,
    },
    {
      title: "Action Queue",
      url: "/actions",
      icon: ZapIcon,
    },
    {
      title: "Email Center",
      url: "/emails",
      icon: MailIcon,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: BookUserIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Reports & Export",
      url: "/reports",
      icon: FileTextIcon,
    },
    {
      name: "AT21 Report (PDF)",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "AT22 Report (PDF)",
      url: "#",
      icon: ClipboardListIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ShipIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TLI Home</span>
                  <span className="truncate text-xs">Operations Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
