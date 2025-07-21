"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Menu, X, LogOut, User, Settings } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const handleSignOut = async () => {
    await signOut()
  }

  const getInitials = () => {
    if (!user || !user.email) return "U"
    const email = user.email
    return email.charAt(0).toUpperCase()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `${isMobile ? "py-2" : "py-3"} bg-slate-950/80 backdrop-blur-md border-b border-white/10`
          : `${isMobile ? "py-3" : "py-5"} bg-transparent`
      }`}
    >
      <div className={`container mx-auto ${isMobile ? "px-3" : "px-6"} flex items-center justify-between`}>
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EV</span>
            </div>
            <span className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-white`}>Euro Visa</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">
                {t("nav.home", "Accueil")}
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">
                {t("nav.services", "Services")}
              </Button>
            </Link>
            <Link to="/programs">
              <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">
                {t("nav.programs", "À Propos")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">
                {t("nav.contact", "Contact")}
              </Button>
            </Link>
            <LanguageSelector />
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-1" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t("nav.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <ShimmerButton className="ml-2">{t("nav.login", "S'inscrire")}</ShimmerButton>
              </Link>
            )}
          </nav>
        )}

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <div className="flex items-center space-x-1">
            <LanguageSelector />
            <ThemeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-1" aria-label="User menu">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t("nav.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="ml-1 text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-16 z-40 bg-slate-950/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center justify-center h-full space-y-4 px-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="w-full text-base text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.home", "Accueil")}
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="ghost"
                  className="w-full text-base text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.services", "Services")}
                </Button>
              </Link>
              <Link to="/programs">
                <Button
                  variant="ghost"
                  className="w-full text-base text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.programs", "À Propos")}
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="w-full text-base text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.contact", "Contact")}
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full text-base rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-base text-white hover:bg-white/10"
                  >
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Link to="/login" className="w-full">
                  <ShimmerButton className="w-full text-base" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.login", "S'inscrire")}
                  </ShimmerButton>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

