import React, { FC } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, FormControl } from '@mui/material';

export type ButtonProps = MuiButtonProps & {
    margin?: 'dense' | 'normal' | 'none';
    onClick?: () => void;
};

export const Button: FC<ButtonProps> = (props) => {
    let muiButtonProps: ButtonProps = { ...props };
    delete muiButtonProps.margin;
    return (
        <FormControl margin={props.margin} fullWidth={props.fullWidth}>
            <MuiButton {...muiButtonProps} />
        </FormControl>
    );
};
