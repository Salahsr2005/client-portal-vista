import i18n from "i18next"
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next"
import en from "./locales/en"
import ar from "./locales/ar"
import fr from "./locales/fr"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
    fr: {
      translation: fr,
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already escapes by default
  },
})

export function useTranslation() {
  return useTranslationOrg()
}

export default i18n


