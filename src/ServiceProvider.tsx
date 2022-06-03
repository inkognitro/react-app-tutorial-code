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
import { createI18n, DictionaryTranslator, I18n, I18nProvider, TranslatorProvider } from '@packages/core/i18n';
import enUS from '@components/translations/enUS.json';

export const ServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
    const [currentUserState, setCurrentUserState] = useState<AuthUser>(anonymousAuthUser);
    const [i18nState] = useState<I18n>(createI18n('en-US'));
    const translatorRef = useRef<DictionaryTranslator>(new DictionaryTranslator(enUS));
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
