
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { GuestModeProvider } from "@/contexts/GuestModeContext";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Programs from "./pages/Programs";
import ProgramView from "./pages/ProgramView";
import Applications from "./pages/Applications";
import NewApplication from "./pages/NewApplication"; 
import ApplicationView from "./pages/ApplicationView";
import Appointments from "./pages/Appointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import Services from "./pages/Services";
import Notifications from "./pages/Notifications";
import Payments from "./pages/Payments";
import PaymentCheckout from "./pages/PaymentCheckout";
import Destinations from "./pages/Destinations";
import ModernDestinations from "./pages/ModernDestinations";
import DestinationDetails from "./pages/DestinationDetails";
import Consultation from "./pages/Consultation";
import ChatSupport from "./pages/ChatSupport";
import Settings from "./pages/Settings";
import Guest from "./pages/Guest";
import GuestPrograms from "./pages/GuestPrograms";
import GuestProgramView from "./pages/GuestProgramView";
import GuestDestinations from "./pages/GuestDestinations";
import GuestServices from "./pages/GuestServices";
import GuestDestinationDetails from "./pages/GuestDestinationDetails";
import GuestConsultation from "./pages/GuestConsultation";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Scroll to top on route change component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }
  
  if (!user) {
    // Save the location they were trying to access for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Create QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

// App Routes Component
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/guest" element={<Guest />} />
        
        {/* Guest Mode Routes - Public access to view content */}
        <Route path="/guest/programs" element={<GuestPrograms />} />
        <Route path="/guest/programs/:programId" element={<GuestProgramView />} />
        <Route path="/guest/destinations" element={<GuestDestinations />} />
        <Route path="/guest/destinations/:id" element={<GuestDestinationDetails />} />
        <Route path="/guest/consultation" element={<GuestConsultation />} />
        <Route path="/guest/services" element={<GuestServices />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<NewApplication />} />
          <Route path="/applications/:id" element={<ApplicationView />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:programId" element={<ProgramView />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payment-checkout/:paymentId" element={<PaymentCheckout />} />
          <Route path="/destinations" element={<ModernDestinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/chat" element={<ChatSupport />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Catch-all route for 404 - this must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// App with proper basename handling for deployment
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Removed basename to fix deployment routing issues */}
        <BrowserRouter>
          <GuestModeProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </GuestModeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
