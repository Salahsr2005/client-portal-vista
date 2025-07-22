
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { WavyBackground } from "@/components/WavyBackground";
import { AdvancedLaptop } from "@/components/AdvancedLaptop";
import { ModernButton } from "@/components/ui/modern-button";

export function ModernHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Wavy animated background */}
      <WavyBackground />
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-background grid-pattern opacity-30" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/70" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Premium Services Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Premium Services
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Euro Visa
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground/90 leading-tight">
                Your Gateway to
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  International Education
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              With over a decade of experience, Euro Visa has helped thousands of students achieve their dreams of studying abroad. Our comprehensive services ensure a smooth transition from application to arrival.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register">
                <ModernButton size="lg" className="group">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </ModernButton>
              </Link>
              
              <Link to="/guest">
                <ModernButton variant="secondary" size="lg">
                  Browse as Guest
                </ModernButton>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 pt-8"
            >
              {[
                { value: "10+", label: "Years Experience" },
                { value: "5000+", label: "Students Helped" },
                { value: "50+", label: "Countries" },
                { value: "98%", label: "Success Rate" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right content - Advanced Laptop */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <AdvancedLaptop />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
