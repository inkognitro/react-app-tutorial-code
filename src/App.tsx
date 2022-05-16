import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import {
  anonymousAuthUser,
  AuthUser,
  BrowserCurrentUserRepository,
  CurrentUserProvider,
  CurrentUserRepositoryProvider,
} from "../packages/core/auth";

function App() {
  const [currentUserState, setCurrentUserState] = useState<AuthUser>(anonymousAuthUser);
  const browserCurrentUserRepositoryRef = useRef(new BrowserCurrentUserRepository(setCurrentUserState));
  return (
      <CurrentUserRepositoryProvider value={browserCurrentUserRepositoryRef.current}>
        <CurrentUserProvider value={currentUserState}>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </CurrentUserProvider>
      </CurrentUserRepositoryProvider>
  );
}

export default App;
