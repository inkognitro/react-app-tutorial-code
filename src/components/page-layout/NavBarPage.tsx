import React, { FC, MouseEvent } from 'react';
import { BlankPage, BlankPageProps } from './BlankPage';
import { anonymousAuthUser, useCurrentUser, useCurrentUserRepository } from '@packages/core/auth';
import { Link, useNavigate } from 'react-router-dom';

function Nav() {
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
            {props.children}
        </BlankPage>
    );
};
