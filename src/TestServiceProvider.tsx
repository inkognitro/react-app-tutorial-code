import {
  anonymousAuthUser,
  AuthUser,
  CurrentUserProvider,
  CurrentUserRepository,
  CurrentUserRepositoryProvider,
} from "@packages/core/auth";
import React, { FC, PropsWithChildren, useRef } from "react";
import { Config, ConfigProvider } from "@packages/core/config";

class StubCurrentUserRepository implements CurrentUserRepository {
  setCurrentUser(currentUser: AuthUser) {}
  init() {}
}

export const TestServiceProvider: FC<PropsWithChildren<{}>> = (props) => {
  const stubCurrentUserRepositoryRef = useRef(new StubCurrentUserRepository());
  const configRef = useRef<Config>({
    companyName: "ACME",
  });
  return (
    <ConfigProvider value={configRef.current}>
      <CurrentUserRepositoryProvider
        value={stubCurrentUserRepositoryRef.current}
      >
        <CurrentUserProvider value={anonymousAuthUser}>
          {props.children}
        </CurrentUserProvider>
      </CurrentUserRepositoryProvider>
    </ConfigProvider>
  );
};
