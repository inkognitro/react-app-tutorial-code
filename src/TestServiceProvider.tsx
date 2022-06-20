import {
    anonymousAuthUser,
    AuthUser,
    CurrentUserProvider,
    CurrentUserRepository,
    CurrentUserRepositoryProvider,
} from '@packages/core/auth';
import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import { Config, ConfigProvider } from '@packages/core/config';
import { MemoryRouter } from 'react-router-dom';
import {
    createI18n,
    I18n,
    I18nProvider,
    TranslationPlaceholders,
    Translator,
    TranslatorProvider,
} from '@packages/core/i18n';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider as ScThemeProvider } from 'styled-components';
import { theme } from '@components/theme';

class StubCurrentUserRepository implements CurrentUserRepository {
    setCurrentUser(currentUser: AuthUser) {}
    init() {}
}

class StubTranslator implements Translator {
    t(translationId: string, _?: TranslationPlaceholders): string {
        return translationId;
    }
}

export const TestServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
    const stubCurrentUserRepositoryRef = useRef(new StubCurrentUserRepository());
    const [i18nState] = useState<I18n>(createI18n('en-US'));
    const translatorRef = useRef<Translator>(new StubTranslator());
    const configRef = useRef<Config>({
        companyName: 'ACME',
    });
    return (
        <MuiThemeProvider theme={theme}>
            <ScThemeProvider theme={theme}>
                <MemoryRouter>
                    <ConfigProvider value={configRef.current}>
                        <I18nProvider value={i18nState}>
                            <TranslatorProvider value={translatorRef.current}>
                                <CurrentUserRepositoryProvider value={stubCurrentUserRepositoryRef.current}>
                                    <CurrentUserProvider value={anonymousAuthUser}>
                                        {props.children}
                                    </CurrentUserProvider>
                                </CurrentUserRepositoryProvider>
                            </TranslatorProvider>
                        </I18nProvider>
                    </ConfigProvider>
                </MemoryRouter>
            </ScThemeProvider>
        </MuiThemeProvider>
    );
};
