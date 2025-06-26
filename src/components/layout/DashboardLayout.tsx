
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import SidebarBackground from './SidebarBackground';
import NotificationBell from '../NotificationBell';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronRight,
  Home,
  User,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  CreditCard,
  Globe,
  LogOut,
  Menu,
  X,
  Settings,
  Package,
  Search,
  Sparkles
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Applications", icon: FileText, path: "/applications" },
  { label: "Programs", icon: Package, path: "/programs" },
  { label: "Services", icon: Settings, path: "/services" },
  { label: "Appointments", icon: Calendar, path: "/appointments" },
  { label: "Messages", icon: MessageSquare, path: "/chat" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Payments", icon: CreditCard, path: "/payments" },
  { label: "Destinations", icon: Globe, path: "/destinations" },
  { label: "Consultation", icon: Sparkles, path: "/consultation" },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { signOut } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-hidden`}
      >
        {/* Background */}
        <SidebarBackground />
        
        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 mt-2">
            <Link
              to="/dashboard"
              className="text-2xl font-bold tracking-tight text-white drop-shadow-lg"
            >
              Euro Visa ✨
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                    : "hover:bg-white/10 text-white/90 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto space-y-2">
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 border-white/20">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-200 hover:bg-red-500/20 hover:text-red-100"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className={`sticky top-0 z-40 glass-light dark:glass-dark ${isMobile ? 'px-2 py-2' : 'px-4 py-3'} flex items-center justify-between shadow-sm border-b border-violet-100/50`}>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2 hover:bg-violet-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent`}>
                {sidebarItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h1>
              {!isMobile && (
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            {/* Search Button */}
            {!isMobile && (
              <Button variant="ghost" size="icon" className="hover:bg-violet-100">
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {/* Notification Bell */}
            <NotificationBell />
            
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-r from-violet-100 to-purple-100 hover:from-violet-200 hover:to-purple-200">
                <User className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-violet-600`} />
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className={`${isMobile ? 'p-2' : 'p-6'} h-[calc(100vh-4rem)] overflow-auto bg-gradient-to-br from-violet-50/30 to-purple-50/30`}>
          <Outlet />
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
