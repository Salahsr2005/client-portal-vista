
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  featuresRef: React.RefObject<HTMLDivElement>;
  howItWorksRef: React.RefObject<HTMLDivElement>;
  pricingRef: React.RefObject<HTMLDivElement>;
  testimonialsRef: React.RefObject<HTMLDivElement>;
  faqRef: React.RefObject<HTMLDivElement>;
  onRefreshData?: () => void;
}

export function Navbar({
  featuresRef,
  howItWorksRef,
  pricingRef,
  testimonialsRef,
  faqRef,
  onRefreshData
}: NavbarProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Scroll-based navbar background
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(8px)"]);
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0, 0, 0, 0)", "0 4px 20px rgba(0, 0, 0, 0.05)"]
  );
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);
  
  // Scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setIsOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle refresh data
  const handleRefreshData = () => {
    if (onRefreshData) {
      setIsRefreshing(true);
      onRefreshData();
      
      toast({
        title: "Refreshing data",
        description: "Fetching the latest content from our database...",
      });
      
      // Reset refreshing state after a delay
      setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);
    }
  };
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        boxShadow: boxShadow,
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold text-foreground flex items-center">
            <span className="text-gradient">Euro Visa</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            <Button
              variant="ghost"
              onClick={() => scrollToSection(featuresRef)}
              className="font-medium"
            >
              {t("navbar.services", "Services")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(howItWorksRef)}
              className="font-medium"
            >
              {t("navbar.howItWorks", "How It Works")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(pricingRef)}
              className="font-medium"
            >
              {t("navbar.pricing", "Pricing")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(testimonialsRef)}
              className="font-medium"
            >
              {t("navbar.testimonials", "Testimonials")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(faqRef)}
              className="font-medium"
            >
              {t("navbar.faq", "FAQ")}
            </Button>
            
            {onRefreshData && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="ml-2"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            )}
            
            {user ? (
              <Link to="/dashboard">
                <Button className="ml-4">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="ml-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("navbar.login", "Login")}
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <motion.div
        className={cn("md:hidden overflow-hidden", isOpen ? "block" : "hidden")}
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container max-w-7xl mx-auto px-4 pb-4 bg-background/95 backdrop-blur-md">
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              onClick={() => scrollToSection(featuresRef)}
              className="justify-start"
            >
              {t("navbar.services", "Services")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(howItWorksRef)}
              className="justify-start"
            >
              {t("navbar.howItWorks", "How It Works")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(pricingRef)}
              className="justify-start"
            >
              {t("navbar.pricing", "Pricing")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(testimonialsRef)}
              className="justify-start"
            >
              {t("navbar.testimonials", "Testimonials")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(faqRef)}
              className="justify-start"
            >
              {t("navbar.faq", "FAQ")}
            </Button>
            
            <div className="flex items-center gap-2 pt-2">
              {onRefreshData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="flex-1"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                  Refresh Data
                </Button>
              )}
              
              {user ? (
                <Link to="/dashboard" className="flex-1">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login" className="flex-1">
                  <Button className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    {t("navbar.login", "Login")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
