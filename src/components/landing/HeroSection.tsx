
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

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
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
              <span className="text-gradient">Euro Visa</span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-xl"
            >
              {t("hero.subtitle", "Explore international education opportunities and immigration pathways with expert guidance and personalized support.")}
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/programs">
                <Button size="lg" className="gap-2 h-12 px-6 rounded-full">
                  {t("hero.primaryCta", "Explore Programs")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                onClick={scrollToFeatures} 
                variant="outline" 
                size="lg" 
                className="gap-2 h-12 px-6 rounded-full"
              >
                {t("hero.secondaryCta", "Learn More")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div variants={item} className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{t("hero.feature1", "Expert Guidance")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{t("hero.feature2", "Fast Processing")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
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
                    className="absolute top-[10%] left-[5%] w-44 md:w-56"
                    animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
                  >
                    <Card className="p-3 bg-background/80 backdrop-blur-sm border border-primary/10 shadow-lg">
                      <p className="font-medium text-sm line-clamp-1">
                        {programsData[0]?.name || "Study Abroad Programs"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {programsData[0]?.location || "Multiple Destinations"}
                      </p>
                    </Card>
                  </motion.div>
                  
                  {/* Card 2 - Bottom right */}
                  <motion.div 
                    variants={cardAnimation}
                    className="absolute bottom-[20%] right-[5%] w-44 md:w-56"
                    animate={{ y: [0, 10, 0], transition: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 } }}
                  >
                    <Card className="p-3 bg-background/80 backdrop-blur-sm border border-primary/10 shadow-lg">
                      <p className="font-medium text-sm line-clamp-1">
                        {programsData[1]?.name || "Visa Consultation"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {programsData[1]?.duration || "Expert Support"}
                      </p>
                    </Card>
                  </motion.div>
                  
                  {/* Card 3 - Middle right */}
                  <motion.div 
                    variants={cardAnimation}
                    className="absolute top-[40%] right-[10%] w-44 md:w-56"
                    animate={{ y: [0, -15, 0], transition: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 } }}
                  >
                    <Card className="p-3 bg-background/80 backdrop-blur-sm border border-primary/10 shadow-lg">
                      <p className="font-medium text-sm line-clamp-1">
                        {programsData[2]?.name || "Immigration Pathways"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {programsData[2]?.location || "Global Opportunities"}
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
