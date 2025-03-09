
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Calendar, CheckCircle, ClipboardCheck, FileSearch, MessageSquare, Sparkles } from "lucide-react";

export function HowItWorksSection() {
  const { t } = useTranslation();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  // Steps data
  const steps = [
    {
      number: 1,
      title: "Initial Consultation",
      description: "Schedule a free consultation with our experts to discuss your goals and requirements.",
      icon: <MessageSquare className="h-6 w-6 text-primary" />
    },
    {
      number: 2,
      title: "Personalized Plan",
      description: "Receive a customized plan tailored to your specific educational and immigration needs.",
      icon: <ClipboardCheck className="h-6 w-6 text-primary" />
    },
    {
      number: 3,
      title: "Document Preparation",
      description: "We'll help you gather and prepare all necessary documents for your application.",
      icon: <FileSearch className="h-6 w-6 text-primary" />
    },
    {
      number: 4,
      title: "Application Submission",
      description: "Our team ensures accurate and timely submission of your application.",
      icon: <Calendar className="h-6 w-6 text-primary" />
    },
    {
      number: 5,
      title: "Tracking & Updates",
      description: "Stay informed with regular updates on your application status.",
      icon: <Sparkles className="h-6 w-6 text-primary" />
    },
    {
      number: 6,
      title: "Successful Outcome",
      description: "Celebrate your successful visa approval or university admission with our continued support.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section className="py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("howItWorks.title", "How It Works")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorks.subtitle", "Our simple step-by-step process to help you achieve your international education and immigration goals.")}
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line for desktop */}
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-primary/20 hidden lg:block" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="relative"
            >
              <div className={`
                flex flex-col items-center text-center p-6 rounded-lg
                ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-16'}
              `}>
                <div className="relative mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                    {step.icon}
                  </div>
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full bg-primary/5 -z-10 animate-pulse" />
                  <div className="absolute top-6 left-6 h-10 w-10 text-xl font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
