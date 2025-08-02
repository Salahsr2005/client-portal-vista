import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/contexts/AuthContext"
import { GuestModeProvider } from "@/contexts/GuestModeContext"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"

// Pages
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Profile from "@/pages/Profile"
import EnhancedProfile from "@/pages/EnhancedProfile"
import Destinations from "@/pages/Destinations"
import ModernDestinations from "@/pages/ModernDestinations"
import DestinationDetails from "@/pages/DestinationDetails"
import Programs from "@/pages/Programs"
import ProgramView from "@/pages/ProgramView"
import Services from "@/pages/Services"
import Applications from "@/pages/Applications"
import ApplicationView from "@/pages/ApplicationView"
import NewApplication from "@/pages/NewApplication"
import Consultation from "@/pages/Consultation"
import Appointments from "@/pages/Appointments"
import AppointmentDetails from "@/pages/AppointmentDetails"
import Messages from "@/pages/Messages"
import ChatSupport from "@/pages/ChatSupport"
import Notifications from "@/pages/Notifications"
import Settings from "@/pages/Settings"
import Payments from "@/pages/Payments"
import PaymentCheckout from "@/pages/PaymentCheckout"
import About from "@/pages/About"
import Contact from "@/pages/Contact"
import NotFound from "@/pages/NotFound"
import Dawini from "@/pages/Dawini"

// Guest Pages
import Guest from "@/pages/Guest"
import GuestDestinations from "@/pages/GuestDestinations"
import GuestDestinationDetails from "@/pages/GuestDestinationDetails"
import GuestPrograms from "@/pages/GuestPrograms"
import GuestProgramView from "@/pages/GuestProgramView"
import GuestServices from "@/pages/GuestServices"
import GuestConsultation from "@/pages/GuestConsultation"
import GuestDawini from "@/pages/GuestDawini"

import "@/i18n"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <GuestModeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Guest Routes */}
                <Route
                  path="/guest"
                  element={
                    <GuestModeWrapper>
                      <Guest />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/destinations"
                  element={
                    <GuestModeWrapper>
                      <GuestDestinations />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/destinations/:id"
                  element={
                    <GuestModeWrapper>
                      <GuestDestinationDetails />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/programs"
                  element={
                    <GuestModeWrapper>
                      <GuestPrograms />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/programs/:id"
                  element={
                    <GuestModeWrapper>
                      <GuestProgramView />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/services"
                  element={
                    <GuestModeWrapper>
                      <GuestServices />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/consultation"
                  element={
                    <GuestModeWrapper>
                      <GuestConsultation />
                    </GuestModeWrapper>
                  }
                />
                <Route
                  path="/guest/dawini"
                  element={
                    <GuestModeWrapper>
                      <GuestDawini />
                    </GuestModeWrapper>
                  }
                />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/enhanced-profile" element={<EnhancedProfile />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/modern-destinations" element={<ModernDestinations />} />
                <Route path="/destinations/:id" element={<DestinationDetails />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/:id" element={<ProgramView />} />
                <Route path="/services" element={<Services />} />
                <Route path="/dawini" element={<Dawini />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/:id" element={<ApplicationView />} />
                <Route path="/applications/new" element={<NewApplication />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat-support" element={<ChatSupport />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/payments/checkout" element={<PaymentCheckout />} />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </GuestModeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
