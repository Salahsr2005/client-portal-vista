
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import SidebarBackground from './SidebarBackground';
import NotificationBell from '../NotificationBell';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/ThemeProvider";
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
  Sparkles,
  GraduationCap,
  MapPin,
  HeadphonesIcon,
  Palette
} from "lucide-react";

const sidebarSections = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: Home, path: "/dashboard" }
    ]
  },
  {
    title: "ACADEMIC", 
    items: [
      { label: "Programs", icon: GraduationCap, path: "/programs" },
      { label: "Destinations", icon: MapPin, path: "/destinations", badge: "New", badgeColor: "bg-green-500" },
      { label: "Services", icon: HeadphonesIcon, path: "/services" }
    ]
  },
  {
    title: "MY APPLICATIONS",
    items: [
      { label: "Applications", icon: FileText, path: "/applications", badge: "3", badgeColor: "bg-blue-500" }
    ]
  },
  {
    title: "APPOINTMENTS & PAYMENTS",
    items: [
      { label: "Appointments", icon: Calendar, path: "/appointments" },
      { label: "Payments", icon: CreditCard, path: "/payments" }
    ]
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Messages", icon: MessageSquare, path: "/chat", badge: "2", badgeColor: "bg-pink-500" },
      { label: "Notifications", icon: Bell, path: "/notifications", badge: "5", badgeColor: "bg-yellow-500" }
    ]
  }
];

// Legacy items for backwards compatibility
const sidebarItems = sidebarSections.flatMap(section => section.items);

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarTheme, setSidebarTheme] = useState('violet');
  const isMobile = useIsMobile();
  const location = useLocation();
  const { signOut } = useAuth();
  const { theme } = useTheme();

  const themeColors = {
    violet: 'from-violet-600 via-purple-600 to-indigo-700',
    blue: 'from-blue-600 via-cyan-600 to-teal-700',
    emerald: 'from-emerald-600 via-green-600 to-teal-700',
    orange: 'from-orange-600 via-red-600 to-pink-700'
  };

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
        <div className={`absolute inset-0 bg-gradient-to-br ${themeColors[sidebarTheme]} transition-all duration-700 ease-in-out`}>
          <SidebarBackground />
        </div>
        
        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Logo and Theme Switcher */}
          <div className="flex items-center justify-between mb-6 mt-2">
            <div className="flex flex-col">
              <Link
                to="/dashboard"  
                className="text-xl font-bold tracking-tight text-white drop-shadow-lg hover:scale-105 transition-transform duration-200"
              >
                EuroVisa
              </Link>
              <span className="text-xs text-white/70 font-medium">Client Panel</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Color Switcher */}
              <div className="flex space-x-1 p-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                {Object.entries(themeColors).map(([colorName, _]) => (
                  <button
                    key={colorName}
                    onClick={() => setSidebarTheme(colorName)}
                    className={`w-6 h-6 rounded-full transition-all duration-300 ${
                      sidebarTheme === colorName 
                        ? 'ring-2 ring-white/60 scale-110 shadow-lg' 
                        : 'hover:scale-105 hover:ring-1 hover:ring-white/30'
                    } ${
                      colorName === 'violet' ? 'bg-violet-500' :
                      colorName === 'blue' ? 'bg-blue-500' :
                      colorName === 'emerald' ? 'bg-emerald-500' :
                      'bg-orange-500'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-white/20 hover:rotate-90 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
            {sidebarSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                        location.pathname === item.path
                          ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20 scale-[1.02]"
                          : "hover:bg-white/10 text-white/90 hover:text-white"
                      }`}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animation: 'slideInLeft 0.6s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center">
                        <item.icon className={`h-4 w-4 mr-3 shrink-0 transition-all duration-200 ${
                          location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                        }`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-xs font-medium text-white rounded-full ${item.badgeColor} animate-pulse`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
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
