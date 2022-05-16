import { AuthUser } from './types';
import { createContext, useContext } from 'react';

const currentUserContext = createContext<AuthUser>({ type: 'anonymous' });

export const CurrentUserProvider = currentUserContext.Provider;

export function useCurrentUser(): AuthUser {
    return useContext(currentUserContext);
}