
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t("contact.subtitle")}</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("contact.address.title")}</h3>
                  <p className="text-muted-foreground">
                    {t("contact.address.line1")}
                    <br />
                    {t("contact.address.line2")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("contact.email.title")}</h3>
                  <p className="text-muted-foreground">{t("contact.email.address")}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("contact.phone.title")}</h3>
                  <p className="text-muted-foreground">{t("contact.phone.number")}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("contact.form.title")}</CardTitle>
              <CardDescription>{t("contact.form.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      {t("contact.form.firstName")}
                    </label>
                    <Input id="firstName" placeholder={t("contact.form.firstNamePlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      {t("contact.form.lastName")}
                    </label>
                    <Input id="lastName" placeholder={t("contact.form.lastNamePlaceholder")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t("contact.form.email")}
                  </label>
                  <Input id="email" type="email" placeholder={t("contact.form.emailPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {t("contact.form.subject")}
                  </label>
                  <Input id="subject" placeholder={t("contact.form.subjectPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t("contact.form.message")}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t("contact.form.messagePlaceholder")}
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("contact.form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
