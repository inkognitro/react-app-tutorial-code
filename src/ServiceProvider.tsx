import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import {
    anonymousAuthUser,
    AuthUser,
    BrowserCurrentUserRepository,
    CurrentUserProvider,
    CurrentUserRepositoryProvider,
} from '@packages/core/auth';
import { Config, ConfigProvider } from '@packages/core/config';
import { BrowserRouter } from 'react-router-dom';
import {
    createI18n,
    DictionaryTranslator,
    I18n,
    I18nProvider,
    LanguageCode,
    I18nManager,
    Translator,
    TranslatorProvider,
} from '@packages/core/i18n';
import enUS from '@components/translations/enUS.json';

function createLanguageSwitcher(
    translator: DictionaryTranslator,
    setI18nState: (i18nState: I18n) => void
): I18nManager {
    return {
        setLanguage: (languageCode: LanguageCode) => {
            setI18nState(createI18n(languageCode));
        },
    };
}

export const ServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
    // @ts-ignore
    const language = window.navigator.userLanguage || window.navigator.language;
    console.log(language);

    const [currentUserState, setCurrentUserState] = useState<AuthUser>(anonymousAuthUser);
    const [i18nState, setI18nState] = useState<I18n>(createI18n('en-US'));
    const translatorRef = useRef<Translator>(new DictionaryTranslator(enUS));
    const browserCurrentUserRepositoryRef = useRef(new BrowserCurrentUserRepository(setCurrentUserState));
    const configRef = useRef<Config>({
        companyName: 'ACME',
    });
    return (
        <BrowserRouter>
            <ConfigProvider value={configRef.current}>
                <I18nProvider value={i18nState}>
                    <TranslatorProvider value={translatorRef.current}>
                        <CurrentUserRepositoryProvider value={browserCurrentUserRepositoryRef.current}>
                            <CurrentUserProvider value={currentUserState}>{props.children}</CurrentUserProvider>
                        </CurrentUserRepositoryProvider>
                    </TranslatorProvider>
                </I18nProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
};
