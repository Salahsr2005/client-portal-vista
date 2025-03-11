
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  Package
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Applications", icon: FileText, path: "/applications" },
  { label: "Programs", icon: Package, path: "/programs" },
  { label: "Services", icon: Settings, path: "/services" },
  { label: "Appointments", icon: Calendar, path: "/appointments" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Payments", icon: CreditCard, path: "/payments" },
  { label: "Destinations", icon: Globe, path: "/destinations" },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 glass-light dark:glass-dark`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 mt-2">
            <Link
              to="/dashboard"
              className="text-2xl font-semibold tracking-tight text-gradient"
            >
              Euro Visa
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
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
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
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
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start text-destructive">
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-light dark:glass-dark px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {sidebarItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full bg-muted">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content - This is where the Outlet renders our page content */}
        <div className="p-6 h-[calc(100vh-4rem)] overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
