
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
        {/* 3D Particles Background */}
        <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
          {mounted && <ParticleField />}
        </div>
        
        {/* Navbar */}
        <Navbar 
          featuresRef={featuresRef} 
          howItWorksRef={howItWorksRef} 
          pricingRef={pricingRef} 
          testimonialsRef={testimonialsRef} 
          faqRef={faqRef}
        />
        
        {/* Parallax background elements */}
        <motion.div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
          <motion.div 
            className="absolute -top-1/2 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
            style={{ 
              y: backgroundY,
              x: mousePosition.x,
              rotate: useTransform(scrollYProgress, [0, 1], [0, 10]),
            }}
          />
          <motion.div 
            className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-400/30 to-transparent blur-3xl"
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], ['0%', '-20%']),
              x: mousePosition.x * -1,
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/3 w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-purple-400/20 to-transparent blur-3xl"
            style={{ 
              y: useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '10%', '0%']),
              x: mousePosition.y,
            }}
          />
        </motion.div>
        
        {/* Main content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section with parallax effect */}
          <motion.div 
            style={{ 
              translateY: useTransform(scrollYProgress, [0, 0.2], [0, -50]) 
            }}
            data-aos="fade-up"
          >
            <HeroSection 
              featuresRef={featuresRef} 
              programsData={programs.data} 
              programsLoading={programs.isLoading}
            />
          </motion.div>
          
          {/* Features Section */}
          <motion.div 
            ref={featuresRef} 
            data-aos="fade-up" 
            data-aos-delay="100"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <FeaturesSection 
              featuresData={services.data} 
              isLoading={services.isLoading} 
            />
          </motion.div>
          
          {/* How It Works Section */}
          <motion.div 
            ref={howItWorksRef} 
            data-aos="fade-up" 
            data-aos-delay="200"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <HowItWorksSection />
          </motion.div>
          
          {/* Pricing Section */}
          <motion.div 
            ref={pricingRef} 
            data-aos="fade-up" 
            data-aos-delay="300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <PricingSection />
          </motion.div>
          
          {/* Testimonials Section */}
          <motion.div 
            ref={testimonialsRef} 
            data-aos="fade-up" 
            data-aos-delay="400"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TestimonialsSection 
              destinations={destinations.data}
              isLoading={destinations.isLoading}
            />
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div 
            ref={faqRef} 
            data-aos="fade-up" 
            data-aos-delay="500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaqSection />
          </motion.div>
          
          {/* CTA Section */}
          <motion.div 
            data-aos="fade-up" 
            data-aos-delay="600"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CtaSection />
          </motion.div>
        </motion.main>
        
        {/* Footer with animated reveal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Footer />
        </motion.div>
      </div>
    </ThemeProvider>
  );
}
