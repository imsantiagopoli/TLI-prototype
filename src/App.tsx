import Page from './app/dashboard/page'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Page />
      <Toaster />
    </ThemeProvider>
  )
}

export default App