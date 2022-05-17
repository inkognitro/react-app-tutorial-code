import React, { useEffect } from "react";
import {
  anonymousAuthUser,
  useCurrentUserRepository,
  useCurrentUserWriter,
} from "./packages/core/auth";

function CurrentUserPlayground() {
  const currentUserWriter = useCurrentUserWriter();
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
  function logoutUser() {
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
        <a href="#" onClick={loginUser}>
          login
        </a>
        <a href="#" onClick={logoutUser}>
          logout
        </a>
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
