import React, { FC, PropsWithChildren, useRef, useState } from "react";
import {
  anonymousAuthUser,
  AuthUser,
  BrowserCurrentUserRepository,
  CurrentUserProvider,
  CurrentUserRepositoryProvider,
} from "./packages/core/auth";

export const ServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
  const [currentUserState, setCurrentUserState] =
    useState<AuthUser>(anonymousAuthUser);
  const browserCurrentUserRepositoryRef = useRef(
    new BrowserCurrentUserRepository(setCurrentUserState)
  );
  return (
    <CurrentUserRepositoryProvider
      value={browserCurrentUserRepositoryRef.current}
    >
      <CurrentUserProvider value={currentUserState}>
        {props.children}
      </CurrentUserProvider>
    </CurrentUserRepositoryProvider>
  );
};
