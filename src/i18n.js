import i18n from 'i18next';
import backend from 'i18next-xhr-backend';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { whitelist, fallbackLng } from './config/languages';

i18n
  .use(backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // string or array of namespaces to load
    ns: ['common', 'navLink', 'patientBoard', 'physicianView'],
    defaultNS: 'patientBoard',
    // array of allowed languages
    // @toDo add other languages
    whitelist,
    // language to use if translations in user language are not available.
    fallbackLng,
    // if debug: true logs info level to console output. Helps finding issues with loading not working.
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
