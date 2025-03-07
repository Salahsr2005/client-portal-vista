
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  ArrowRight,
  Check,
  ArrowDown,
  Users,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  BarChart,
  Clock,
  Shield,
  Loader,
} from "lucide-react";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { PricingCard } from "@/components/landing/PricingCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Fetch features from Supabase or use static data
const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      // In a real app with a features table, you'd fetch from Supabase
      // Since we don't have a features table in your schema, we'll use static data
      return [
        {
          id: 1,
          title: "Intuitive Dashboard",
          description: "Get a bird's-eye view of all your projects with our customizable dashboard",
          icon: LayoutDashboard,
        },
        {
          id: 2,
          title: "Team Collaboration",
          description: "Work seamlessly with your team members in real-time",
          icon: Users,
        },
        {
          id: 3,
          title: "Advanced Scheduling",
          description: "Plan your projects with our powerful scheduling tools",
          icon: Calendar,
        },
        {
          id: 4,
          title: "Integrated Chat",
          description: "Communicate with your team without leaving the platform",
          icon: MessageSquare,
        },
        {
          id: 5,
          title: "Detailed Analytics",
          description: "Make data-driven decisions with comprehensive project analytics",
          icon: BarChart,
        },
        {
          id: 6,
          title: "Time Tracking",
          description: "Monitor time spent on tasks and improve productivity",
          icon: Clock,
        },
      ];
    },
  });
};

// Fetch pricing plans
const usePricingPlans = () => {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: async () => {
      // In a real app with a pricing_plans table, you'd fetch from Supabase
      // Since we don't have a pricing_plans table in your schema, we'll use static data
      return [
        {
          id: 1,
          name: "Starter",
          price: { monthly: 15, yearly: 144 },
          description: "Perfect for individuals and small teams getting started",
          features: [
            "Up to 5 projects",
            "Basic analytics",
            "24/7 support",
            "1 team member",
            "5GB storage",
          ],
          buttonText: "Get Started",
          popular: false,
        },
        {
          id: 2,
          name: "Professional",
          price: { monthly: 35, yearly: 336 },
          description: "Ideal for growing teams with more complex needs",
          features: [
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
            "Up to 10 team members",
            "50GB storage",
            "Custom reporting",
            "API access",
          ],
          buttonText: "Try Pro",
          popular: true,
        },
        {
          id: 3,
          name: "Enterprise",
          price: { monthly: 99, yearly: 948 },
          description: "Tailored solutions for large organizations",
          features: [
            "Unlimited everything",
            "Dedicated account manager",
            "Custom integrations",
            "Advanced security",
            "500GB storage",
            "24/7 phone support",
            "On-premise option",
          ],
          buttonText: "Contact Sales",
          popular: false,
        },
      ];
    },
  });
};

// Fetch testimonials
const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      // In a real app with a testimonials table, you'd fetch from Supabase
      // Since we don't have a testimonials table in your schema, we'll use static data
      return [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Product Manager at TechCorp",
          content: "TaskMaster Pro has transformed how our team collaborates. The intuitive interface and powerful features have increased our productivity by 40%.",
          avatar: "/placeholder.svg",
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "CTO at StartupX",
          content: "After trying numerous project management tools, TaskMaster Pro is the only one that met all our requirements. The analytics feature is a game-changer.",
          avatar: "/placeholder.svg",
        },
        {
          id: 3,
          name: "Elena Rodriguez",
          role: "Team Lead at DesignHub",
          content: "The customizable workflows in TaskMaster Pro have allowed us to adapt the tool to our unique design process. Our clients are impressed with the results.",
          avatar: "/placeholder.svg",
        },
      ];
    },
  });
};

