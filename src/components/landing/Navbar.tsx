
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  featuresRef: React.RefObject<HTMLDivElement>;
  howItWorksRef: React.RefObject<HTMLDivElement>;
  pricingRef: React.RefObject<HTMLDivElement>;
  testimonialsRef: React.RefObject<HTMLDivElement>;
  faqRef: React.RefObject<HTMLDivElement>;
}

export function Navbar({
  featuresRef,
  howItWorksRef,
  pricingRef,
  testimonialsRef,
  faqRef,
}: NavbarProps) {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "py-2 bg-background/80 backdrop-blur-lg shadow-sm" 
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gradient">
              Euro Visa
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.features", "Features")}
            </button>
            <button 
              onClick={() => scrollToSection(howItWorksRef)}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.howItWorks", "How It Works")}
            </button>
            <button 
              onClick={() => scrollToSection(pricingRef)}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.pricing", "Pricing")}
            </button>
            <button 
              onClick={() => scrollToSection(testimonialsRef)}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.testimonials", "Testimonials")}
            </button>
            <button 
              onClick={() => scrollToSection(faqRef)}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t("nav.faq", "FAQ")}
            </button>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t("nav.login", "Login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  {t("nav.getStarted", "Get Started")}
                </Button>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-background/95 backdrop-blur-lg z-40 shadow-lg border-b md:hidden"
          >
            <div className="container py-6 flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection(featuresRef)}
                className="px-4 py-2 text-left text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                {t("nav.features", "Features")}
              </button>
              <button 
                onClick={() => scrollToSection(howItWorksRef)}
                className="px-4 py-2 text-left text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                {t("nav.howItWorks", "How It Works")}
              </button>
              <button 
                onClick={() => scrollToSection(pricingRef)}
                className="px-4 py-2 text-left text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                {t("nav.pricing", "Pricing")}
              </button>
              <button 
                onClick={() => scrollToSection(testimonialsRef)}
                className="px-4 py-2 text-left text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                {t("nav.testimonials", "Testimonials")}
              </button>
              <button 
                onClick={() => scrollToSection(faqRef)}
                className="px-4 py-2 text-left text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                {t("nav.faq", "FAQ")}
              </button>
              
              <div className="border-t my-2 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm">
                      {t("nav.login", "Login")}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm">
                      {t("nav.getStarted", "Get Started")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
