import * as React from "react"
import {
  CheckCircle2Icon,
  CopyIcon,
  FileTextIcon,
  MailIcon,
  PencilIcon,
  RotateCcwIcon,
  SaveIcon,
  SearchIcon,
  SendIcon,
  VariableIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { actions } from "@/lib/rules"
import { generateAllDrafts, setUserTemplates } from "@/lib/email-templates"
import { defaultTemplates, type EmailTemplate } from "@/data/email-template-defaults"
import type { EmailDraft } from "@/data/types"

const URGENCY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-700 border-red-200",
  urgent: "bg-orange-500/10 text-orange-700 border-orange-200",
  warning: "bg-amber-500/10 text-amber-700 border-amber-200",
  normal: "bg-green-500/10 text-green-700 border-green-200",
}

const RECIPIENT_LABELS: Record<string, string> = {
  broker: "Broker",
  drayage: "Drayage Co.",
  warehouse: "Warehouse",
  carrier: "Carrier",
  customer: "Customer",
}

const ROLE_BADGE_COLORS: Record<string, string> = {
  broker: "bg-blue-500/10 text-blue-700 border-blue-200",
  drayage: "bg-orange-500/10 text-orange-700 border-orange-200",
  warehouse: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  carrier: "bg-violet-500/10 text-violet-700 border-violet-200",
  customer: "bg-pink-500/10 text-pink-700 border-pink-200",
  forwarder: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
}

