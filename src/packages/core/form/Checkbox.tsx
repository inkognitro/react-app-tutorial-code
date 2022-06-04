import React, { FC, ReactNode } from 'react';
import { CheckboxState } from '@packages/core/form';
import { Checkbox as MuiCheckbox, FormControl, FormControlLabel } from '@mui/material';
import { Messages } from './Messages';

export type CheckboxProps = {
    data: CheckboxState;
    margin?: 'dense' | 'normal' | 'none';
    onChangeData?: (data: CheckboxState) => void;
    label?: ReactNode;
    name?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    required?: boolean;
    value?: string;
    color?: 'default' | 'primary' | 'secondary';
    readOnly?: boolean;
};

export const Checkbox: FC<CheckboxProps> = (props) => {
    const checkbox = (
        <MuiCheckbox
            readOnly={props.readOnly}
            required={props.required}
            name={props.name}
            autoFocus={props.autoFocus}
            checked={props.data.value}
            onChange={(event) => {
                if (props.onChangeData) {
                    props.onChangeData({
                        ...props.data,
                        value: event.target.checked,
                    });
                }
            }}
            value={props.value}
            color={props.color}
        />
    );
    if (!props.label) {
        return checkbox;
    }
    return (
        <FormControl margin={props.margin}>
            <FormControlLabel control={checkbox} label={props.label} />
            {!props.data.messages.length ? undefined : <Messages messages={props.data.messages} />}
        </FormControl>
    );
};
