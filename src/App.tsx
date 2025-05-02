
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

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
import Appointments from "./pages/Appointments";
import Services from "./pages/Services";
import Notifications from "./pages/Notifications";
import Payments from "./pages/Payments";
import PaymentCheckout from "./pages/PaymentCheckout";
import Destinations from "./pages/Destinations";
import Consultation from "./pages/Consultation";
import ChatSupport from "./pages/ChatSupport";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Create QueryClient
const queryClient = new QueryClient();

// App Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:programId" element={<ProgramView />} />
        <Route path="/services" element={<Services />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payment-checkout" element={<PaymentCheckout />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/chat" element={<ChatSupport />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
