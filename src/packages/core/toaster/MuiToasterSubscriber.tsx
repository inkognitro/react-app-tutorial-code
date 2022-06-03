import React, { FC, useEffect, useRef, useState } from 'react';
import { Fade, Alert, Snackbar } from '@mui/material';
import { ToastMessage } from './toaster';
import { v4 } from 'uuid';
import { SubscribableToaster } from './subscribableToaster';

type MuiToastMessageProps = {
    data: ToastMessage;
    onClose: () => void;
};

const snackbarCloseAnimationDurationInMs = 300;

const MuiToastMessage: FC<MuiToastMessageProps> = (props) => {
    const [open, setOpen] = useState(true);
    function triggerCloseOnParentAfterCloseAnimationHasFinished() {
        setOpen(false);
        setTimeout(() => props.onClose(), snackbarCloseAnimationDurationInMs);
    }
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={props.data.autoHideDurationInMs}
            TransitionComponent={Fade}
            open={open}
            onClose={() => triggerCloseOnParentAfterCloseAnimationHasFinished()}>
            <Alert
                variant="filled"
                severity={props.data.severity}
                onClose={() => triggerCloseOnParentAfterCloseAnimationHasFinished()}>
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
    const pipelinedMessagesRef = useRef<ToastMessage[]>([]);
    const activeMessageRef = useRef<null | ToastMessage>(null);
    const [activeMessage, setActiveMessage] = useState<null | ToastMessage>(null);
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
            onShowMessage: (message: ToastMessage) => {
                pipelinedMessagesRef.current.push(message);
                if (!activeMessageRef.current) {
                    showNextMessage();
                }
            },
        });
        return () => props.toaster.unSubscribe(subscriberIdRef.current);
    }, [props.toaster, subscriberIdRef, pipelinedMessagesRef, activeMessageRef, showNextMessage]);
    if (!activeMessage) {
        return null;
    }
    return <MuiToastMessage key={activeMessage.id} data={activeMessage} onClose={() => showNextMessage()} />;
};
