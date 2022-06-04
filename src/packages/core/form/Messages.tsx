import { FC } from 'react';
import { Message as MessageState } from './formElementState';
import styled from 'styled-components';
import { T } from '@packages/core/i18n';

const StyledSpan = styled.span`
    &.error {
        color: ${({ theme }) => theme.palette.error.main};
    }
`;

type MessageProps = MessageState;

const Message: FC<MessageProps> = (props) => {
    if (props.severity === 'error') {
        return (
            <StyledSpan className="error">
                <T {...props.translation} />
            </StyledSpan>
        );
    }
    return null;
};

export type MessagesProps = {
    messages: MessageState[];
};

export const Messages: FC<MessagesProps> = (props) => {
    return (
        <>
            {props.messages.map((message) => (
                <Message key={message.id} {...message} />
            ))}
        </>
    );
};
