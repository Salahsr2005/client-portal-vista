
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useLandingPageData } from "@/hooks/useLandingPageData";
import AOS from "aos";
import "aos/dist/aos.css";

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
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: 'mobile'
    });
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
        
        {/* Parallax background elements - Blue color */}
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
          <div data-aos="fade-up">
            <HeroSection 
              featuresRef={featuresRef} 
              programsData={programs.data} 
              programsLoading={programs.isLoading}
            />
          </div>
          
          {/* Features Section */}
          <div ref={featuresRef} data-aos="fade-up" data-aos-delay="100">
            <FeaturesSection 
              featuresData={services.data} 
              isLoading={services.isLoading} 
            />
          </div>
          
          {/* How It Works Section */}
          <div ref={howItWorksRef} data-aos="fade-up" data-aos-delay="200">
            <HowItWorksSection />
          </div>
          
          {/* Pricing Section */}
          <div ref={pricingRef} data-aos="fade-up" data-aos-delay="300">
            <PricingSection />
          </div>
          
          {/* Testimonials Section */}
          <div ref={testimonialsRef} data-aos="fade-up" data-aos-delay="400">
            <TestimonialsSection 
              destinations={destinations.data}
              isLoading={destinations.isLoading}
            />
          </div>
          
          {/* FAQ Section */}
          <div ref={faqRef} data-aos="fade-up" data-aos-delay="500">
            <FaqSection />
          </div>
          
          {/* CTA Section */}
          <div data-aos="fade-up" data-aos-delay="600">
            <CtaSection />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
