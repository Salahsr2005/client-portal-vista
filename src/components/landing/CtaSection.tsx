
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
          
          {/* Content */}
          <div className="relative z-10 py-16 px-6 md:py-20 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-2xl mx-auto">
              {t("cta.title", "Ready to Start Your Global Journey?")}
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t("cta.subtitle", "Contact our expert consultants today for a personalized consultation and take the first step towards your international future.")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="rounded-full px-8 py-6 h-auto gap-2">
                  {t("cta.primaryButton", "Get Started Today")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/programs">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 h-auto">
                  {t("cta.secondaryButton", "Explore Programs")}
                </Button>
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
