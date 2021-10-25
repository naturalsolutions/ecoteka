import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import CommonEN from "./public/locales/en/common.json";
import CommonES from "./public/locales/es/common.json";
import CommonFR from "./public/locales/fr/common.json";
import ComponentsEN from "./public/locales/en/components.json";
import ComponentsES from "./public/locales/es/components.json";
import ComponentsFR from "./public/locales/fr/components.json";
import PagesEN from "./public/locales/en/pages.json";
import PagesES from "./public/locales/es/pages.json";
import PagesFR from "./public/locales/fr/pages.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    preload: ["en", "fr", "es"],
    lng: "fr",
    fallbackLng: "fr",
    ns: ["common", "components", "pages"],
    nsSeparator: ".",
    defaultNS: "common",
    resources: {
      en: {
        common: CommonEN,
        components: ComponentsEN,
        pages: PagesEN,
      },
      es: {
        common: CommonES,
        components: ComponentsES,
        pages: PagesES,
      },
      fr: {
        common: CommonFR,
        components: ComponentsFR,
        pages: PagesFR,
      },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
