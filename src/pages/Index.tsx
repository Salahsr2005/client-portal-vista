
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  ArrowRight,
  Check,
  ArrowDown,
  Users,
  Calendar,
  Shield,
  Loader,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLandingPageData } from "@/hooks/useLandingPageData";
import { Globe3D } from "@/components/Globe3D";
import { ModernCarousel } from "@/components/ModernCarousel";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  const { t } = useTranslation();
  const { destinations, programs, services } = useLandingPageData();
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Prepare carousel items from destinations data
  const carouselItems = destinations.data.map(destination => ({
    id: destination.id,
    image: destination.image || "/images/destination-1.jpg", // Use provided images
    title: destination.name,
    description: destination.description
  }));

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section with 3D Globe */}
        <section className="relative min-h-screen pt-32 flex items-center overflow-hidden">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
            <motion.div 
              className="flex flex-col justify-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                variants={fadeInUp}
              >
                {t('hero.title', 'Your Global Education & Immigration Partner')}{" "}
                <span className="text-gradient">Euro Visa</span>
              </motion.h1>
              
              <motion.p 
                className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8"
                variants={fadeInUp}
              >
                {t('hero.subtitle', 'Explore international education opportunities and immigration pathways with expert guidance and personalized support.')}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <Link to="/programs">
                  <Button size="lg" className="rounded-full">
                    {t('hero.cta', 'Explore Programs')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => scrollToSection(featuresRef)}
                >
                  {t('hero.learnMore', 'Learn More')} <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="h-[400px] lg:h-[600px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Globe3D />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl"></div>
        </section>

        {/* Destinations Carousel */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                variants={fadeInUp}
              >
                {t('destinations.title', 'Popular Destinations')}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                {t('destinations.subtitle', 'Discover exciting study and immigration opportunities in these sought-after destinations.')}
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="h-[400px] md:h-[500px] mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {destinations.isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : carouselItems.length > 0 ? (
                <ModernCarousel items={carouselItems} />
              ) : (
                <div className="flex justify-center items-center h-full border rounded-xl">
                  <p className="text-muted-foreground">No destinations available</p>
                </div>
              )}
            </motion.div>
            
            <div className="text-center">
              <Link to="/destinations">
                <Button variant="outline" className="rounded-full">
                  {t('destinations.viewAll', 'View All Destinations')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section ref={programsRef} className="py-20 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                variants={fadeInUp}
              >
                {t('programs.title', 'Featured Programs')}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                {t('programs.subtitle', 'Explore our carefully selected educational programs to advance your career.')}
              </motion.p>
            </motion.div>
            
            {programs.isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {programs.data.map((program, index) => (
                  <motion.div 
                    key={program.id} 
                    variants={fadeInUp}
                    custom={index}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {program.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {program.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{program.fee}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/programs/${program.id}`} className="w-full">
                          <Button variant="outline" className="w-full">View Details</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            <div className="text-center mt-12">
              <Link to="/programs">
                <Button variant="outline" className="rounded-full">
                  {t('programs.viewAll', 'View All Programs')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section ref={featuresRef} className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                variants={fadeInUp}
              >
                {t('features.title', 'Why Choose Euro Visa')}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                {t('features.subtitle', 'We provide comprehensive support to ensure your success in global education and immigration.')}
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Feature 1 */}
              <motion.div 
                className="glass-light dark:glass-dark p-8 rounded-xl flex flex-col items-center text-center"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="bg-primary/10 p-3 rounded-full mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.expert.title', 'Expert Consultants')}</h3>
                <p className="text-muted-foreground">{t('features.expert.description', 'Our team of experienced consultants provides personalized guidance throughout your journey.')}</p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                className="glass-light dark:glass-dark p-8 rounded-xl flex flex-col items-center text-center"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="bg-primary/10 p-3 rounded-full mb-6">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.support.title', 'End-to-End Support')}</h3>
                <p className="text-muted-foreground">{t('features.support.description', 'From application to arrival, we support you at every step of your international journey.')}</p>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div 
                className="glass-light dark:glass-dark p-8 rounded-xl flex flex-col items-center text-center"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="bg-primary/10 p-3 rounded-full mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.success.title', 'High Success Rate')}</h3>
                <p className="text-muted-foreground">{t('features.success.description', 'Our proven track record demonstrates our commitment to helping clients achieve their goals.')}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                variants={fadeInUp}
              >
                {t('services.title', 'Our Services')}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                {t('services.subtitle', 'Comprehensive solutions to help you navigate your international education and immigration journey.')}
              </motion.p>
            </motion.div>
            
            {services.isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {services.data.map((service, index) => (
                  <motion.div 
                    key={service.id}
                    variants={fadeInUp}
                    custom={index}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {service.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{service.fee}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/services/${service.id}`} className="w-full">
                          <Button variant="outline" className="w-full">Learn More</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            <div className="text-center mt-12">
              <Link to="/services">
                <Button variant="outline" className="rounded-full">
                  {t('services.viewAll', 'View All Services')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="glass-light dark:glass-dark rounded-2xl p-10 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t('cta.title', 'Ready to Start Your Global Journey?')}
              </motion.h2>
              
              <motion.p 
                className="text-lg mb-8 max-w-2xl mx-auto relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {t('cta.subtitle', 'Contact our expert consultants today for a personalized consultation and take the first step towards your international future.')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/contact">
                  <Button size="lg" className="rounded-full">
                    {t('cta.button', 'Get Started Now')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Euro Visa</h3>
                <p className="text-muted-foreground">
                  Your trusted partner for visa and immigration services worldwide.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Services</h4>
                <ul className="space-y-2">
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Visa Consultation</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Immigration Services</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Document Preparation</Link></li>
                  <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">Application Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">Our Team</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link to="/programs" className="text-muted-foreground hover:text-foreground transition-colors">Programs</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-muted-foreground">123 Global Avenue</li>
                  <li className="text-muted-foreground">New York, NY 10001</li>
                  <li className="text-muted-foreground">info@eurovisa.com</li>
                  <li className="text-muted-foreground">+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
            
            <Separator className="mb-8" />
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2024 Euro Visa. {t('footer.rights', 'All rights reserved.')}
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacy', 'Privacy Policy')}
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms', 'Terms of Service')}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
