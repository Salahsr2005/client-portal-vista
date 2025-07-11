
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ModernButton } from "@/components/ui/modern-button";
import { Menu, X, Sparkles } from "lucide-react";

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
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "py-2 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5" 
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Sparkles className="h-8 w-8 text-blue-500 group-hover:text-purple-500 transition-colors" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Euro Visa
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: t("nav.features", "Features"), ref: featuresRef },
              { label: t("nav.howItWorks", "How It Works"), ref: howItWorksRef },
              { label: t("nav.pricing", "Pricing"), ref: pricingRef },
              { label: t("nav.testimonials", "Testimonials"), ref: testimonialsRef },
              { label: t("nav.faq", "FAQ"), ref: faqRef },
            ].map((item, index) => (
              <motion.button
                key={index}
                onClick={() => scrollToSection(item.ref)}
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/5 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <Link to="/login">
                <ModernButton variant="ghost" size="sm">
                  {t("nav.login", "Login")}
                </ModernButton>
              </Link>
              <Link to="/register">
                <ModernButton size="sm">
                  {t("nav.getStarted", "Get Started")}
                </ModernButton>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 w-full bg-background/95 backdrop-blur-xl z-40 border-b border-white/10 md:hidden"
          >
            <div className="container py-6 space-y-4">
              {[
                { label: t("nav.features", "Features"), ref: featuresRef },
                { label: t("nav.howItWorks", "How It Works"), ref: howItWorksRef },
                { label: t("nav.pricing", "Pricing"), ref: pricingRef },
                { label: t("nav.testimonials", "Testimonials"), ref: testimonialsRef },
                { label: t("nav.faq", "FAQ"), ref: faqRef },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.ref)}
                  className="block w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
              
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <ModernButton variant="ghost" size="sm">
                      {t("nav.login", "Login")}
                    </ModernButton>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <ModernButton size="sm">
                      {t("nav.getStarted", "Get Started")}
                    </ModernButton>
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
