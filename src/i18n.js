import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
 
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
 
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/assets/i18n/{{ns}}/{{lng}}.json'
    },
    fallbackLng: 'mn',
    lng: 'mn',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    returnObjects: true,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  });
 
export default i18n;