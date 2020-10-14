import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ComponentsEN from "./public/locales/en/components.json";
import ComponentsES from "./public/locales/es/components.json";
import ComponentsFR from "./public/locales/fr/components.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    preload: ["en", "fr", "es"],
    lng: "fr",
    fallbackLng: "fr",
    ns: ["common", "components"],
    defaultNS: "common",
    resources: {
      en: {
        components: ComponentsEN,
      },
      es: {
        components: ComponentsES,
      },
      fr: {
        components: ComponentsFR,
      },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
      wait: true,
    },
  });

export default i18n;
