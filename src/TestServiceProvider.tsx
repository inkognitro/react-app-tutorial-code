import {
    anonymousAuthUser,
    AuthUser,
    CurrentUserProvider,
    CurrentUserRepository,
    CurrentUserRepositoryProvider,
} from '@packages/core/auth';
import React, { FC, PropsWithChildren, useRef } from 'react';
import { Config, ConfigProvider } from '@packages/core/config';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider as ScThemeProvider } from 'styled-components';
import { theme } from '@components/theme';

class StubCurrentUserRepository implements CurrentUserRepository {
    setCurrentUser(currentUser: AuthUser) {}
    init() {}
}

export const TestServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
    const stubCurrentUserRepositoryRef = useRef(new StubCurrentUserRepository());
    const configRef = useRef<Config>({
        companyName: 'ACME',
    });
    return (
        <MuiThemeProvider theme={theme}>
            <ScThemeProvider theme={theme}>
                <MemoryRouter>
                    <ConfigProvider value={configRef.current}>
                        <CurrentUserRepositoryProvider value={stubCurrentUserRepositoryRef.current}>
                            <CurrentUserProvider value={anonymousAuthUser}>{props.children}</CurrentUserProvider>
                        </CurrentUserRepositoryProvider>
                    </ConfigProvider>
                </MemoryRouter>
            </ScThemeProvider>
        </MuiThemeProvider>
    );
};
