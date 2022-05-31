import { FC } from 'react';
import { NavBarPage } from '@components/page-layout';
import { T, useTranslator } from '@packages/core/i18n';
import { useCurrentUser } from '@packages/core/auth';

export const IndexPage: FC = () => {
    const { t } = useTranslator();
    const currentUser = useCurrentUser();
    const username =
        currentUser.type === 'authenticated' ? currentUser.data.username : t('core.currentUser.guestDisplayName');
    return (
        <NavBarPage title="Home">
            <T id="pages.indexPage.greeting" placeholders={{ username: <strong>{username}</strong> }} />
        </NavBarPage>
    );
};
