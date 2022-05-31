import { createContext, useContext } from 'react';
import { useI18n } from '@packages/core/i18n/i18n';

export type TranslationPlaceholders = {
    [key: string]: string;
};

export type Translation = {
    id: string;
    placeholders?: TranslationPlaceholders;
};

export type Translator = {
    t: (translationId: string, placeholders?: TranslationPlaceholders) => string;
};

const translatorContext = createContext<null | Translator>(null);

export const TranslatorProvider = translatorContext.Provider;

export function useTranslator(): Translator {
    useI18n(); // make sure translations are rendered whenever the i18n state does change
    const translator = useContext(translatorContext);
    if (!translator) {
        throw new Error('No Translator was provided');
    }
    return translator;
}
