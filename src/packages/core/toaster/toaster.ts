import { v4 } from 'uuid';
import { createContext, ReactNode, useContext } from 'react';

type Severity = 'info' | 'success' | 'warning' | 'error';

type ToastMessageContent = ReactNode | string;

export type ToastMessage = {
    id: string;
    severity: Severity;
    content: ReactNode | string;
    autoHideDurationInMs?: null | number;
};

export type ToastMessageCreationSettings = Partial<ToastMessage> & { content: ToastMessageContent };

export function createToastMessage(settings: ToastMessageCreationSettings): ToastMessage {
    return {
        id: v4(),
        severity: 'info',
        autoHideDurationInMs: 3000,
        ...settings,
    };
}

export interface Toaster {
    showMessage(settings: ToastMessageCreationSettings): void;
}

const toasterContext = createContext<null | Toaster>(null);
export const ToasterProvider = toasterContext.Provider;

export function useToaster(): Toaster {
    const ctx = useContext(toasterContext);
    if (!ctx) {
        throw new Error('no Toaster was provided');
    }
    return ctx;
}
