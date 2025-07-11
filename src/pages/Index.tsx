
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useLandingPageData } from "@/hooks/useLandingPageData";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "next-themes";

// Components
import { Navbar } from "@/components/landing/Navbar";
import { ModernHeroSection } from "@/components/landing/ModernHeroSection";
import { ProblemsSection } from "@/components/landing/ProblemsSection";
import { PlatformPreviewSection } from "@/components/landing/PlatformPreviewSection";
import { ModernServicesSection } from "@/components/landing/ModernServicesSection";
import { ModernTestimonialsSection } from "@/components/landing/ModernTestimonialsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";

// 3D particle effect
import { ParticleField } from "@/components/ParticleField";

export default function Index() {
  const { destinations, programs, services } = useLandingPageData();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: 'mobile'
    });
    setMounted(true);
  }, []);
  
  // References for scroll navigation
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Mouse follow effect for hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Navbar */}
        <Navbar 
          featuresRef={featuresRef} 
          howItWorksRef={howItWorksRef} 
          pricingRef={pricingRef} 
          testimonialsRef={testimonialsRef} 
          faqRef={faqRef}
        />
        
        {/* Main content */}
        <main>
          {/* Hero Section */}
          <ModernHeroSection />
          
          {/* Problems Section */}
          <ProblemsSection />
          
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
  );
}
