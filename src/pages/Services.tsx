
import { Navbar } from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Plane, FileCheck, Home, Globe, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: t('services.academic.title'),
      description: t('services.academic.description'),
      features: [
        t('services.academic.features.f1'),
        t('services.academic.features.f2'),
        t('services.academic.features.f3')
      ]
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: t('services.career.title'),
      description: t('services.career.description'),
      features: [
        t('services.career.features.f1'),
        t('services.career.features.f2'),
        t('services.career.features.f3')
      ]
    },
    {
      icon: <Plane className="h-10 w-10 text-primary" />,
      title: t('services.travel.title'),
      description: t('services.travel.description'),
      features: [
        t('services.travel.features.f1'),
        t('services.travel.features.f2'),
        t('services.travel.features.f3')
      ]
    },
    {
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      title: t('services.visa.title'),
      description: t('services.visa.description'),
      features: [
        t('services.visa.features.f1'),
        t('services.visa.features.f2'),
        t('services.visa.features.f3')
      ]
    },
    {
      icon: <Home className="h-10 w-10 text-primary" />,
      title: t('services.accommodation.title'),
      description: t('services.accommodation.description'),
      features: [
        t('services.accommodation.features.f1'),
        t('services.accommodation.features.f2'),
        t('services.accommodation.features.f3')
      ]
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: t('services.language.title'),
      description: t('services.language.description'),
      features: [
        t('services.language.features.f1'),
        t('services.language.features.f2'),
        t('services.language.features.f3')
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("services.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-2 mt-1 text-primary">•</div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/contact">{t("services.learnMore")}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 glass-light dark:glass-dark rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("services.cta.title")}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("services.cta.description")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/contact">
                <Clock className="h-5 w-5" />
                {t("services.cta.button1")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/programs">
                <CreditCard className="h-5 w-5" />
                {t("services.cta.button2")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
