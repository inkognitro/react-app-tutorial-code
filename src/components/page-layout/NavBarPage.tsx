import React, { FC, useState } from 'react';
import { BlankPage, BlankPageProps } from './BlankPage';
import { anonymousAuthUser, useCurrentUser, useCurrentUserRepository } from '@packages/core/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Toolbar, Typography, Container, Menu, MenuItem } from '@mui/material';
import { useConfig } from '@packages/core/config';
import { Home } from '@mui/icons-material';
import { FunctionalLink, RoutingLink } from '@packages/core/routing';
import { useI18n, useI18nManager, useTranslator } from '@packages/core/i18n';
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
    justify-content: flex-start;
    margin-top: 40px;
    border-top: 1px solid grey;
    padding-top: 15px;
`;

const FooterLink = styled(FunctionalLink)`
    color: grey;
    text-decoration: none;
    margin-left: 10px;
    &:first-child {
        margin-left: 0;
    }
`;

const Footer: FC = () => {
    const { setLanguage } = useI18nManager();
    return (
        <StyledFooter>
            <FooterLink style={{ color: 'grey' }} onClick={() => setLanguage('de-CH')}>
                de-CH
            </FooterLink>
            <FooterLink style={{ color: 'grey' }} onClick={() => setLanguage('en-US')}>
                en-US
            </FooterLink>
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
