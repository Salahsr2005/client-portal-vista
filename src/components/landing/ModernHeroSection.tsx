import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Phone, Mail, MapPin, Clock, Instagram, Play } from "lucide-react";

// Mock components for demonstration
const ModernButton = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 gap-2";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    ghost: "border border-white/20 text-foreground hover:bg-white/10 backdrop-blur-sm"
  };
  const sizes = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const ShimmerButton = ({ children, className, ...props }) => {
  return (
    <button 
      className={`relative overflow-hidden rounded-2xl font-semibold transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse" />
      <div className="relative z-10 px-8 py-4">
        {children}
      </div>
    </button>
  );
};

// Motion components (simplified for demo)
const MotionDiv = ({ children, className, initial, animate, transition, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), transition?.delay * 1000 || 0);
    return () => clearTimeout(timer);
  }, [transition?.delay]);
  
  return (
    <div 
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0px) translateY(0px) scale(1)' : `translateX(${initial?.x || 0}px) translateY(${initial?.y || 0}px) scale(${initial?.scale || 1})`,
        transition: `all ${transition?.duration || 0.8}s ease-out`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

// WavyBackground component
const WavyBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <path
          d="M0,400 Q300,200 600,400 T1200,300 L1200,800 L0,800 Z"
          fill="url(#waveGradient1)"
          className="animate-pulse"
        />
        <path
          d="M0,500 Q400,300 800,500 T1200,400 L1200,800 L0,800 Z"
          fill="url(#waveGradient2)"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
};

export function ModernHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mock translation function
  const t = (key) => {
    const translations = {
      'hero.credentials.phone': '+213 123 456 789',
      'hero.credentials.email': 'contact@eurovisa.com',
      'hero.credentials.address': 'Algiers, Algeria',
      'hero.credentials.hours': '9h - 18h',
      'hero.stats.experience': 'Ans d\'expérience',
      'hero.stats.students': 'Étudiants aidés',
      'hero.stats.countries': 'Pays partenaires',
      'hero.stats.success': 'Taux de réussite',
      'hero.instagramReel': 'Découvrez les témoignages de nos étudiants qui ont réalisé leurs rêves grâce à Euro Visa.'
    };
    return translations[key] || key;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      {/* Dynamic background with mouse interaction */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />
      
      {/* Wavy animated background */}
      <WavyBackground />
      
      {/* Enhanced grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />
      
      {/* Multiple gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      
      {/* Enhanced floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
              i % 3 === 0 ? 'from-blue-400 to-cyan-400' :
              i % 3 === 1 ? 'from-purple-400 to-pink-400' :
              'from-green-400 to-emerald-400'
            } blur-sm`} />
          </div>
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-blue-200/30 rounded-full animate-spin-slow opacity-30" />
      <div className="absolute bottom-32 left-16 w-24 h-24 border border-purple-200/30 rounded-lg rotate-45 animate-pulse opacity-20" />
      <div className="absolute top-1/2 right-32 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full animate-bounce opacity-40" />
      
      <div className="relative z-10 container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left content */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 lg:space-y-10"
          >
            {/* Logo with enhanced styling */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative h-16 w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-2xl lg:text-3xl font-bold text-white">EV</span>
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Euro Visa
                </h2>
                <p className="text-sm text-muted-foreground">Study Abroad Experts</p>
              </div>
            </MotionDiv>

            {/* Premium Services Badge with enhanced design */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
              </div>
              <span className="text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Premium Services Available
              </span>
            </MotionDiv>

            {/* Main heading with enhanced typography */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-foreground block mb-2">Réalisez </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x mb-2">
                  vos rêves d'études
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                  à l'étranger !
                </span>
              </h1>
            </MotionDiv>

            {/* Enhanced description */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-2xl"
            >
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Euro Visa vous accompagne dans toutes les étapes de votre projet d'études en Europe. 
                <span className="font-semibold text-foreground"> De la sélection des universités à l'obtention du visa</span>, 
                nous sommes à vos côtés.
              </p>
            </MotionDiv>

            {/* Enhanced CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 lg:gap-6"
            >
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-30" />
                <ModernButton size="lg" className="relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  Découvrir nos services
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </ModernButton>
              </div>
              
              <ModernButton 
                variant="ghost" 
                size="lg" 
                className="border-2 border-white/30 text-foreground hover:bg-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Nous contacter
              </ModernButton>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300" />
                <ShimmerButton className="relative text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  Join Us
                </ShimmerButton>
              </div>
            </MotionDiv>

            {/* Enhanced Contact Credentials */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-4"
            >
              {[
                { icon: Phone, text: t('hero.credentials.phone'), color: 'text-blue-400' },
                { icon: Mail, text: t('hero.credentials.email'), color: 'text-purple-400' },
                { icon: MapPin, text: t('hero.credentials.address'), color: 'text-pink-400' },
                { icon: Clock, text: t('hero.credentials.hours'), color: 'text-green-400' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 group">
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`h-4 w-4 lg:h-5 lg:w-5 ${item.color}`} />
                  </div>
                  <span className="text-sm lg:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </MotionDiv>

            {/* Enhanced Stats */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6"
            >
              {[
                { value: "10+", label: t('hero.stats.experience'), color: 'from-blue-400 to-blue-600' },
                { value: "5000+", label: t('hero.stats.students'), color: 'from-purple-400 to-purple-600' },
                { value: "50+", label: t('hero.stats.countries'), color: 'from-pink-400 to-pink-600' },
                { value: "98%", label: t('hero.stats.success'), color: 'from-green-400 to-green-600' }
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border border-white/20 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-300 group">
                  <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </MotionDiv>
          </MotionDiv>
          
          {/* Right content - Enhanced Hero Image & Instagram Reel */}
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8 lg:gap-10"
          >
            {/* Enhanced Hero Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-500 opacity-60" />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-white/20 backdrop-blur-sm">
                <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <div className="text-6xl lg:text-8xl opacity-20">🎓</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating elements on image */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-3 animate-pulse">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                
                {/* Success badge */}
                <div className="absolute bottom-6 left-6 bg-green-500/90 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold text-sm">
                  ✓ Success Story
                </div>
              </div>
            </div>

            {/* Enhanced Instagram Reel Card */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              
              <div className="relative bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Instagram className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-pink-400 rounded-2xl animate-ping opacity-20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg lg:text-xl text-foreground">Success Stories</h3>
                    <p className="text-sm lg:text-base text-muted-foreground">@eurovisa00</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm lg:text-base">
                  {t('hero.instagramReel')}
                </p>
                
                <a 
                  href="https://www.instagram.com/eurovisa00/reel/DMYiUZ2I6mu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group transform hover:scale-105"
                >
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Reel
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
