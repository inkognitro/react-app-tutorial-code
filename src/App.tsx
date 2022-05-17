import React, { MouseEvent, useEffect } from "react";
import {
  anonymousAuthUser,
  useCurrentUser,
  useCurrentUserRepository,
  useCurrentUserWriter,
} from "./packages/core/auth";

function CurrentUserPlayground() {
  const currentUserWriter = useCurrentUserWriter();
  const currentUser = useCurrentUser();
  const isLoggedIn = currentUser.type === "authenticated";
  function loginUser() {
    currentUserWriter.setCurrentUser({
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
    currentUserWriter.setCurrentUser(anonymousAuthUser);
  }
  return (
    <div className="App">
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
    </div>
  );
}

function App() {
  const currentUserRepo = useCurrentUserRepository();
  useEffect(() => {
    currentUserRepo.init();
  }, []);
  return <CurrentUserPlayground />;
}

export default App;
