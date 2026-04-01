import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"
import { lazy, Suspense } from "react"

const DashboardPage = lazy(() => import("./app/dashboard/page"))
const InboundPage = lazy(() => import("./app/inbound/page"))
const OutboundPage = lazy(() => import("./app/outbound/page"))
const ActionsPage = lazy(() => import("./app/actions/page"))
const EmailsPage = lazy(() => import("./app/emails/page"))
const ReportsPage = lazy(() => import("./app/reports/page"))
const ContactsPage = lazy(() => import("./app/contacts/page"))

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inbound" element={<InboundPage />} />
            <Route path="/outbound" element={<OutboundPage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="/emails" element={<EmailsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