export default function EmailsPage() {
  const [templates, setTemplates] = React.useState<EmailTemplate[]>(
    () => structuredClone(defaultTemplates)
  )
  const [drafts, setDrafts] = React.useState<EmailDraft[]>(() =>
    generateAllDrafts(actions)
  )
  const [search, setSearch] = React.useState("")
  const [filterType, setFilterType] = React.useState("all")
  const [selectedDraft, setSelectedDraft] = React.useState<EmailDraft | null>(null)
  const [editingTemplate, setEditingTemplate] = React.useState<EmailTemplate | null>(null)

  const regenerateDrafts = React.useCallback((tpls: EmailTemplate[]) => {
    setUserTemplates(tpls)
    setDrafts(generateAllDrafts(actions))
  }, [])

  const filtered = drafts.filter((d) => {
    if (filterType !== "all" && d.recipientType !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        d.subject.toLowerCase().includes(q) ||
        d.body.toLowerCase().includes(q) ||
        d.to.toLowerCase().includes(q) ||
        (d.relatedContainer?.toLowerCase().includes(q) ?? false) ||
        (d.relatedOrder?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const readyDrafts = filtered.filter((d) => d.status === "ready")
  const sentDrafts = filtered.filter((d) => d.status === "sent")

  const sendEmail = (draftId: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: "sent" as const } : d))
    )
    toast.success("Email sent successfully")
    setSelectedDraft(null)
  }

  const sendAll = () => {
    setDrafts((prev) =>
      prev.map((d) => (d.status === "ready" ? { ...d, status: "sent" as const } : d))
    )
    toast.success(`${readyDrafts.length} emails sent`)
  }

  const saveTemplate = (updated: EmailTemplate) => {
    const next = templates.map((t) => (t.id === updated.id ? updated : t))
    setTemplates(next)
    regenerateDrafts(next)
    setEditingTemplate(null)
    toast.success(`Template "${updated.name}" saved — ${drafts.length} drafts regenerated`)
  }

  const resetTemplate = (id: string) => {
    const original = defaultTemplates.find((t) => t.id === id)
    if (!original) return
    const next = templates.map((t) => (t.id === id ? structuredClone(original) : t))
    setTemplates(next)
    regenerateDrafts(next)
    toast.success("Template reset to default")
  }

  const resetAll = () => {
    const next = structuredClone(defaultTemplates)
    setTemplates(next)
    regenerateDrafts(next)
    toast.success("All templates reset to defaults")
  }

  const isModified = (tpl: EmailTemplate) => {
    const original = defaultTemplates.find((t) => t.id === tpl.id)
    if (!original) return false
    return (
      tpl.subjectTemplate !== original.subjectTemplate ||
      tpl.bodyTemplate !== original.bodyTemplate ||
      tpl.sender !== original.sender
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 md:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Total Drafts</div>
                  <div className="text-2xl font-bold">{drafts.length}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Ready to Send</div>
                  <div className="text-2xl font-bold">
                    {drafts.filter((d) => d.status === "ready").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Sent</div>
                  <div className="text-2xl font-bold">
                    {drafts.filter((d) => d.status === "sent").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-violet-500">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Templates</div>
                  <div className="text-2xl font-bold">
                    {templates.length}
                    {templates.some(isModified) && (
                      <span className="ml-1 text-xs font-normal text-amber-600">
                        ({templates.filter(isModified).length} edited)
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main tabs */}
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="drafts">
                <TabsList>
                  <TabsTrigger value="drafts">
                    <MailIcon className="mr-1 h-3.5 w-3.5" />
                    Email Drafts
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                    >
                      {drafts.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="templates">
                    <FileTextIcon className="mr-1 h-3.5 w-3.5" />
                    Templates
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                    >
                      {templates.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                {/* ==================== DRAFTS TAB ==================== */}
                <TabsContent value="drafts" className="mt-4 space-y-4">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search emails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Recipient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All recipients</SelectItem>
                        <SelectItem value="broker">Broker</SelectItem>
                        <SelectItem value="drayage">Drayage</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="carrier">Carrier</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="ml-auto">
                      <Button
                        size="sm"
                        onClick={sendAll}
                        disabled={readyDrafts.length === 0}
                      >
                        <SendIcon className="mr-1 h-4 w-4" />
                        Send All Ready ({readyDrafts.length})
                      </Button>
                    </div>
                  </div>

                  {/* Sub-tabs: Ready / Sent */}
                  <Tabs defaultValue="ready">
                    <TabsList>
                      <TabsTrigger value="ready">
                        Ready to Send
                        <Badge
                          variant="secondary"
                          className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                        >
                          {readyDrafts.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="sent">
                        Sent
                        <Badge
                          variant="secondary"
                          className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-muted-foreground/20 text-xs"
                        >
                          {sentDrafts.length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ready" className="mt-4">
                      <div className="flex flex-col gap-2">
                        {readyDrafts.map((draft) => (
                          <Card
                            key={draft.id}
                            className="cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => setSelectedDraft(draft)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <MailIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`${URGENCY_COLORS[draft.priority]} text-xs`}
                                    >
                                      {draft.priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {RECIPIENT_LABELS[draft.recipientType]}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      From: {draft.from}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-sm truncate">
                                    {draft.subject}
                                  </h4>
                                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    To: <span className="font-medium text-foreground/70">{draft.to}</span>
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  className="shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    sendEmail(draft.id)
                                  }}
                                >
                                  <SendIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {readyDrafts.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <CheckCircle2Icon className="h-12 w-12 mb-4 opacity-20" />
                            <p>All emails have been sent</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="sent" className="mt-4">
                      <div className="flex flex-col gap-2">
                        {sentDrafts.map((draft) => (
                          <Card
                            key={draft.id}
                            className="opacity-60 cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedDraft(draft)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <CheckCircle2Icon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">
                                    {draft.subject}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Sent to: {draft.to}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* ==================== TEMPLATES TAB ==================== */}
                <TabsContent value="templates" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Email Templates</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manage the templates used to generate action emails. Use{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">
                          {"{{variable}}"}
                        </code>{" "}
                        placeholders for dynamic data.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAll}
                      disabled={!templates.some(isModified)}
                    >
                      <RotateCcwIcon className="mr-1 h-3.5 w-3.5" />
                      Reset All
                    </Button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((tpl) => (
                      <Card
                        key={tpl.id}
                        className={`cursor-pointer hover:bg-muted/30 transition-colors ${
                          isModified(tpl) ? "ring-1 ring-amber-300" : ""
                        }`}
                        onClick={() => setEditingTemplate(structuredClone(tpl))}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-sm flex items-center gap-2">
                                {tpl.name}
                                {isModified(tpl) && (
                                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-200">
                                    edited
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {tpl.description}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0 h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingTemplate(structuredClone(tpl))
                              }}
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`${ROLE_BADGE_COLORS[tpl.recipientRole]} text-[10px]`}
                            >
                              {RECIPIENT_LABELS[tpl.recipientRole] ?? tpl.recipientRole}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              from {tpl.sender}
                            </span>
                          </div>
                          <div className="rounded-md bg-muted/50 p-2">
                            <p className="text-[11px] font-mono text-muted-foreground truncate">
                              Subject: {tpl.subjectTemplate}
                            </p>
                            <p className="text-[11px] font-mono text-muted-foreground mt-1 line-clamp-2">
                              {tpl.bodyTemplate.slice(0, 120)}...
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tpl.availableVariables.slice(0, 4).map((v) => (
                              <Badge
                                key={v.key}
                                variant="secondary"
                                className="text-[9px] font-mono"
                              >
                                {`{{${v.key}}}`}
                              </Badge>
                            ))}
                            {tpl.availableVariables.length > 4 && (
                              <Badge variant="secondary" className="text-[9px]">
                                +{tpl.availableVariables.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Email Preview Sheet */}
        <Sheet
          open={!!selectedDraft}
          onOpenChange={(open) => !open && setSelectedDraft(null)}
        >
          <SheetContent side="right" className="flex flex-col sm:max-w-lg">
            {selectedDraft && (
              <>
                <SheetHeader>
                  <SheetTitle>Email Preview</SheetTitle>
                  <SheetDescription>
                    Review and edit before sending
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={`${URGENCY_COLORS[selectedDraft.priority]} text-xs`}
                      >
                        {selectedDraft.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {RECIPIENT_LABELS[selectedDraft.recipientType]}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">From</Label>
                      <Input defaultValue={selectedDraft.from} className="h-8" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">To</Label>
                      <Input defaultValue={selectedDraft.to} className="h-8" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Subject</Label>
                      <Input defaultValue={selectedDraft.subject} className="h-8" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Body</Label>
                    <textarea
                      defaultValue={selectedDraft.body}
                      className="w-full min-h-[300px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                <SheetFooter className="flex gap-2 sm:flex-col sm:space-x-0">
                  {selectedDraft.status === "ready" ? (
                    <Button
                      className="w-full"
                      onClick={() => sendEmail(selectedDraft.id)}
                    >
                      <SendIcon className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      <CheckCircle2Icon className="mr-2 h-4 w-4" />
                      Already Sent
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDraft.body)
                      toast.success("Email body copied to clipboard")
                    }}
                  >
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Template Editor Sheet */}
        <Sheet
          open={!!editingTemplate}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
        >
          <SheetContent side="right" className="flex flex-col sm:max-w-2xl">
            {editingTemplate && (
              <TemplateEditor
                template={editingTemplate}
                isModified={isModified(editingTemplate)}
                onSave={saveTemplate}
                onReset={() => {
                  resetTemplate(editingTemplate.id)
                  setEditingTemplate(null)
                }}
                onCancel={() => setEditingTemplate(null)}
              />
            )}
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}

function TemplateEditor({
  template: initial,
  isModified: wasModified,
  onSave,
  onReset,
  onCancel,
}: {
  template: EmailTemplate
  isModified: boolean
  onSave: (t: EmailTemplate) => void
  onReset: () => void
  onCancel: () => void
}) {
  const [tpl, setTpl] = React.useState(initial)
  const [previewMode, setPreviewMode] = React.useState(false)

  const update = (patch: Partial<EmailTemplate>) =>
    setTpl((prev) => ({ ...prev, ...patch }))

  const previewVars = Object.fromEntries(
    tpl.availableVariables.map((v) => [v.key, v.example])
  )
  const previewSubject = tpl.subjectTemplate.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => previewVars[key] ?? `{{${key}}}`
  )
  const previewBody = tpl.bodyTemplate.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => previewVars[key] ?? `{{${key}}}`
  )

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          Edit Template: {tpl.name}
          {wasModified && (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-200">
              modified
            </Badge>
          )}
        </SheetTitle>
        <SheetDescription>{tpl.description}</SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4 space-y-5">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Input value={tpl.category} disabled className="h-8 font-mono text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Recipient Role</Label>
            <Input
              value={RECIPIENT_LABELS[tpl.recipientRole] ?? tpl.recipientRole}
              disabled
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Default Sender</Label>
          <Input
            value={tpl.sender}
            onChange={(e) => update({ sender: e.target.value })}
            className="h-8"
          />
        </div>

        <Separator />

        {/* Available variables */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <VariableIcon className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs font-medium">Available Variables</Label>
          </div>
          <div className="rounded-md border">
            <div className="grid grid-cols-3 gap-px bg-muted/50 text-[10px] font-medium text-muted-foreground p-2">
              <span>Variable</span>
              <span>Description</span>
              <span>Example</span>
            </div>
            {tpl.availableVariables.map((v) => (
              <div
                key={v.key}
                className="grid grid-cols-3 gap-px px-2 py-1.5 text-xs border-t hover:bg-muted/30 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(`{{${v.key}}}`)
                  toast.success(`Copied {{${v.key}}} to clipboard`)
                }}
              >
                <code className="font-mono text-[11px] text-blue-600">{`{{${v.key}}}`}</code>
                <span className="text-muted-foreground">{v.label}</span>
                <span className="text-muted-foreground italic">{v.example}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Click a variable to copy it to clipboard
          </p>
        </div>

        <Separator />

        {/* Toggle: Edit / Preview */}
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "outline" : "default"}
            size="sm"
            onClick={() => setPreviewMode(false)}
          >
            <PencilIcon className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(true)}
          >
            <FileTextIcon className="mr-1 h-3.5 w-3.5" />
            Preview
          </Button>
        </div>

        {!previewMode ? (
          <>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Subject Template</Label>
              <Input
                value={tpl.subjectTemplate}
                onChange={(e) => update({ subjectTemplate: e.target.value })}
                className="h-8 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Body Template</Label>
              <textarea
                value={tpl.bodyTemplate}
                onChange={(e) => update({ bodyTemplate: e.target.value })}
                className="w-full min-h-[300px] rounded-md border bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Subject Preview</Label>
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                {previewSubject}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Body Preview</Label>
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap min-h-[300px]">
                {previewBody}
              </div>
            </div>
          </>
        )}
      </div>

      <SheetFooter className="flex gap-2 sm:flex-col sm:space-x-0">
        <Button className="w-full" onClick={() => onSave(tpl)}>
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Template
        </Button>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onReset}
            disabled={!wasModified}
          >
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </SheetFooter>
    </>
  )
}
