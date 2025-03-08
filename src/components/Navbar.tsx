
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 glass-light dark:glass-dark shadow-md"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2"
        >
          <motion.img 
            src="/logo.png" 
            alt="Euro Visa" 
            className="h-9"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.span 
            className="text-2xl font-semibold tracking-tight text-gradient"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Euro Visa
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant="ghost" className="rounded-full">
              {t('nav.home')}
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="rounded-full">
              {t('nav.about')}
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="ghost" className="rounded-full">
              {t('nav.services')}
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" className="rounded-full">
              {t('nav.contact')}
            </Button>
          </Link>
          <LanguageSelector />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center space-x-1">
              <Link to="/dashboard">
                <Button className="rounded-full">
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut} className="rounded-full">
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="ml-2 rounded-full">
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="ml-1"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 top-16 z-40 glass-light dark:glass-dark"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center justify-center h-full space-y-6 px-6">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="w-full text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="ghost"
                  className="w-full text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.about')}
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="ghost"
                  className="w-full text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.services')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="w-full text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="w-full">
                    <Button
                      className="w-full text-lg rounded-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full text-lg"
                  >
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <Link to="/login" className="w-full">
                  <Button
                    className="w-full text-lg rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
