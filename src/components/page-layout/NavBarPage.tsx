import React, { FC, useState } from 'react';
import { BlankPage, BlankPageProps } from './BlankPage';
import { anonymousAuthUser, useCurrentUser, useCurrentUserRepository } from '@packages/core/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Toolbar, Typography, Container, Menu, MenuItem } from '@mui/material';
import { useConfig } from '@packages/core/config';
import { Home } from '@mui/icons-material';
import { FunctionalLink, RoutingLink } from '@packages/core/routing';
import { LanguageCode, useI18n, useI18nManager, useTranslator } from '@packages/core/i18n';
import styled from 'styled-components';

const LoggedInUserMenu: FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslator();
    const currentUserRepo = useCurrentUserRepository();
    const currentUser = useCurrentUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    if (currentUser.type !== 'authenticated') {
        return null;
    }
    function logoutUser() {
        currentUserRepo.setCurrentUser(anonymousAuthUser);
        navigate('/');
    }
    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }
    function closeMenu() {
        setAnchorEl(null);
    }
    const isMenuOpen = !!anchorEl;
    return (
        <>
            <Button
                id="basic-button"
                aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                onClick={handleClick}>
                {currentUser.data.username}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={closeMenu}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                <MenuItem
                    onClick={() => {
                        navigate('/user-management/my-settings');
                        closeMenu();
                    }}>
                    {t('core.nav.mySettings')}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        logoutUser();
                        closeMenu();
                    }}>
                    {t('core.nav.logout')}
                </MenuItem>
            </Menu>
        </>
    );
};

const Nav: FC = () => {
    const { companyName } = useConfig();
    const navigate = useNavigate();
    const { t } = useTranslator();
    const currentUserRepo = useCurrentUserRepository();
    const currentUser = useCurrentUser();
    const isLoggedIn = currentUser.type === 'authenticated';
    function loginUser() {
        currentUserRepo.setCurrentUser({
            type: 'authenticated',
            apiKey: 'foo',
            data: {
                id: 'foo',
                username: 'Linus',
            },
        });
    }
    return (
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '15px' }}>
            <RoutingLink to="/">
                <Home />
            </RoutingLink>
            <Typography component="h2" variant="h5" color="inherit" align="center" noWrap sx={{ flex: 1 }}>
                {companyName}
            </Typography>
            {!isLoggedIn && (
                <>
                    <FunctionalLink onClick={loginUser} noWrap variant="button" href="/" sx={{ p: 1, flexShrink: 0 }}>
                        {t('core.nav.login')}
                    </FunctionalLink>{' '}
                    <Button variant="outlined" size="small" onClick={() => navigate('/auth/register')}>
                        {t('core.nav.signUp')}
                    </Button>
                </>
            )}
            {isLoggedIn && <LoggedInUserMenu />}
        </Toolbar>
    );
};

const StyledFooter = styled.footer`
    display: flex;
    justify-content: space-around;
    margin-top: 60px;
`;

const FooterLink = styled(FunctionalLink)`
    color: #ddd;
    text-decoration: none;
    margin: 0 5px;
    font-family: inherit;
    font-size: 12px;
    &.active {
        color: #bbb;
    }
`;

const Footer: FC = () => {
    const { t } = useTranslator();
    const { setLanguage } = useI18nManager();
    const { languageCode } = useI18n();
    function getLinkClassName(langCode: LanguageCode): undefined | string {
        if (languageCode === langCode) {
            return 'active';
        }
        return undefined;
    }
    return (
        <StyledFooter>
            <div>
                <FooterLink onClick={() => setLanguage('de-CH')} className={getLinkClassName('de-CH')}>
                    {t('core.languages.deCH')}
                </FooterLink>
                <FooterLink onClick={() => setLanguage('en-US')} className={getLinkClassName('en-US')}>
                    {t('core.languages.enUS')}
                </FooterLink>
            </div>
        </StyledFooter>
    );
};

export type NavBarPageProps = BlankPageProps;

export const NavBarPage: FC<NavBarPageProps> = (props) => {
    return (
        <BlankPage title={props.title}>
            <Nav />
            <Container>
                {props.children}
                <Footer />
            </Container>
        </BlankPage>
    );
};
