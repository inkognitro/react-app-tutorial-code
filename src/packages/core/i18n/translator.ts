import { createContext, useContext } from 'react';

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
    const translator = useContext(translatorContext);
    if (!translator) {
        throw new Error('No Translator was provided');
    }
    return translator;
}
