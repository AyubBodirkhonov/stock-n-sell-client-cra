import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
// utils
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { defaultLang } from './config-lang';
//
import enLocales from './langs/en';
import ruLocales from './langs/ru';
import frLocales from './langs/fr';
import viLocales from './langs/vi';
import cnLocales from './langs/cn';
import arLocales from './langs/ar';

// ----------------------------------------------------------------------

let lng = defaultLang.value;

const storageAvailable = localStorageAvailable();

if (storageAvailable) {
  lng = localStorage.getItem('i18nextLng') || defaultLang.value;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: enLocales },
      ru: { translations: ruLocales },
      fr: { translations: frLocales },
      vi: { translations: viLocales },
      cn: { translations: cnLocales },
      ar: { translations: arLocales },
    },
    lng,
    fallbackLng: defaultLang.value,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
