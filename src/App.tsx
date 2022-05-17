import React from "react";
import { useCurrentUserRepository } from "./packages/core/auth";

function App() {
  const currentUserRepo = useCurrentUserRepository();
  function loginUser() {
    currentUserRepo.setCurrentUser({
      type: "authenticated",
      apiKey: "foo",
      data: {
        id: "foo",
        username: "Linus",
      },
    });
  }
  function logoutUser() {
    currentUserRepo.setCurrentUser({
      type: "authenticated",
      apiKey: "foo",
      data: {
        id: "foo",
        username: "Linus",
      },
    });
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

export default App;
