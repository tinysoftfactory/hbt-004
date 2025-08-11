import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sprintf from 'i18next-sprintf-postprocessor';
import en from '@/assets/localization/en.json';
import es from '@/assets/localization/es.json';
import ru from '@/assets/localization/ru.json';
import uk from '@/assets/localization/uk.json';

const DEFAULT_LANGUAGE_CODE = 'en';

const resources = {
    en: { translation: en },
    es: { translation: es },
    ru: { translation: ru },
    uk: { translation: uk },
};

i18n.use(sprintf)
    .use(initReactI18next)
    .init({
        resources,
        interpolation: {
            escapeValue: false,
        },
        returnNull: false,
        fallbackLng: DEFAULT_LANGUAGE_CODE,
    });

export const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
};

export const resetLanguage = () => {
    changeLanguage(DEFAULT_LANGUAGE_CODE);
};

export const _ = (key: string, ...params: (string | number)[]) => {
    const result = i18n.t(key, {
        interpolation: { escapeValue: false },
        postProcess: ['sprintf'],
        sprintf: params,
    });

    if (__DEV__ && ((result === key && i18n.language !== 'en') || result.trim() === '')) {
        console.warn(`[i18n] Missing translation for key: "${key}"`);
    }

    return result;
};

export default i18n;
