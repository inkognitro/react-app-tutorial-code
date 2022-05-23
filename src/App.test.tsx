import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { TestServiceProvider } from './TestServiceProvider';

test('renders app', () => {
    render(
        <TestServiceProvider>
            <App />
        </TestServiceProvider>
    );
});
