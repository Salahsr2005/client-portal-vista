
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Info, Flag, ExternalLink } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PricingSection() {
  const { t } = useTranslation();
  const [activeCountry, setActiveCountry] = useState("");
  
  // Country data with pricing options and admission details
  const countries = [
    {
      id: "france",
      name: "France",
      flag: "🇫🇷",
      color: "from-blue-500 to-blue-600",
      options: [
        { name: "Campus France", price: "100€" },
        { name: "Parcoursup", price: "100€" },
        { name: "Université non connectée", price: "Varies" },
        { name: "Université privée", price: "Varies" },
      ],
      admissionInfo: {
        title: "Study in France",
        requirements: [
          "Completed secondary education",
          "B2 level proficiency in French (DELF/DALF certification)",
          "Campus France procedure for non-EU students",
          "Parcoursup registration for Bachelor's programs",
        ],
        documents: [
          "Birth certificate",
          "High school diploma/transcripts",
          "Motivation letter",
          "French language certification",
          "Proof of financial resources",
        ],
        timeline: "Applications open from November to January",
        additionalInfo: "Campus France procedure is mandatory for students from most non-EU countries. The process includes an interview and validation of academic documents."
      }
    },
    {
      id: "poland",
      name: "Poland",
      flag: "🇵🇱",
      color: "from-red-500 to-red-600",
      price: "400€",
      admissionInfo: {
        title: "Study in Poland",
        requirements: [
          "Completed secondary education",
          "English proficiency (B2 level) for English-taught programs",
          "Polish proficiency for Polish-taught programs",
          "Entrance exams for some programs"
        ],
        documents: [
          "Completed application form",
          "Secondary school certificate",
          "Transcript of records",
          "Language proficiency certificate",
          "Copy of passport",
          "Health insurance"
        ],
        timeline: "Applications typically open from May to July",
        additionalInfo: "Many Polish universities offer programs in English. The academic year starts in October and ends in June."
      }
    },
    {
      id: "belgium",
      name: "Belgium",
      flag: "🇧🇪",
      color: "from-yellow-500 to-yellow-600",
      price: "1000€",
      admissionInfo: {
        title: "Study in Belgium",
        requirements: [
          "Completed secondary education equivalent to Belgian standards",
          "Language proficiency in French, Dutch, or English depending on the program",
          "Specific entrance exams for some programs (e.g., medicine, engineering)"
        ],
        documents: [
          "Application form",
          "Secondary school certificate (legalized)",
          "Transcript of records",
          "Copy of passport/ID",
          "Language proficiency certificate",
          "Motivation letter"
        ],
        timeline: "Applications usually due by April 30 for most programs",
        additionalInfo: "Belgium has a high-quality education system with reasonable tuition fees compared to other Western European countries. The country has French, Dutch, and German-speaking institutions."
      }
    }
  ];

  // Card animation variants
  const cardVariants = {
    hover: {
      rotateY: 5,
      rotateX: 5,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

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
            {t("pricing.title", "International Education Options")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("pricing.subtitle", "Explore study opportunities across different countries with our assistance services.")}
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {countries.map((country) => (
            <motion.div 
              key={country.id}
              whileHover="hover"
              variants={cardVariants}
              style={{ perspective: 1000 }}
              className="flex flex-col h-full"
            >
              <Card className="h-full flex flex-col border-2 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className={`bg-gradient-to-r ${country.color} px-6 py-8 text-white`}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl" aria-label={`Flag of ${country.name}`}>
                      {country.flag}
                    </span>
                    <h3 className="text-2xl font-bold">{country.name}</h3>
                  </div>
                  
                  {country.options ? (
                    <ul className="space-y-3 mb-6">
                      {country.options.map((option, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                          <span>{option.name}</span>
                          <span className="font-medium">{option.price}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center mb-6">
                      <span className="text-2xl font-bold">{country.price}</span>
                      <p className="text-sm opacity-80">{t("pricing.applicationFee", "Application Fee")}</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 mt-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        <Info className="mr-2 h-4 w-4" />
                        {t("pricing.learnMore", "Learn More")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          {country.admissionInfo.title}
                        </DialogTitle>
                        <DialogDescription>
                          {t("pricing.admissionDetails", "Admission requirements and process details")}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">{t("pricing.requirements", "Requirements")}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {country.admissionInfo.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm">{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">{t("pricing.documents", "Required Documents")}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {country.admissionInfo.documents.map((doc, idx) => (
                              <li key={idx} className="text-sm">{doc}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">{t("pricing.timeline", "Application Timeline")}</h4>
                          <p className="text-sm">{country.admissionInfo.timeline}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">{t("pricing.additionalInfo", "Additional Information")}</h4>
                          <p className="text-sm">{country.admissionInfo.additionalInfo}</p>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <Button className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t("pricing.applyNow", "Apply Now")}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
            {t("pricing.customPlan", "Need assistance with a different country? ")}
            <Button variant="link" className="p-0 h-auto text-primary">
              {t("pricing.contactUs", "Contact our team")}
            </Button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
