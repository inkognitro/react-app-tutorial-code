import React, { CSSProperties, FC, ReactNode } from 'react';
import styled from 'styled-components';

// browsers do require a submit button inside the form element for submitting the form on element's enter key press
const InvisibleSubmitButton = styled.button`
    display: none;
`;

const StyledForm = styled.form`
    width: 100%;
`;

export type FormProps = {
    onSubmit?: () => void;
    noValidate?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
};

export const Form: FC<FormProps> = (props) => {
    return (
        <StyledForm
            style={props.style}
            className={props.className}
            noValidate={props.noValidate}
            onSubmit={(event) => {
                event.preventDefault();
                if (props.onSubmit) {
                    props.onSubmit();
                }
            }}>
            {props.children}
            <InvisibleSubmitButton type="submit">SUBMIT</InvisibleSubmitButton>
        </StyledForm>
    );
};
