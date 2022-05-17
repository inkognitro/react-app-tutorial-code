import {
  anonymousAuthUser,
  AuthUser,
  CurrentUserProvider,
  CurrentUserRepository,
  CurrentUserRepositoryProvider,
} from "./packages/core/auth";
import React, { FC, PropsWithChildren, useRef } from "react";

class StubCurrentUserRepository implements CurrentUserRepository {
  setCurrentUser(currentUser: AuthUser) {}

  getCurrentUser(): AuthUser {
    return anonymousAuthUser;
  }
}

export const TestServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
  const stubCurrentUserRepositoryRef = useRef(new StubCurrentUserRepository());
  return (
    <CurrentUserRepositoryProvider value={stubCurrentUserRepositoryRef.current}>
      <CurrentUserProvider value={anonymousAuthUser}>
        {props.children}
      </CurrentUserProvider>
    </CurrentUserRepositoryProvider>
  );
};
