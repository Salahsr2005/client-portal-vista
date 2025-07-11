import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, Home, Plane, Building, Languages, ArrowRight } from "lucide-react";

export function ModernServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      title: "Visa Application",
      description: "Expert guidance through the entire visa application process for your study abroad journey.",
      icon: <FileText className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/10 text-blue-600"
    },
    {
      id: 2,
      title: "University Admission",
      description: "Assistance with university selection and application to top European institutions.",
      icon: <GraduationCap className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/10 text-purple-600"
    },
    {
      id: 3,
      title: "Accommodation",
      description: "Help finding suitable and affordable student accommodation in your destination country.",
      icon: <Home className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-teal-500/10 via-teal-600/5 to-transparent",
      borderColor: "border-teal-500/30",
      iconBg: "bg-teal-500/10 text-teal-600"
    },
    {
      id: 4,
      title: "Travel Arrangements",
      description: "Support with travel planning, flight bookings, and pre-departure preparations.",
      icon: <Plane className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500/10 text-orange-600"
    },
    {
      id: 5,
      title: "Local Integration",
      description: "Resources and support for cultural integration and adapting to your new environment.",
      icon: <Building className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-red-500/10 via-red-600/5 to-transparent",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500/10 text-red-600"
    },
    {
      id: 6,
      title: "Language Courses",
      description: "Access to language preparation courses to help you succeed in your studies abroad.",
      icon: <Languages className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-indigo-500/10 via-indigo-600/5 to-transparent",
      borderColor: "border-indigo-500/30",
      iconBg: "bg-indigo-500/10 text-indigo-600"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            Premium Services
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Comprehensive Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Euro Visa provides end-to-end support for your international education journey, from application to arrival.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className={`p-6 h-full ${service.gradient} border ${service.borderColor} hover:scale-105 transition-all duration-300 group relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-current to-transparent"></div>
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center`}>
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Learn more link */}
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}