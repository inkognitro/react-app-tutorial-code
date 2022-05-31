import { createContext, useContext } from 'react';

export type LanguageCode = 'en-US' | 'en-GB' | 'de-CH';

function getLanguageId(languageCode: LanguageCode): string {
    const separator = '-';
    const languageCodeParts = languageCode.split(separator);
    languageCodeParts.pop();
    return languageCodeParts.join(separator);
}

export type I18n = {
    ampm: boolean;
    languageCode: LanguageCode;
};

export function createI18n(languageCode: LanguageCode = 'en-US'): I18n {
    return {
        ampm: getLanguageId(languageCode) === 'en',
        languageCode: languageCode,
    };
}

const context = createContext<null | I18n>(null);

export const I18nProvider = context.Provider;

export function useI18n(): I18n {
    const state = useContext(context);
    if (!state) {
        throw new Error('no i18n was provided');
    }
    return state;
}
