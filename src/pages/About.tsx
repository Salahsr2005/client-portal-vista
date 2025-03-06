
import { Navbar } from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, GraduationCap, Globe } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const values = [
    { 
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />, 
      title: t("about.values.integrity.title"),
      description: t("about.values.integrity.description")
    },
    { 
      icon: <Users className="h-8 w-8 text-primary" />, 
      title: t("about.values.client.title"),
      description: t("about.values.client.description")
    },
    { 
      icon: <GraduationCap className="h-8 w-8 text-primary" />, 
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.description")
    },
    { 
      icon: <Globe className="h-8 w-8 text-primary" />, 
      title: t("about.values.global.title"),
      description: t("about.values.global.description")
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">{t("about.story.title")}</h2>
            <div className="space-y-4 text-lg">
              <p>{t("about.story.p1")}</p>
              <p>{t("about.story.p2")}</p>
              <p>{t("about.story.p3")}</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden glass-light dark:glass-dark">
              <img 
                src="https://images.unsplash.com/photo-1569982175971-d92b01cf8694?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Algiers skyline"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-lg z-[-1]"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-lg z-[-1]"></div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">{t("about.values.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card/50 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {value.icon}
                    <h3 className="text-xl font-semibold mt-4 mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{t("about.mission.title")}</h2>
          <p className="text-lg mb-8">{t("about.mission.statement")}</p>
          <h2 className="text-3xl font-bold mb-6">{t("about.vision.title")}</h2>
          <p className="text-lg">{t("about.vision.statement")}</p>
        </div>
      </div>
    </div>
  );
}
