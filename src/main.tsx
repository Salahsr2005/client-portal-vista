import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { ThemeProvider } from "@/components/ThemeProvider"
import { GuestModeProvider } from "@/contexts/GuestModeContext"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import './i18n'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <GuestModeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </GuestModeProvider>
    </ThemeProvider>
  </StrictMode>
);
