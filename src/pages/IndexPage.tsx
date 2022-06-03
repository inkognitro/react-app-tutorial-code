import { FC } from 'react';
import { NavBarPage } from '@components/page-layout';
import { T, useTranslator } from '@packages/core/i18n';
import { useCurrentUser } from '@packages/core/auth';
import { FunctionalLink } from '@packages/core/routing';
import { useToaster } from '@packages/core/toaster';
import { Alert } from '@mui/material';

export const IndexPage: FC = () => {
    const { t } = useTranslator();
    const currentUser = useCurrentUser();
    const { showMessage } = useToaster();
    const username =
        currentUser.type === 'authenticated' ? currentUser.data.username : t('core.currentUser.guestDisplayName');
    const greeting = <T id="pages.indexPage.greeting" placeholders={{ username: <strong>{username}</strong> }} />;
    return (
        <NavBarPage title="Home">
            {greeting}
            <div style={{ marginTop: '40px' }}>
                <Alert severity="info">
                    <strong>MuiToasterSubscriber:</strong>
                    <br />
                    Note that if a toast message is displayed and you click outside of it, the current toast will
                    automatically close!
                    <br />
                    <br />
                    <FunctionalLink onClick={() => showMessage({ content: greeting })}>
                        trigger info toast
                    </FunctionalLink>
                    <br />
                    <FunctionalLink
                        onClick={() => {
                            showMessage({
                                severity: 'success',
                                autoHideDurationInMs: 1000,
                                content: <>First: {greeting}</>,
                            });
                            showMessage({
                                severity: 'success',
                                autoHideDurationInMs: 1000,
                                content: <>Second: {greeting}</>,
                            });
                        }}>
                        trigger multiple success toasts
                    </FunctionalLink>
                </Alert>
            </div>
        </NavBarPage>
    );
};
