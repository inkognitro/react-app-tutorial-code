import { createContext, useContext } from 'react';
import { I18n, LanguageCode } from './i18n';
import { Dictionary, DictionaryTranslator } from '@packages/core/i18n/dictionaryTranslator';

export type I18nManager = {
    setLanguage: (languageCode: LanguageCode) => void;
};

const i18nManagerContext = createContext<null | I18nManager>(null);

export const I18nManagerProvider = i18nManagerContext.Provider;

export function useI18nManager(): I18nManager {
    const repo = useContext(i18nManagerContext);
    if (!repo) {
        throw new Error('No I18nManager was provided');
    }
    return repo;
}

type i18nStateSetter = (i18nState: I18n) => void;

export class BrowserDictionaryI18nManager implements I18nManager {
    private readonly setI18nState: i18nStateSetter;
    private readonly translator: DictionaryTranslator;
    private dictionaryByLanguageCodeMapping: { [key: LanguageCode]: Dictionary };

    constructor(setI18nState: i18nStateSetter, translator: DictionaryTranslator) {
        this.setI18nState = setI18nState;
        this.translator = translator;
    }

    setLanguage(languageCode: LanguageCode) {}

    init() {}
}
