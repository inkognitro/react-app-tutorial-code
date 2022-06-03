import { createContext, useContext } from 'react';
import { Toaster, ToastMessageCreationSettings, createToastMessage, ToastMessage } from './toaster';

export type ToasterSubscriber = {
    id: string;
    onShowMessage: (message: ToastMessage) => void;
};

export class SubscribableToaster implements Toaster {
    private subscribers: ToasterSubscriber[];

    constructor() {
        this.subscribers = [];
    }

    showMessage(settings: ToastMessageCreationSettings) {
        const toastMessage = createToastMessage(settings);

        this.subscribers.forEach((subscriber) => {
            subscriber.onShowMessage(toastMessage);
        });
    }

    subscribe(subscriber: ToasterSubscriber) {
        const subscribers = this.subscribers;
        this.subscribers = [...subscribers, subscriber];
    }

    unSubscribe(subscriberId: string) {
        this.subscribers = this.subscribers.filter((subscriber) => subscriber.id !== subscriberId);
    }
}

const subscribableToasterContext = createContext<null | SubscribableToaster>(null);
export const SubscribableToasterProvider = subscribableToasterContext.Provider;

export function useSubscribableToaster(): SubscribableToaster {
    const toaster = useContext(subscribableToasterContext);
    if (!toaster) {
        throw new Error('no SubscribableToaster was provided');
    }
    return toaster;
}
