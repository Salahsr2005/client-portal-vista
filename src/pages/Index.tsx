
import { useRef, useEffect } from "react";
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
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { destinations, programs, services, testimonials, refreshData } = useLandingPageData();
  const { toast } = useToast();
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: 'mobile'
    });
    
    // Force refresh data on page load
    refreshData();
    
  }, []);
  
  // Watch for data loading errors
  useEffect(() => {
    const errors = [
      destinations.error && "Error loading destinations data",
      programs.error && "Error loading programs data",
      services.error && "Error loading services data",
      testimonials.error && "Error loading testimonials data"
    ].filter(Boolean);
    
    if (errors.length > 0) {
      toast({
        title: "Data Loading Issues",
        description: "Some data could not be loaded. Please refresh or try again later.",
        variant: "destructive",
      });
    }
  }, [destinations.error, programs.error, services.error, testimonials.error]);
  
  // References for scroll navigation
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  // Check if all data is loading
  const isLoading = destinations.isLoading || programs.isLoading || services.isLoading || testimonials.isLoading;
  
  // Check if no data is available (and we're not loading)
  const noData = !isLoading && 
    destinations.data.length === 0 && 
    programs.data.length === 0 && 
    services.data.length === 0 && 
    testimonials.data.length === 0;
  
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
          onRefreshData={refreshData}
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
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-screen">
              <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
              <span className="text-xl mb-2">Loading content...</span>
              <p className="text-muted-foreground text-center max-w-md px-4">
                Fetching the latest information from our database. This should only take a moment.
              </p>
            </div>
          ) : noData ? (
            <div className="flex flex-col justify-center items-center h-screen px-4">
              <h2 className="text-2xl font-bold mb-4 text-center">No Data Available</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                There appears to be no active data in the database. Please make sure you have added destinations, programs, services, and client users with the is_active flag set to true.
              </p>
              <button 
                onClick={refreshData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
