
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

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
  const navigate = useNavigate();
  const { user, userProfile, loading, signOut } = useAuth();

  console.log("Dashboard layout rendered with loading:", loading);
  console.log("User available:", !!user);

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

  // Redirect to login if not authenticated
  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, forcing navigation to login");
        navigate("/login");
      }
    }, 5000); // 5 seconds timeout

    if (!loading) {
      if (!user) {
        console.log("No user found after loading completed, redirecting to login");
        navigate("/login");
      } else {
        console.log("User authenticated, staying on dashboard");
      }
    }
    
    return () => clearTimeout(timeout);
  }, [user, loading, navigate]);

  // If still loading, show a loading state
  if (loading) {
    console.log("Showing loading skeleton");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto mb-2" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // Make sure user exists before rendering the dashboard
  if (!user) {
    console.log("No user found, redirecting to login");
    navigate("/login");
    return null;
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    } else if (userProfile?.firstName) {
      return userProfile.firstName.charAt(0);
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

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

          {/* User Profile Summary */}
          <div className="mb-6 px-2 py-3 bg-background/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/images/avatar-1.jpg" alt="User" />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-medium truncate">
                  {userProfile?.firstName && userProfile?.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : user?.email || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
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
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive"
              onClick={() => signOut()}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/avatar-1.jpg" alt="User" />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {userProfile?.firstName && userProfile?.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : user?.email || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
