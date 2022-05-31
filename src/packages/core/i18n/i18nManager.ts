import { createContext, useContext } from 'react';
import { LanguageCode } from './i18n';

export type I18nManager = {
    setLanguage: (languageCode: LanguageCode) => void;
    init: () => void;
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
