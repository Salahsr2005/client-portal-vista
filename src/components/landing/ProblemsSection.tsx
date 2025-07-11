import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";
import { Smartphone, RefreshCw, Users, Apple, Play, ArrowRight } from "lucide-react";

export function ProblemsSection() {
  const { t } = useTranslation();

  const problems = [
    {
      id: 1,
      title: "Struggling to manage your application on the go?",
      description: "Imagine accessing your complete file and receiving instant updates, wherever you are...",
      icon: <Smartphone className="h-8 w-8" />,
      gradient: "gradient-card-purple",
      status: "Coming soon on",
      badges: ["Download on the App Store", "GET IT ON Google Play"]
    },
    {
      id: 2,
      title: "High money transfer fees and frustrating delays?",
      description: "What if you could send money between Europe and Africa instantly, with minimal fees...",
      icon: <RefreshCw className="h-8 w-8" />,
      gradient: "gradient-card-teal",
      status: "SOLUTION COMING SOON"
    },
    {
      id: 3,
      title: "Lost in the complexity of admission procedures?",
      description: "Imagine having a personalized guide that accompanies you every step of the way, answering your questions 24/7...",
      icon: <Users className="h-8 w-8" />,
      gradient: "gradient-card-blue",
      status: "SOLUTION COMING SOON"
    }
  ];

  return (
    <SpotlightGrid className="py-24 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Problems Solved
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Euro Visa tackles the major challenges faced by international students. Discover our revolutionary solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className={`p-6 h-full ${problem.gradient} glass hover:scale-105 transition-all duration-300 relative overflow-hidden group border-white/10 dark:border-gray-800/50`}>
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <div className="text-6xl font-bold text-white/20">85%</div>
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-white/20 flex items-center justify-center text-white dark:text-gray-200">
                    {problem.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white dark:text-gray-100">
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 dark:text-gray-200/80 leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Status badge */}
                  <div className="pt-4">
                    <Badge variant="secondary" className="bg-white/10 dark:bg-white/20 text-white dark:text-gray-200 border-white/20 dark:border-gray-600/50">
                      {problem.status}
                    </Badge>
                  </div>

                  {/* App store badges for mobile app card */}
                  {problem.badges && (
                    <div className="flex flex-col gap-2 pt-2">
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Apple className="mr-2 h-4 w-4" />
                        Download on the App Store
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Play className="mr-2 h-4 w-4" />
                        GET IT ON Google Play
                      </Button>
                    </div>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <ShimmerButton 
            size="lg" 
            className="px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Discover Our Solutions
            <ArrowRight className="ml-2 h-5 w-5" />
          </ShimmerButton>
        </motion.div>
      </div>
    </SpotlightGrid>
  );
}