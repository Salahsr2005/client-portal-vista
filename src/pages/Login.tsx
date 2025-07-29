"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Lock, Mail, LogIn, Clock, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Globe3D } from "@/components/Globe3D"

// Add floating elements component
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: Math.random() * 0.5 + 0.1,
            scale: Math.random() * 0.5 + 0.5,
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// Countdown component
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2025-09-01T00:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Sec", value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-primary">{item.value.toString().padStart(2, "0")}</div>
            <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const { signIn, signInWithGoogle, user } = useAuth()

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Disabled - show toast message
    toast({
      title: "Service Temporarily Unavailable",
      description: "Login will be available starting September 1st, 2025. Explore our services in guest mode!",
      variant: "destructive",
    })
  }

  const handleGoogleSignIn = async () => {
    toast({
      title: "Service Temporarily Unavailable",
      description: "Login will be available starting September 1st, 2025. Explore our services in guest mode!",
      variant: "destructive",
    })
  }

  // Animation variants
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
        {/* Background floating elements */}
        <FloatingElements />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 right-4 z-50"
        >
          <ThemeToggle />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/"
            className="fixed top-4 left-4 flex items-center text-muted-foreground hover:text-foreground transition-colors z-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Left side - 3D Globe and branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 bg-primary/5 p-8 flex flex-col justify-center items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{
                scale: [0.9, 1.1, 0.9],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Globe3D />
            </motion.div>
          </div>

          <motion.div
            className="z-10 text-center p-8 glass-light dark:glass-dark rounded-2xl max-w-md mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.img
              src="/assets/logo.png"
              alt="Euro Visa"
              className="h-16 mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.h2
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Euro Visa
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Your trusted partner for global education and immigration services. Start your international journey with
              us today.
            </motion.p>
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div className="text-center" whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <h3 className="text-2xl font-bold text-primary">10+</h3>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </motion.div>
              <motion.div className="text-center" whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <h3 className="text-2xl font-bold text-primary">50+</h3>
                <p className="text-sm text-muted-foreground">Destinations</p>
              </motion.div>
              <motion.div className="text-center" whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <h3 className="text-2xl font-bold text-primary">5000+</h3>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right side - Disabled Login form with countdown */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-light dark:glass-dark rounded-2xl p-8 shadow-lg backdrop-blur-xl"
            >
              {/* Service Unavailable Notice */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                  Coming Soon
                </h1>
                <p className="text-muted-foreground mb-4">Login will be available starting September 1st, 2025</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Calendar className="h-4 w-4" />
                  <span>Applications open September 1, 2025</span>
                </div>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-center mb-4">We're back in:</h3>
                <Countdown />
              </motion.div>

              {/* Disabled Form */}
              <div className="space-y-6 opacity-50 pointer-events-none">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input type="email" placeholder="mail@example.com" className="pl-10" disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none">Password</label>
                      <span className="text-sm font-medium text-muted-foreground">Forgot password?</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" className="pl-10" disabled />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox disabled />
                  <label className="text-sm font-medium leading-none">Remember me</label>
                </div>

                <Button className="w-full" disabled>
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in
                </Button>

                <div className="relative my-4">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-2 text-muted-foreground text-sm">Or continue with</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" disabled>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </Button>
              </div>

              {/* Guest Mode CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explore in Guest Mode</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Browse programs, destinations, and get consultations while we prepare for launch!
                </p>
                <Link to="/guest">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Continue as Guest
                  </Button>
                </Link>
              </motion.div>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-medium text-primary hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}

