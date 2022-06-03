import { FC } from 'react';
import { NavBarPage } from '@components/page-layout';
import { T, useTranslator } from '@packages/core/i18n';
import { useCurrentUser } from '@packages/core/auth';
import { FunctionalLink } from '@packages/core/routing';
import { useToaster } from '@packages/core/toaster';

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
                <FunctionalLink onClick={() => showMessage({ content: greeting })}>
                    trigger success toast
                </FunctionalLink>
            </div>
        </NavBarPage>
    );
};
