import React, { FC, MouseEvent } from "react";
import { BlankPage, BlankPageProps } from "./BlankPage";
import {
  anonymousAuthUser,
  useCurrentUser,
  useCurrentUserRepository,
} from "@packages/core/auth";

function Nav() {
  const currentUserRepo = useCurrentUserRepository();
  const currentUser = useCurrentUser();
  const isLoggedIn = currentUser.type === "authenticated";
  function loginUser(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    currentUserRepo.setCurrentUser({
      type: "authenticated",
      apiKey: "foo",
      data: {
        id: "foo",
        username: "Linus",
      },
    });
  }
  function logoutUser(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    currentUserRepo.setCurrentUser(anonymousAuthUser);
  }
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "600px",
        textAlign: "center",
      }}
    >
      {!isLoggedIn && (
        <a href="#" onClick={loginUser}>
          login
        </a>
      )}
      {isLoggedIn && (
        <a href="#" onClick={logoutUser}>
          logout
        </a>
      )}
      ::{" "}
      {currentUser.type === "authenticated"
        ? currentUser.data.username
        : "Anonymous"}
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
