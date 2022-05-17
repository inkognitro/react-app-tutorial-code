import React, {FC, PropsWithChildren, useRef, useState} from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {
  anonymousAuthUser,
  AuthUser,
  CurrentUserProvider, CurrentUserRepository,
  CurrentUserRepositoryProvider
} from "./packages/core/auth";

class StubCurrentUserRepository implements CurrentUserRepository {
  setCurrentUser(currentUser: AuthUser) {}

  getCurrentUser(): AuthUser {
     return anonymousAuthUser;
  }
}

const ServiceProvider: FC<PropsWithChildren<{}>> = props => {
  const stubCurrentUserRepositoryRef = useRef(new StubCurrentUserRepository());
  return (
      <CurrentUserRepositoryProvider value={stubCurrentUserRepositoryRef.current}>
        <CurrentUserProvider value={anonymousAuthUser}>
          {props.children}
        </CurrentUserProvider>
      </CurrentUserRepositoryProvider>
  );
};

test('renders app', () => {
  render(<ServiceProvider><App /></ServiceProvider>);
});
