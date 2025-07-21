"use client"

import { useRef, useEffect, useState } from "react"
import { useScroll, useTransform } from "framer-motion"
import { ThemeProvider } from "@/components/ThemeProvider"
import { useLandingPageData } from "@/hooks/useLandingPageData"
import AOS from "aos"
import "aos/dist/aos.css"

// Components
import { Navbar } from "@/components/Navbar"
import { ModernHeroSection } from "@/components/landing/ModernHeroSection"
import { PlatformPreviewSection } from "@/components/landing/PlatformPreviewSection"
import { ModernServicesSection } from "@/components/landing/ModernServicesSection"
import { ModernTestimonialsSection } from "@/components/landing/ModernTestimonialsSection"
import { FaqSection } from "@/components/landing/FaqSection"
import { CtaSection } from "@/components/landing/CtaSection"
import { Footer } from "@/components/landing/Footer"

export default function Index() {
  const { destinations, programs, services } = useLandingPageData()
  const [mounted, setMounted] = useState(false)

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      disable: "mobile",
    })
    setMounted(true)
  }, [])

  // References for scroll navigation
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  // Parallax scroll effect
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-950 overflow-x-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main>
          {/* Hero Section */}
          <ModernHeroSection />

          {/* Platform Preview Section */}
          <PlatformPreviewSection />

          {/* Services Section */}
          <div ref={featuresRef}>
            <ModernServicesSection />
          </div>

          {/* Testimonials Section */}
          <div ref={testimonialsRef}>
            <ModernTestimonialsSection />
          </div>

          {/* FAQ Section */}
          <div ref={faqRef}>
            <FaqSection />
          </div>

          {/* CTA Section */}
          <CtaSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
}
