"use client"

import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
// import { NewsletterForm } from "@/landing/NewsletterForm"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()

  // Footer links
  const companyLinks = [
    { label: t("footer.links.aboutus"), path: "/about" },
    { label: t("footer.links.contact"), path: "/contact" },
    { label: t("footer.links.careers"), path: "#" },
    { label: t("footer.links.blog"), path: "#" },
  ]

  const servicesLinks = [
    { label: t("footer.links.visaconsultation"), path: "/services" },
    { label: t("footer.links.educationprograms"), path: "/programs" },
    { label: t("footer.links.immigrationservices"), path: "/services" },
    { label: t("footer.links.documentpreparation"), path: "/services" },
    { label: t("footer.links.applicationsupport"), path: "/services" },
  ]

  const resourcesLinks = [
    { label: t("footer.links.faq"), path: "#" },
    { label: t("footer.links.testimonials"), path: "#" },
    { label: t("footer.links.destinations"), path: "/destinations" },
    { label: t("footer.links.universities"), path: "/programs" },
  ]

  const legalLinks = [
    { label: t("footer.links.privacypolicy"), path: "#" },
    { label: t("footer.links.termsofservice"), path: "#" },
    { label: t("footer.links.cookiepolicy"), path: "#" },
  ]

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, path: "#" },
    { icon: <Twitter className="h-5 w-5" />, path: "#" },
    { icon: <Instagram className="h-5 w-5" />, path: "#" },
    { icon: <Linkedin className="h-5 w-5" />, path: "#" },
  ]

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <footer className="bg-muted/50 pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12"
        >
          {/* Column 1 - Logo and description */}
          <motion.div variants={item} className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-gradient">Euro Visa</h2>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">{t("footer.description")}</p>

            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 transition-colors"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Company */}
          <motion.div variants={item}>
            <h3 className="font-medium text-lg mb-4">{t("footer.company")}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Services */}
          <motion.div variants={item}>
            <h3 className="font-medium text-lg mb-4">{t("footer.services")}</h3>
            <ul className="space-y-3">
              {servicesLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Resources */}
          <motion.div variants={item}>
            <h3 className="font-medium text-lg mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-medium text-lg mt-8 mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
{/*         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <div className="p-8 rounded-xl bg-gradient-to-br from-background to-muted border border-primary/10">
            <h3 className="text-xl font-semibold mb-2">{t("footer.newsletter.title")}</h3>
            <p className="text-muted-foreground mb-6">{t("footer.newsletter.description")}</p>
            <NewsletterForm />
          </div>
        </motion.div> */}

        <Separator className="mb-8" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Euro Visa. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.termsOfService")}
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.cookiePolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

