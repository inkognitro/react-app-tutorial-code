import React, { FC, MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react';
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
    BrowserI18nManager,
    createI18n,
    DictionaryTranslator,
    I18n,
    I18nProvider,
    TranslatorProvider,
    I18nManagerProvider,
} from '@packages/core/i18n';
import enUS from '@components/translations/enUS.json';
import deCH from '@components/translations/deCH.json';
import { ToasterProvider, SubscribableToaster, SubscribableToasterProvider } from '@packages/core/toaster';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider as ScThemeProvider } from 'styled-components';
import { theme } from '@components/theme';
import { AxiosRequestHandler } from '@packages/core/http';
import {
    HttpApiV1RequestHandler,
    ScopedApiV1RequestHandler,
    ScopedApiV1RequestHandlerProvider,
} from '@packages/core/api-v1/core';

function createScopedApiV1RequestHandler(currentUserStateRef: MutableRefObject<AuthUser>): ScopedApiV1RequestHandler {
    const httpRequestHandler = new AxiosRequestHandler();
    const apiV1BaseUrl = 'http://localhost:9000/api/v1';
    const httpApiV1RequestHandler = new HttpApiV1RequestHandler(
        httpRequestHandler,
        () => {
            return currentUserStateRef.current.type === 'authenticated' ? currentUserStateRef.current.apiKey : null;
        },
        apiV1BaseUrl
    );
    return new ScopedApiV1RequestHandler(httpApiV1RequestHandler);
}

export const ServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
    const [currentUserState, setCurrentUserState] = useState<AuthUser>(anonymousAuthUser);
    const currentUserStateRef = useRef<AuthUser>(currentUserState);
    useEffect(() => {
        currentUserStateRef.current = currentUserState;
    }, [currentUserState, currentUserStateRef]);
    const [i18nState, setI18nState] = useState<I18n>(createI18n('en-US'));
    const translatorRef = useRef<DictionaryTranslator>(new DictionaryTranslator(enUS));
    const i18nManagerRef = useRef<BrowserI18nManager>(
        new BrowserI18nManager((nextI18nState) => {
            switch (nextI18nState.languageCode) {
                case 'de-CH':
                    translatorRef.current.setDictionary(deCH);
                    break;
                default:
                    translatorRef.current.setDictionary(enUS);
            }
            setI18nState(nextI18nState);
        })
    );
    const browserCurrentUserRepositoryRef = useRef(new BrowserCurrentUserRepository(setCurrentUserState));
    const configRef = useRef<Config>({
        companyName: 'ACME',
    });
    const toasterRef = useRef(new SubscribableToaster());
    const apiV1RequestHandlerRef = useRef(createScopedApiV1RequestHandler(currentUserStateRef));
    return (
        <MuiThemeProvider theme={theme}>
            <ScThemeProvider theme={theme}>
                <BrowserRouter>
                    <ConfigProvider value={configRef.current}>
                        <I18nProvider value={i18nState}>
                            <ScopedApiV1RequestHandlerProvider value={apiV1RequestHandlerRef.current}>
                                <ToasterProvider value={toasterRef.current}>
                                    <SubscribableToasterProvider value={toasterRef.current}>
                                        <I18nManagerProvider value={i18nManagerRef.current}>
                                            <TranslatorProvider value={translatorRef.current}>
                                                <CurrentUserRepositoryProvider
                                                    value={browserCurrentUserRepositoryRef.current}>
                                                    <CurrentUserProvider value={currentUserState}>
                                                        {props.children}
                                                    </CurrentUserProvider>
                                                </CurrentUserRepositoryProvider>
                                            </TranslatorProvider>
                                        </I18nManagerProvider>
                                    </SubscribableToasterProvider>
                                </ToasterProvider>
                            </ScopedApiV1RequestHandlerProvider>
                        </I18nProvider>
                    </ConfigProvider>
                </BrowserRouter>
            </ScThemeProvider>
        </MuiThemeProvider>
    );
};
