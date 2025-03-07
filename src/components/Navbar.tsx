
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Check if we're on the index/landing page
  const isLandingPage = location.pathname === "/";
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">
              Education<span className="text-primary">Pro</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              {t('nav.home')}
            </Link>
            <Link to="/programs" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              {t('nav.programs')}
            </Link>
            <Link to="/services" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              {t('nav.services')}
            </Link>
            <Link to="/destinations" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              {t('nav.destinations')}
            </Link>
          </div>
          
          {/* Right buttons */}
          <div className="flex items-center space-x-1">
            <LanguageSelector />
            <ThemeToggle />
            
            {user ? (
              <Link to="/dashboard">
                <Button variant="default" size="sm">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-block">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-sm shadow-sm">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/programs"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            {t('nav.programs')}
          </Link>
          <Link
            to="/services"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            {t('nav.services')}
          </Link>
          <Link
            to="/destinations"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            {t('nav.destinations')}
          </Link>
          {!user && (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent sm:hidden"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
