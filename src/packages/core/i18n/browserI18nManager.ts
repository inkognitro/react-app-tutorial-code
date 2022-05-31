import { createI18n, I18n, LanguageCode } from '@packages/core/i18n/i18n';
import { I18nManager } from '@packages/core/i18n/i18nManager';

type I18nStateSetter = (i18nState: I18n) => void;

export class BrowserI18nManager implements I18nManager {
    private readonly setI18nState: I18nStateSetter;

    constructor(setI18nState: I18nStateSetter) {
        this.setI18nState = setI18nState;
        this.init = this.init.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
    }

    setLanguage(languageCode: LanguageCode) {
        localStorage.setItem('currentLanguageCode', languageCode);
        this.setI18nState(createI18n(languageCode));
    }

    init() {
        const storedLanguageCode = localStorage.getItem('currentLanguageCode') as LanguageCode | null;
        if (storedLanguageCode) {
            this.setLanguage(storedLanguageCode);
            return;
        }
        // @ts-ignore
        const language = window.navigator.userLanguage || window.navigator.language;
        if (language === 'de-CH') {
            this.setLanguage(language);
            return;
        }
        this.setLanguage('en-US');
    }
}
