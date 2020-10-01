import NextI18Next from "next-i18next";
import path from "path";

export default new NextI18Next({
  otherLanguages: ["es", "fr", "en"],
  defaultLanguage: "fr",
  browserLanguageDetection: false,
  serverLanguageDetection: false,
  localePath: path.resolve("./public/static/locales"),
});
