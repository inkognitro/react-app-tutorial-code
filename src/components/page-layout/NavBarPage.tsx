import React, { FC, MouseEvent } from 'react';
import { BlankPage, BlankPageProps } from './BlankPage';
import { anonymousAuthUser, useCurrentUser, useCurrentUserRepository } from '@packages/core/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Button, IconButton, Toolbar, Typography, Link as MuiLink, Grid, Container } from '@mui/material';
import { useConfig } from '@packages/core/config';
import { Home } from '@mui/icons-material';

const Nav: FC = () => {
    const { companyName } = useConfig();
    const navigate = useNavigate();
    const currentUserRepo = useCurrentUserRepository();
    const currentUser = useCurrentUser();
    const isLoggedIn = currentUser.type === 'authenticated';
    function loginUser(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        currentUserRepo.setCurrentUser({
            type: 'authenticated',
            apiKey: 'foo',
            data: {
                id: 'foo',
                username: 'Linus',
            },
        });
    }
    function logoutUser(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        currentUserRepo.setCurrentUser(anonymousAuthUser);
        navigate('/');
    }
    return (
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '15px' }}>
            <MuiLink>
                <Home />
            </MuiLink>
            <Typography component="h2" variant="h5" color="inherit" align="center" noWrap sx={{ flex: 1 }}>
                {companyName}
            </Typography>
            {isLoggedIn && (
                <>
                    <MuiLink onClick={loginUser} noWrap variant="button" href="/" sx={{ p: 1, flexShrink: 0 }}>
                        Login
                    </MuiLink>{' '}
                    <Button variant="outlined" size="small">
                        Sign up
                    </Button>
                </>
            )}
        </Toolbar>
    );
};

function NavOld() {
    const navigate = useNavigate();
    const currentUserRepo = useCurrentUserRepository();
    const currentUser = useCurrentUser();
    const isLoggedIn = currentUser.type === 'authenticated';
    const currentUserDisplayName = currentUser.type === 'authenticated' ? currentUser.data.username : 'Anonymous';
    function loginUser(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        currentUserRepo.setCurrentUser({
            type: 'authenticated',
            apiKey: 'foo',
            data: {
                id: 'foo',
                username: 'Linus',
            },
        });
    }
    function logoutUser(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        currentUserRepo.setCurrentUser(anonymousAuthUser);
        navigate('/');
    }
    return (
        <div
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '600px',
                textAlign: 'center',
            }}>
            <Link to="/">Home</Link> &ndash;{' '}
            {!isLoggedIn && (
                <>
                    <Link to="/auth/register">Register</Link> &ndash;{' '}
                    <a href="#" onClick={loginUser}>
                        Login
                    </a>
                </>
            )}
            {isLoggedIn && (
                <a href="#" onClick={logoutUser}>
                    Logout
                </a>
            )}{' '}
            :: {isLoggedIn && <Link to="/user-management/my-settings">{currentUserDisplayName}</Link>}
            {!isLoggedIn && currentUserDisplayName}
        </div>
    );
}

export type NavBarPageProps = BlankPageProps;

export const NavBarPage: FC<NavBarPageProps> = (props) => {
    return (
        <BlankPage title={props.title}>
            <Nav />
            <Container>{props.children}</Container>
        </BlankPage>
    );
};
