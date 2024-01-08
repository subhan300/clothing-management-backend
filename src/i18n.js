// i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import germanJson from "./utils/german";
import englishJson from "./utils/english";
const resources = {
  en: {
    ...englishJson
  },
  de: {
    ...germanJson
  },
};

i18n
  //   .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "de",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
