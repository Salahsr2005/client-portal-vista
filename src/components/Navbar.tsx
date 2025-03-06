
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const isAuthenticated = false; // This will be replaced with actual auth logic

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
          className="text-2xl font-semibold tracking-tight text-gradient"
        >
          Vista
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant="ghost" className="rounded-full">
              Home
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="rounded-full">
              About
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="ghost" className="rounded-full">
              Services
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" className="rounded-full">
              Contact
            </Button>
          </Link>
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button className="ml-2 rounded-full">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="ml-2 rounded-full">Login</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
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
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 glass-light dark:glass-dark animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-6 px-6">
            <Link to="/">
              <Button
                variant="ghost"
                className="w-full text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                className="w-full text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="ghost"
                className="w-full text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="ghost"
                className="w-full text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full">
                <Button
                  className="w-full text-lg rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="w-full">
                <Button
                  className="w-full text-lg rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
