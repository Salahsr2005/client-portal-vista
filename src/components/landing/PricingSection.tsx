
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function PricingSection() {
  const { t } = useTranslation();
  const [billingAnnually, setBillingAnnually] = useState(false);

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
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  // Pricing plans
  const plans = [
    {
      name: "Basic",
      description: "Essential visa consultation services for individuals",
      monthly: 99,
      annually: 990,
      features: [
        { name: "Initial consultation", included: true },
        { name: "Document checklist", included: true },
        { name: "Basic application guidance", included: true },
        { name: "Email support", included: true },
        { name: "Document review", included: false },
        { name: "Priority processing", included: false },
        { name: "Dedicated consultant", included: false },
        { name: "Post-approval support", included: false },
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Professional",
      description: "Comprehensive visa and education support",
      monthly: 199,
      annually: 1990,
      features: [
        { name: "Initial consultation", included: true },
        { name: "Document checklist", included: true },
        { name: "Comprehensive application assistance", included: true },
        { name: "Email & phone support", included: true },
        { name: "Document review & preparation", included: true },
        { name: "Priority processing", included: true },
        { name: "Dedicated consultant", included: false },
        { name: "Post-approval support", included: false },
      ],
      cta: "Most Popular",
      highlighted: true
    },
    {
      name: "Enterprise",
      description: "Full-service immigration and education support",
      monthly: 349,
      annually: 3490,
      features: [
        { name: "Initial consultation", included: true },
        { name: "Document checklist", included: true },
        { name: "Complete application management", included: true },
        { name: "24/7 priority support", included: true },
        { name: "Document review & preparation", included: true },
        { name: "Expedited processing", included: true },
        { name: "Dedicated senior consultant", included: true },
        { name: "Comprehensive post-approval support", included: true },
      ],
      cta: "Contact Us",
      highlighted: false
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("pricing.title", "Transparent Pricing Plans")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("pricing.subtitle", "Choose the perfect plan that fits your needs with our straightforward pricing options.")}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className={`text-sm ${!billingAnnually ? "font-medium" : "text-muted-foreground"}`}>
              {t("pricing.monthly", "Monthly")}
            </span>
            <Switch 
              checked={billingAnnually}
              onCheckedChange={setBillingAnnually}
              aria-label="Toggle annual billing"
            />
            <span className={`text-sm ${billingAnnually ? "font-medium" : "text-muted-foreground"}`}>
              {t("pricing.annually", "Annually")}
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Save 15%
              </Badge>
            </span>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className={`flex flex-col ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              <Card 
                className={`h-full border ${
                  plan.highlighted 
                    ? "border-primary shadow-lg dark:border-primary" 
                    : "border-border"
                } overflow-hidden flex flex-col`}
              >
                {plan.highlighted && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    {t("pricing.recommended", "Recommended")}
                  </div>
                )}
                <CardHeader className={plan.highlighted ? "pt-5" : ""}>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${billingAnnually ? plan.annually : plan.monthly}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {billingAnnually ? "/year" : "/month"}
                    </span>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/contact" className="w-full">
                    <Button 
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            {t("pricing.customPlan", "Need a custom plan? ")}
            <Link to="/contact" className="text-primary hover:underline">
              {t("pricing.contactUs", "Contact our team")}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
