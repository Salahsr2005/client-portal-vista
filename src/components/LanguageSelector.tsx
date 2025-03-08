
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇦🇪" }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-1 px-2 hover:bg-primary/10">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block text-sm">{currentLanguage.flag} {currentLanguage.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" side="bottom" align="end">
        <AnimatePresence>
          <div className="flex flex-col space-y-1">
            {languages.map((lang) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  className="justify-start text-sm w-full"
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span className="mr-auto">{lang.name}</span>
                  {lang.code === i18n.language && <Check className="h-4 w-4" />}
                </Button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
