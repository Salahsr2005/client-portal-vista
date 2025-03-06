
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ArrowRight, Check, Globe, Clock, Shield, Users } from "lucide-react";

export default function Index() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                Your Journey to Global{" "}
                <span className="text-gradient">Opportunities</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in animate-delay-100">
                Vista connects you to educational and career opportunities around the world with personalized guidance every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-200">
                <Link to="/register">
                  <Button size="lg" className="rounded-full">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Explore Services
                  </Button>
                </Link>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-on-scroll opacity-0">
              Why Choose <span className="text-gradient">Vista</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Global Network",
                  description: "Access opportunities from prestigious institutions and organizations worldwide"
                },
                {
                  icon: Users,
                  title: "Personalized Guidance",
                  description: "Receive customized support tailored to your unique goals and qualifications"
                },
                {
                  icon: Shield,
                  title: "Secure Process",
                  description: "Your information is protected with our state-of-the-art security protocols"
                },
                {
                  icon: Clock,
                  title: "Timely Updates",
                  description: "Stay informed with real-time updates on your applications and appointments"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-card shadow-sm rounded-xl p-6 animate-on-scroll opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section ref={servicesRef} className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-on-scroll opacity-0">
              Our <span className="text-gradient">Services</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Study Abroad Programs",
                  description: "Undergraduate, graduate, and specialized programs at top universities worldwide",
                  features: ["Application assistance", "Visa guidance", "Pre-departure orientation"]
                },
                {
                  title: "Career Placements",
                  description: "Connect with global employers looking for international talent",
                  features: ["Resume building", "Interview preparation", "Employment contract review"]
                },
                {
                  title: "Immigration Services",
                  description: "Navigate complex immigration processes with expert guidance",
                  features: ["Visa applications", "Permanent residency pathways", "Documentation assistance"]
                },
                {
                  title: "Language Programs",
                  description: "Enhance your language skills for academic and professional success",
                  features: ["Certified language courses", "Test preparation", "Cultural adaptation"]
                }
              ].map((service, index) => (
                <div 
                  key={index} 
                  className="glass rounded-xl p-8 animate-on-scroll opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12 animate-on-scroll opacity-0">
              <Link to="/services">
                <Button size="lg" variant="outline" className="rounded-full">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef} className="py-20 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-on-scroll opacity-0">
              Client <span className="text-gradient">Testimonials</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Vista made my dream of studying at Oxford a reality. Their guidance was invaluable through every step of the process.",
                  name: "Sarah L.",
                  location: "United Kingdom"
                },
                {
                  quote: "I secured a position at a leading tech company in Singapore with Vista's career placement services. Their network is truly global.",
                  name: "Michael T.",
                  location: "Singapore"
                },
                {
                  quote: "The immigration process seemed impossible until I found Vista. They simplified everything and made it stress-free.",
                  name: "Elena K.",
                  location: "Canada"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-card shadow-sm rounded-xl p-6 animate-on-scroll opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary">★</span>
                    ))}
                  </div>
                  <p className="italic mb-6">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="glass-light dark:glass-dark rounded-2xl p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll opacity-0">
                Ready to Begin Your <span className="text-gradient">Journey</span>?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto animate-on-scroll opacity-0" style={{ animationDelay: "100ms" }}>
                Join thousands of clients who have successfully achieved their international education and career goals with Vista.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll opacity-0" style={{ animationDelay: "200ms" }}>
                <Link to="/register">
                  <Button size="lg" className="rounded-full">
                    Create an Account
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Contact an Advisor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary/5 -z-10"></div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Vista</h3>
                <p className="text-muted-foreground">Your trusted partner for global opportunities and expert guidance.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Services</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Services</h4>
                <ul className="space-y-2">
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Study Abroad</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Career Placements</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Immigration</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Language Programs</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">support@vista.com</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">+1 (555) 123-4567</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">123 Global Ave, New York</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">© 2023 Vista. All rights reserved.</p>
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
