import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Destinations from "./pages/Destinations";
import Programs from "./pages/Programs";
import ProgramView from "./pages/ProgramView";
import Applications from "./pages/Applications";
import NewApplication from "./pages/NewApplication";
import Payments from "./pages/Payments";
import Appointments from "./pages/Appointments";
import Consultation from "./pages/Consultation";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import ChatSupport from "./pages/ChatSupport";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="services" element={<Services />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:programId" element={<ProgramView />} />
            <Route path="applications" element={<Applications />} />
            <Route path="applications/new" element={<NewApplication />} />
            <Route path="payments" element={<Payments />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="chat" element={<ChatSupport />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
