import { createContext, useContext } from 'react';
import { AuthUser } from './authUser';
import { anonymousAuthUser } from "./currentUser";

export type CurrentUserRepository = {
    getCurrentUser(): AuthUser;
    setCurrentUser(currentUser: AuthUser): void;
};

type CurrentUserStateSetter = (currentUser: AuthUser) => void;

export class BrowserCurrentUserRepository implements CurrentUserRepository {
    private readonly setCurrentUserState: CurrentUserStateSetter;

    constructor(setCurrentUserState: CurrentUserStateSetter) {
        this.setCurrentUserState = setCurrentUserState;
    }

    setCurrentUser(currentUser: AuthUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.setCurrentUserState(currentUser);
    }

    getCurrentUser(): AuthUser {
        const storedCurrentUserStr = localStorage.getItem('currentUser');
        if (!storedCurrentUserStr) {
            return anonymousAuthUser;
        }
        return JSON.parse(storedCurrentUserStr) as AuthUser;
    }
}

const currentUserRepositoryContext = createContext<CurrentUserRepository | null>(null);
export const CurrentUserRepositoryProvider = currentUserRepositoryContext.Provider;

export function useCurrentUserRepository(): CurrentUserRepository {
    const repo = useContext(currentUserRepositoryContext);
    if (!repo) {
        throw new Error(`no CurrentUserRepository was provided`);
    }
    return repo;
}