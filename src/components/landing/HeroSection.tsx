
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronDown, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe3D } from "@/components/Globe3D";

interface HeroSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
  programsData: any[];
  programsLoading: boolean;
}

export function HeroSection({ 
  featuresRef, 
  programsData, 
  programsLoading 
}: HeroSectionProps) {
  const { t } = useTranslation();
  
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const floatingCards = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8,
      }
    }
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      } 
    }
  };
  
  // Filter and prepare the program data for display
  const displayPrograms = programsData && programsData.length > 0 
    ? programsData.slice(0, 3).map(program => ({
        id: program.id,
        name: program.name || "Study Program",
        location: program.location || program.country || "Global",
        duration: program.duration || "Flexible Duration",
        image: program.image || `/images/flags/${program.country?.toLowerCase() || 'generic'}.svg`
      }))
    : [
        { id: 1, name: "Study Abroad Programs", location: "Multiple Destinations" },
        { id: 2, name: "Visa Consultation", duration: "Expert Support" },
        { id: 3, name: "Immigration Pathways", location: "Global Opportunities" }
      ];

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background/20 pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            <motion.div variants={item}>
              <Badge variant="outline" className="mb-6 py-1.5 pl-1.5 pr-3 border-primary/20">
                <span className="bg-primary/10 text-primary rounded-sm px-2 py-0.5 mr-1.5">New</span>
                {t("hero.badgeText", "Simplified visa & educational services")}
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              {t("hero.title", "Your Global Education & Immigration Partner")}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Euro Visa</span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-xl"
            >
              {t("hero.subtitle", "Explore international education opportunities and immigration pathways with expert guidance and personalized support.")}
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/programs">
                <Button size="lg" className="gap-2 h-12 px-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none transition-all duration-300 transform hover:scale-105">
                  {t("hero.primaryCta", "Explore Programs")}
                  <ArrowRight className="h-4 w-4 animate-pulse" />
                </Button>
              </Link>
              <Button 
                onClick={scrollToFeatures} 
                variant="outline" 
                size="lg" 
                className="gap-2 h-12 px-6 rounded-full border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:scale-105"
              >
                {t("hero.secondaryCta", "Learn More")}
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </Button>
            </motion.div>
            
            <motion.div variants={item} className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
                <Check className="h-4 w-4 text-primary" />
                <span>{t("hero.feature1", "Expert Guidance")}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/5 px-3 py-1 rounded-full">
                <Check className="h-4 w-4 text-blue-500" />
                <span>{t("hero.feature2", "Fast Processing")}</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/5 px-3 py-1 rounded-full">
                <Check className="h-4 w-4 text-purple-500" />
                <span>{t("hero.feature3", "Global Support")}</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right content - Globe and floating cards */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
                  className="w-full h-full"
                >
                  <Globe3D />
                </motion.div>
              </div>
            </div>
            
            {/* Floating program cards */}
            <motion.div
              variants={floatingCards}
              initial="hidden"
              animate="show" 
              className="absolute inset-0 z-10 pointer-events-none"
            >
              {programsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Card 1 - Top left */}
                  <motion.div 
                    variants={cardAnimation}
                    className="absolute top-[15%] left-[5%] w-44 md:w-56"
                    animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
                  >
                    <Card className="p-3 bg-background/90 backdrop-blur-md border border-primary/10 shadow-lg hover:shadow-primary/10 transition-shadow duration-300 rounded-xl overflow-hidden transform hover:scale-105">
                      {displayPrograms[0]?.image && (
                        <div className="h-20 bg-cover bg-center mb-2 rounded-md" 
                             style={{backgroundImage: `url(${displayPrograms[0].image})`}} />
                      )}
                      <p className="font-medium text-sm line-clamp-1">
                        {displayPrograms[0]?.name || "Study Abroad Programs"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {displayPrograms[0]?.location || "Multiple Destinations"}
                      </p>
                    </Card>
                  </motion.div>
                  
                  {/* Card 2 - Bottom right */}
                  <motion.div 
                    variants={cardAnimation}
                    className="absolute bottom-[20%] right-[5%] w-44 md:w-56"
                    animate={{ y: [0, 10, 0], transition: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 } }}
                  >
                    <Card className="p-3 bg-background/90 backdrop-blur-md border border-blue-200/20 shadow-lg hover:shadow-blue-200/30 transition-shadow duration-300 rounded-xl overflow-hidden transform hover:scale-105">
                      {displayPrograms[1]?.image && (
                        <div className="h-20 bg-cover bg-center mb-2 rounded-md" 
                             style={{backgroundImage: `url(${displayPrograms[1].image})`}} />
                      )}
                      <p className="font-medium text-sm line-clamp-1">
                        {displayPrograms[1]?.name || "Visa Consultation"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {displayPrograms[1]?.duration || "Expert Support"}
                      </p>
                    </Card>
                  </motion.div>
                  
                  {/* Card 3 - Middle right */}
                  <motion.div 
                    variants={cardAnimation}
                    className="absolute top-[40%] right-[10%] w-44 md:w-56"
                    animate={{ y: [0, -15, 0], transition: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 } }}
                  >
                    <Card className="p-3 bg-background/90 backdrop-blur-md border border-purple-200/20 shadow-lg hover:shadow-purple-200/30 transition-shadow duration-300 rounded-xl overflow-hidden transform hover:scale-105">
                      {displayPrograms[2]?.image && (
                        <div className="h-20 bg-cover bg-center mb-2 rounded-md" 
                             style={{backgroundImage: `url(${displayPrograms[2].image})`}} />
                      )}
                      <p className="font-medium text-sm line-clamp-1">
                        {displayPrograms[2]?.name || "Immigration Pathways"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {displayPrograms[2]?.location || "Global Opportunities"}
                      </p>
                    </Card>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
