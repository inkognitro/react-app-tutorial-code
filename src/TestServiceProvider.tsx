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
    I18nManager,
    I18nProvider,
    LanguageCode,
    TranslationPlaceholders,
    Translator,
    TranslatorProvider,
    I18nManagerProvider,
} from '@packages/core/i18n';
import { ToasterProvider, SubscribableToaster, SubscribableToasterProvider } from '@packages/core/toaster';

class StubCurrentUserRepository implements CurrentUserRepository {
    setCurrentUser(currentUser: AuthUser) {}
    init() {}
}

class StubTranslator implements Translator {
    t(translationId: string, _?: TranslationPlaceholders): string {
        return translationId;
    }
}

class StubI18nManager implements I18nManager {
    setLanguage(_: LanguageCode) {}
    init() {}
}

export const TestServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
    const stubCurrentUserRepositoryRef = useRef(new StubCurrentUserRepository());
    const [i18nState] = useState<I18n>(createI18n('en-US'));
    const translatorRef = useRef<Translator>(new StubTranslator());
    const i18nManagerRef = useRef<I18nManager>(new StubI18nManager());
    const configRef = useRef<Config>({
        companyName: 'ACME',
    });
    const toasterRef = useRef(new SubscribableToaster());
    return (
        <MemoryRouter>
            <ConfigProvider value={configRef.current}>
                <I18nProvider value={i18nState}>
                    <ToasterProvider value={toasterRef.current}>
                        <SubscribableToasterProvider value={toasterRef.current}>
                            <I18nManagerProvider value={i18nManagerRef.current}>
                                <TranslatorProvider value={translatorRef.current}>
                                    <CurrentUserRepositoryProvider value={stubCurrentUserRepositoryRef.current}>
                                        <CurrentUserProvider value={anonymousAuthUser}>
                                            {props.children}
                                        </CurrentUserProvider>
                                    </CurrentUserRepositoryProvider>
                                </TranslatorProvider>
                            </I18nManagerProvider>
                        </SubscribableToasterProvider>
                    </ToasterProvider>
                </I18nProvider>
            </ConfigProvider>
        </MemoryRouter>
    );
};
