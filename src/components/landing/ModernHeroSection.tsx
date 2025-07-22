
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Phone, Mail, MapPin, Clock, Instagram, Play } from "lucide-react";
import { WavyBackground } from "@/components/WavyBackground";
import { ModernButton } from "@/components/ui/modern-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import logoImage from "@/assets/logo.png";
import heroImage from "@/assets/hero-image.jpg";

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
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
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
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <img 
                src={logoImage} 
                alt="Euro Visa Logo" 
                className="h-16 w-auto object-contain"
              />
            </motion.div>

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
                  {t('hero.title')}
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground/90 leading-tight">
                {t('hero.subtitle')}
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              {t('hero.description')}
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
                  {t('hero.cta')}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </ModernButton>
              </Link>
              
              <Link to="/guest">
                <ShimmerButton className="px-8 py-4 text-lg">
                  {t('hero.guestMode')}
                </ShimmerButton>
              </Link>
            </motion.div>

            {/* Contact Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">{t('hero.credentials.phone')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">{t('hero.credentials.email')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">{t('hero.credentials.address')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm">{t('hero.credentials.hours')}</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { value: "10+", label: t('hero.stats.experience') },
                { value: "5000+", label: t('hero.stats.students') },
                { value: "50+", label: t('hero.stats.countries') },
                { value: "98%", label: t('hero.stats.success') }
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
          
          {/* Right content - Hero Image & Instagram Reel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={heroImage} 
                alt="Euro Visa Students" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Instagram Reel Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Instagram className="h-8 w-8 text-pink-400" />
                <div>
                  <h3 className="font-semibold text-foreground">Success Stories</h3>
                  <p className="text-sm text-muted-foreground">@eurovisa00</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {t('hero.instagramReel')}
              </p>
              
              <a 
                href="https://www.instagram.com/eurovisa00/reel/DMYiUZ2I6mu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
              >
                <Play className="h-4 w-4" />
                Watch Reel
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
