import { createContext, useContext } from 'react';
import { AuthUser } from './types';

export type CurrentUserWriter = {
    setCurrentUser(currentUser: AuthUser): void;
};

type CurrentUserStateSetter = (currentUser: AuthUser) => void;

export class StateCurrentUserWriter implements CurrentUserWriter {
    private readonly setCurrentUserState: CurrentUserStateSetter

    constructor(setCurrentUserState: CurrentUserStateSetter) {
        this.setCurrentUserState = setCurrentUserState;
    }

    setCurrentUser(currentUser: AuthUser) {
        this.setCurrentUserState(currentUser);
    }
}

const currentUserWriterContext = createContext<CurrentUserWriter | null>(null);
export const CurrentUserWriterProvider = currentUserWriterContext.Provider;

export function useCurrentUserWriter(): CurrentUserWriter {
    const writer = useContext(currentUserWriterContext);
    if (!writer) {
        throw new Error(`no CurrentUserWriter was provided`);
    }
    return writer;
}