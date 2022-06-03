import React, { FC, useEffect, useRef, useState } from 'react';
import { Fade, Alert, Snackbar } from '@mui/material';
import { ToastMessage as ToastMessageState } from './toaster';
import { v4 } from 'uuid';
import { SubscribableToaster } from './subscribableToaster';

type ToastMessageProps = {
    data: ToastMessageState;
    onClose: () => void;
};

const ToastMessage: FC<ToastMessageProps> = (props) => {
    const [open, setOpen] = useState(true);
    const isRenderedRef = useRef(true);
    useEffect(() => {
        return () => {
            isRenderedRef.current = false;
        };
    }, []);
    function close() {
        setOpen(false);
        setTimeout(() => {
            if (isRenderedRef.current) {
                props.onClose();
            }
        }, 300);
    }
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={props.data.autoHideDurationInMs}
            TransitionComponent={Fade}
            open={open}
            onAnimationEnd={() => props.onClose()}
            onClose={() => close()}>
            <Alert variant="filled" severity={props.data.severity} onClose={() => close()}>
                {props.data.content}
            </Alert>
        </Snackbar>
    );
};

export type MuiToasterSubscriberProps = {
    toaster: SubscribableToaster;
};

export const MuiToasterSubscriber: FC<MuiToasterSubscriberProps> = (props) => {
    const subscriberIdRef = useRef(v4());
    const pipelinedMessagesRef = useRef<ToastMessageState[]>([]);
    const activeMessageRef = useRef<null | ToastMessageState>(null);
    const [activeMessage, setActiveMessage] = useState<null | ToastMessageState>(null);
    function showNextMessage() {
        const nextMessage = pipelinedMessagesRef.current.shift();
        if (activeMessageRef.current && !nextMessage) {
            activeMessageRef.current = null;
            setActiveMessage(null);
            return;
        }
        if (!nextMessage) {
            return;
        }
        activeMessageRef.current = nextMessage;
        setActiveMessage(nextMessage);
    }
    useEffect(() => {
        props.toaster.subscribe({
            id: subscriberIdRef.current,
            onShowMessage: (message: ToastMessageState) => {
                pipelinedMessagesRef.current.push(message);
                if (!activeMessageRef.current) {
                    showNextMessage();
                }
            },
        });
        return () => props.toaster.unSubscribe(subscriberIdRef.current);
    }, []);
    if (!activeMessage) {
        return null;
    }
    return <ToastMessage key={activeMessage.id} data={activeMessage} onClose={() => showNextMessage()} />;
};
