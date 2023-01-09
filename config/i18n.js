import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from "i18next-http-backend";
import moment from "moment";

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(HttpApi)
    .init({
        interpolation: {
          escapeValue: false,
          format: function (value, format, lng) {
            if (value instanceof Date) return moment(value).format(format);
            return value;
          }
        },
        supportedLngs: ["en", "ar"],
        fallbackLng: "ar",
        debug: process.env.NODE_ENV === "development"
    });

export default i18next;