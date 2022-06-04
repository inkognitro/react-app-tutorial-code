import { TextFieldState } from './formElement';
import React, { CSSProperties, FC } from 'react';
import { TextField as MuiTextField, InputProps, FormControl } from '@mui/material';
import { Messages } from './Messages';

export type TextFieldProps = {
    data: TextFieldState;
    onChangeData?: (data: TextFieldState) => void;
    type: 'text' | 'password' | 'email';
    variant?: 'standard' | 'filled' | 'outlined';
    margin?: 'none' | 'normal' | 'dense';
    label?: string;
    name?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium';
    maxLength?: number;
    style?: CSSProperties;
    inputProps?: InputProps['inputProps'];
};

export const TextField: FC<TextFieldProps> = (props) => {
    const variant = props.variant ?? 'standard';
    const margin = props.margin ?? 'none';
    let inputProps: InputProps['inputProps'] = props.inputProps ?? undefined;
    if (props.readOnly || props.maxLength !== undefined) {
        if (!inputProps) {
            inputProps = {};
        }
        if (props.readOnly) {
            inputProps = { ...inputProps, readOnly: true };
        }
        if (props.maxLength !== undefined) {
            inputProps = { ...inputProps, maxLength: props.maxLength };
        }
    }
    return (
        <FormControl margin={margin} fullWidth={props.fullWidth}>
            <MuiTextField
                style={props.style}
                size={props.size}
                inputProps={inputProps}
                disabled={props.disabled}
                variant={variant}
                required={props.required}
                fullWidth={props.fullWidth}
                label={props.label}
                name={props.name}
                autoComplete={props.autoComplete}
                autoFocus={props.autoFocus}
                type={props.type}
                value={props.data.value}
                onChange={(event) => {
                    if (props.onChangeData) {
                        props.onChangeData({
                            ...props.data,
                            value: event.target.value,
                        });
                    }
                }}
            />
            {!props.data.messages.length ? undefined : <Messages messages={props.data.messages} />}
        </FormControl>
    );
};
