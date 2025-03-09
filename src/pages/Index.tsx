
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useLandingPageData } from "@/hooks/useLandingPageData";

// Components
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Index() {
  const { destinations, programs, services } = useLandingPageData();
  
  // References for scroll navigation
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
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
        
        {/* Parallax background elements - Updated to blue color */}
        <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
          <motion.div 
            className="absolute -top-1/2 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl"
            style={{ y: backgroundY }}
          />
          <motion.div 
            className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-400/30 to-transparent blur-3xl"
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-20%']) }}
          />
        </div>
        
        {/* Main content */}
        <main>
          {/* Hero Section */}
          <HeroSection 
            featuresRef={featuresRef} 
            programsData={programs.data.slice(0, 3)} 
            programsLoading={programs.isLoading}
          />
          
          {/* Features Section */}
          <div ref={featuresRef}>
            <FeaturesSection 
              featuresData={services.data.slice(0, 6)} 
              isLoading={services.isLoading} 
            />
          </div>
          
          {/* How It Works Section */}
          <div ref={howItWorksRef}>
            <HowItWorksSection />
          </div>
          
          {/* Pricing Section */}
          <div ref={pricingRef}>
            <PricingSection />
          </div>
          
          {/* Testimonials Section */}
          <div ref={testimonialsRef}>
            <TestimonialsSection 
              destinations={destinations.data.slice(0, 6)}
              isLoading={destinations.isLoading}
            />
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
