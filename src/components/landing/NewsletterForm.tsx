
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

export function NewsletterForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t("newsletter.error", "Invalid email"),
        description: t("newsletter.errorMessage", "Please enter a valid email address."),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: t("newsletter.success", "Successfully subscribed!"),
        description: t("newsletter.successMessage", "Thank you for subscribing to our newsletter."),
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-grow">
        <Input
          type="email"
          placeholder={t("newsletter.placeholder", "Enter your email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12"
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-12">
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            {t("newsletter.subscribing", "Subscribing...")}
          </>
        ) : (
          t("newsletter.subscribe", "Subscribe")
        )}
      </Button>
    </form>
  );
}
