import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "@/i18n/en/translation.json";
import translationES from "@/i18n/es/translation.json";
import translationFR from "@/i18n/fr/translation.json";

export const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    preload: ["en", "es", "fr"],
    lng: "fr",
    fallbackLng: "fr",
    resources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
