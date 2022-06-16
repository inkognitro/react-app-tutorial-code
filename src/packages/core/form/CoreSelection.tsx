import React, { FC, ReactNode, useState } from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { v4 } from 'uuid';
import { useTranslator } from '@packages/core/i18n';
import { Entry } from '@packages/core/collection';

export type CoreSelectionProps<Data = any> = {
    variant?: 'standard' | 'outlined' | 'filled';
    margin?: 'dense' | 'normal' | 'none';
    label?: ReactNode;
    options: Entry<Data>[];
    chosenOption: null | Entry<Data>;
    renderOption: (entry: Entry<Data>) => ReactNode;
    canChooseNone?: boolean;
    onChange?: (option: null | Entry<Data>) => void;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    errorSection?: ReactNode;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
};

export const CoreSelection: FC<CoreSelectionProps> = (props) => {
    const { t } = useTranslator();
    const [labelId] = useState(v4());
    const shouldChosenOptionBeAddedToOptions =
        props.chosenOption && !props.options.find((o) => o.key === props.chosenOption?.key);
    const options: Entry[] =
        props.chosenOption && shouldChosenOptionBeAddedToOptions
            ? [props.chosenOption, ...props.options]
            : props.options;
    const shouldNoneOptionBeShown = !props.chosenOption || props.canChooseNone;
    function getEntryByKeyOrNull(key: string): null | Entry {
        const entry = options.find((e) => e.key === key);
        if (!entry) {
            return null;
        }
        return entry;
    }
    return (
        <FormControl
            margin={props.margin}
            variant={props.variant}
            error={props.error}
            fullWidth={props.fullWidth}
            size={props.size}>
            {props.label && <InputLabel id={labelId}>{props.label}</InputLabel>}
            <Select
                readOnly={props.readOnly}
                disabled={props.disabled}
                labelId={labelId}
                value={props.chosenOption?.key ?? ''}
                onChange={(event) => {
                    if (props.onChange) {
                        props.onChange(getEntryByKeyOrNull(event.target.value));
                    }
                }}
                label={props.label}>
                {shouldNoneOptionBeShown && (
                    <MenuItem value="">
                        <em>{t('core.form.selection.choose')}</em>
                    </MenuItem>
                )}
                {options.map((o) => (
                    <MenuItem key={o?.key} value={o?.key}>
                        {props.renderOption(o)}
                    </MenuItem>
                ))}
            </Select>
            {props.errorSection}
        </FormControl>
    );
};