export default function Index() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();

  const { data: features = [], isLoading: featuresLoading } = useFeatures();
  const { data: pricingPlans = [], isLoading: pricingLoading } = usePricingPlans();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useTestimonials();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slide-in-up");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                Streamline Your Projects with{" "}
                <span className="text-gradient">TaskMaster Pro</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in animate-delay-100">
                The all-in-one project management solution designed to boost productivity, enhance collaboration, and deliver results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-200">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg" className="rounded-full">
                    {user ? "Go to Dashboard" : "Start Free Trial"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => scrollToSection(featuresRef)}
                >
                  Learn More <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl"></div>
        </section>

        {/* Features */}
        <section ref={featuresRef} className="py-20 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-on-scroll opacity-0">
              Powerful <span className="text-gradient">Features</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 animate-on-scroll opacity-0">
              Everything you need to manage your projects efficiently in one platform
            </p>
            
            {featuresLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading features...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section ref={pricingRef} className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-on-scroll opacity-0">
              Flexible <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 animate-on-scroll opacity-0">
              Choose the perfect plan for your needs
            </p>
            
            <div className="flex justify-center mb-12 animate-on-scroll opacity-0">
              <div className="bg-muted rounded-full p-1 inline-flex items-center">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-2 rounded-full text-sm ${!isYearly ? 'bg-card shadow-sm' : ''}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-2 rounded-full text-sm flex items-center ${isYearly ? 'bg-card shadow-sm' : ''}`}
                >
                  Yearly <span className="ml-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
              </div>
            </div>
            
            {pricingLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading pricing plans...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    name={plan.name}
                    price={isYearly ? plan.price.yearly : plan.price.monthly}
                    description={plan.description}
                    features={plan.features}
                    buttonText={plan.buttonText}
                    popular={plan.popular}
                    isYearly={isYearly}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef} className="py-20 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-on-scroll opacity-0">
              Customer <span className="text-gradient">Testimonials</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 animate-on-scroll opacity-0">
              See what our customers have to say about TaskMaster Pro
            </p>
            
            {testimonialsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading testimonials...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial.id}
                    name={testimonial.name}
                    role={testimonial.role}
                    content={testimonial.content}
                    avatar={testimonial.avatar}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About */}
        <section ref={aboutRef} className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 animate-on-scroll opacity-0">
                <div className="relative">
                  <div className="w-full h-80 md:h-96 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass p-4 rounded-xl w-32 h-32 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 glass p-4 rounded-xl">
                    <div className="flex gap-2 items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">99.9% Uptime</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 animate-on-scroll opacity-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  About <span className="text-gradient">TaskMaster Pro</span>
                </h2>
                <p className="text-muted-foreground mb-4">
                  TaskMaster Pro was founded in 2020 with a simple mission: to create the most intuitive, powerful, and flexible project management tool on the market.
                </p>
                <p className="text-muted-foreground mb-6">
                  Our team of experienced developers and project management experts has worked tirelessly to build a solution that addresses the real-world challenges teams face every day.
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Built by a team with 50+ years of combined PM experience",
                    "Trusted by over 10,000 companies worldwide",
                    "Processing over 1 million tasks daily",
                    "99.9% uptime guarantee",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="glass-light dark:glass-dark rounded-2xl p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-on-scroll opacity-0">
                Stay <span className="text-gradient">Updated</span>
              </h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 animate-on-scroll opacity-0">
                Subscribe to our newsletter for the latest features, tips, and special offers
              </p>
              <div className="animate-on-scroll opacity-0">
                <NewsletterForm />
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary/5 -z-10"></div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="glass-light dark:glass-dark rounded-2xl p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll opacity-0">
                Ready to <span className="text-gradient">Transform</span> Your Project Management?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto animate-on-scroll opacity-0" style={{ animationDelay: "100ms" }}>
                Join thousands of teams who have already improved their productivity with TaskMaster Pro.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll opacity-0" style={{ animationDelay: "200ms" }}>
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg" className="rounded-full">
                    {user ? "Go to Dashboard" : "Start Free Trial"}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">TaskMaster Pro</h3>
                <p className="text-muted-foreground">Your complete solution for modern project management.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Partners</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">© 2023 TaskMaster Pro. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
