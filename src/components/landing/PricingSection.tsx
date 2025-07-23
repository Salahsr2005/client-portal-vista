"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Info, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function PricingSection() {
  const { t } = useTranslation()
  const [activeCountry, setActiveCountry] = useState("")
  const [dialogOpen, setDialogOpen] = useState<string | null>(null)

  // Country data with pricing options and admission details
  const countries = [
    {
      id: "france",
      name: t("pricing.countries.france.name"),
      flag: "🇫🇷",
      color: "from-blue-500 to-blue-600",
      options: [
        { name: t("pricing.countries.france.options.campusFrance"), price: "100€" },
        { name: t("pricing.countries.france.options.parcoursup"), price: "100€" },
        { name: t("pricing.countries.france.options.nonConnected"), price: "Varies" },
        { name: t("pricing.countries.france.options.private"), price: "Varies" },
      ],
      admissionInfo: {
        title: t("pricing.countries.france.admissionInfo.title"),
        requirements: t("pricing.countries.france.admissionInfo.requirements", { returnObjects: true }) as string[],
        documents: t("pricing.countries.france.admissionInfo.documents", { returnObjects: true }) as string[],
        timeline: t("pricing.countries.france.admissionInfo.timeline"),
        additionalInfo: t("pricing.countries.france.admissionInfo.additionalInfo"),
      },
    },
    {
      id: "poland",
      name: t("pricing.countries.poland.name"),
      flag: "🇵🇱",
      color: "from-red-500 to-red-600",
      price: "400€",
      admissionInfo: {
        title: t("pricing.countries.poland.admissionInfo.title"),
        requirements: t("pricing.countries.poland.admissionInfo.requirements", { returnObjects: true }) as string[],
        documents: t("pricing.countries.poland.admissionInfo.documents", { returnObjects: true }) as string[],
        timeline: t("pricing.countries.poland.admissionInfo.timeline"),
        additionalInfo: t("pricing.countries.poland.admissionInfo.additionalInfo"),
      },
    },
    {
      id: "belgium",
      name: t("pricing.countries.belgium.name"),
      flag: "🇧🇪",
      color: "from-yellow-500 to-yellow-600",
      price: "1000€",
      admissionInfo: {
        title: t("pricing.countries.belgium.admissionInfo.title"),
        requirements: t("pricing.countries.belgium.admissionInfo.requirements", { returnObjects: true }) as string[],
        documents: t("pricing.countries.belgium.admissionInfo.documents", { returnObjects: true }) as string[],
        timeline: t("pricing.countries.belgium.admissionInfo.timeline"),
        additionalInfo: t("pricing.countries.belgium.admissionInfo.additionalInfo"),
      },
    },
  ]

  // Card animation variants
  const cardVariants = {
    hover: {
      rotateY: 5,
      rotateX: 5,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const openDialog = (countryId: string) => {
    setDialogOpen(countryId)
  }

  const closeDialog = () => {
    setDialogOpen(null)
  }

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("pricing.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{t("pricing.subtitle")}</p>
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
              },
            },
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
                      <p className="text-sm opacity-80">{t("pricing.applicationFee")}</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 mt-auto">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors bg-transparent"
                    onClick={() => openDialog(country.id)}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    {t("pricing.learnMore")}
                  </Button>
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
            {t("pricing.customPlan")}
            <Button variant="link" className="p-0 h-auto text-primary">
              {t("pricing.contactUs")}
            </Button>
          </p>
        </motion.div>
      </div>

      {/* Country Info Dialogs */}
      {countries.map((country) => (
        <Dialog key={country.id} open={dialogOpen === country.id} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                {country.admissionInfo.title}
              </DialogTitle>
              <DialogDescription>{t("pricing.admissionDetails")}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t("pricing.requirements")}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {country.admissionInfo.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t("pricing.documents")}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {country.admissionInfo.documents.map((doc, idx) => (
                    <li key={idx} className="text-sm">
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t("pricing.timeline")}</h4>
                <p className="text-sm">{country.admissionInfo.timeline}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t("pricing.additionalInfo")}</h4>
                <p className="text-sm">{country.admissionInfo.additionalInfo}</p>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("pricing.applyNow")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </section>
  )
}

