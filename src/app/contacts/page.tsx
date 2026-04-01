import * as React from "react"
import {
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  TagIcon,
  UserIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { contacts, type Contact, type ContactRole } from "@/data/contacts"
import {
  SHIPPING_LINE_MAP,
  DRAYAGE_MAP,
  WAREHOUSE_MAP,
  CUSTOMER_MAP,
} from "@/data/types"

const ROLE_COLORS: Record<ContactRole, string> = {
  broker: "bg-blue-500/10 text-blue-700 border-blue-200",
  drayage: "bg-orange-500/10 text-orange-700 border-orange-200",
  warehouse: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  carrier: "bg-violet-500/10 text-violet-700 border-violet-200",
  customer: "bg-pink-500/10 text-pink-700 border-pink-200",
  forwarder: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
}

const ROLE_LABELS: Record<ContactRole, string> = {
  broker: "Customs Broker",
  drayage: "Drayage Company",
  warehouse: "Warehouse",
  carrier: "Carrier",
  customer: "Customer",
  forwarder: "Freight Forwarder",
}

function resolveKeyLabel(role: ContactRole, key: string): string {
  const maps: Partial<Record<ContactRole, Record<string, string>>> = {
    broker: SHIPPING_LINE_MAP,
    drayage: DRAYAGE_MAP,
    warehouse: WAREHOUSE_MAP,
    carrier: CUSTOMER_MAP,
  }
  return maps[role]?.[key] ?? key
}

function matchDescription(role: ContactRole): string {
  switch (role) {
    case "broker":
      return "Matched by Shipping Line on container"
    case "drayage":
      return "Matched by Drayage/Product Code on container"
    case "warehouse":
      return "Matched by Warehouse Code on container or order"
    case "carrier":
      return "Matched by Customer Code on outbound order"
    default:
      return ""
  }
}

export default function ContactsPage() {
  const [search, setSearch] = React.useState("")
  const [filterRole, setFilterRole] = React.useState("all")

  const filtered = contacts.filter((c) => {
    if (filterRole !== "all" && c.role !== filterRole) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.matchKeys.some((k) => k.toLowerCase().includes(q)) ||
        c.notes.toLowerCase().includes(q)
      )
    }
    return true
  })

  const byRole = (role: ContactRole) => filtered.filter((c) => c.role === role)

  const roles: ContactRole[] = ["broker", "drayage", "warehouse", "carrier"]
  const roleCounts = roles.map((r) => ({
    role: r,
    count: contacts.filter((c) => c.role === r).length,
  }))

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 md:grid-cols-4">
              {roleCounts.map(({ role, count }) => (
                <Card key={role} className={`border-l-4 ${ROLE_COLORS[role].includes("blue") ? "border-l-blue-500" : ROLE_COLORS[role].includes("orange") ? "border-l-orange-500" : ROLE_COLORS[role].includes("emerald") ? "border-l-emerald-500" : "border-l-violet-500"}`}>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">{ROLE_LABELS[role]}s</div>
                    <div className="text-2xl font-bold">{count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 lg:px-6">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="broker">Customs Brokers</SelectItem>
                  <SelectItem value="drayage">Drayage Companies</SelectItem>
                  <SelectItem value="warehouse">Warehouses</SelectItem>
                  <SelectItem value="carrier">Carriers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto-detection rules */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    Auto-Detection Rules
                  </CardTitle>
                  <CardDescription>
                    How the system automatically selects the right recipient for each email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {roles.map((role) => (
                      <div key={role} className="rounded-md border p-3">
                        <Badge variant="outline" className={`${ROLE_COLORS[role]} text-xs mb-2`}>
                          {ROLE_LABELS[role]}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {matchDescription(role)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {contacts
                            .filter((c) => c.role === role)
                            .flatMap((c) => c.matchKeys)
                            .map((key) => (
                              <Badge key={key} variant="secondary" className="text-[10px] font-mono">
                                {key}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact directory by role */}
            {roles.map((role) => {
              const roleContacts = byRole(role)
              if (roleContacts.length === 0) return null
              return (
                <div key={role} className="px-4 lg:px-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${ROLE_COLORS[role]}`}>
                          {ROLE_LABELS[role]}s
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {matchDescription(role)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ContactTable contacts={roleContacts} role={role} />
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ContactTable({ contacts: items, role }: { contacts: Contact[]; role: ContactRole }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Match Keys</TableHead>
          <TableHead className="hidden lg:table-cell">Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium whitespace-nowrap">{c.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="whitespace-nowrap">{c.company}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <MailIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-sm text-blue-600">{c.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <PhoneIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-sm">{c.phone}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {c.matchKeys.map((k) => (
                  <Badge key={k} variant="secondary" className="text-[10px] font-mono">
                    {k} → {resolveKeyLabel(role, k)}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <span className="text-xs text-muted-foreground">{c.notes}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
