import React, { useEffect } from 'react';
import { useCurrentUser, useCurrentUserRepository } from '@packages/core/auth';
import { Route, Routes } from 'react-router-dom';
import { IndexPage } from '@pages/IndexPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { MySettingsPage } from '@pages/user-management/MySettingsPage';

function AppRoutes() {
    const currentUser = useCurrentUser();
    const isUserLoggedIn = currentUser.type === 'authenticated';
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            {isUserLoggedIn && <Route path="/user-management/my-settings" element={<MySettingsPage />} />}
        </Routes>
    );
}

function App() {
    const currentUserRepo = useCurrentUserRepository();
    useEffect(() => {
        currentUserRepo.init();
    }, []);
    return <AppRoutes />;
}

export default App;
