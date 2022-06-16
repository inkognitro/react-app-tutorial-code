import React, { FC, ReactNode } from 'react';
import { CollectionProvider, Entry } from '@packages/core/collection';
import { CoreSelection } from './CoreSelection';
import { Messages } from './Messages';
import { SingleSelectionState } from './formElementState';

export type SingleSelectionProps<Data = any> = {
    provider: CollectionProvider<Data>;
    data: SingleSelectionState<Data>;
    renderOption: (entry: Entry<Data>) => ReactNode;
    onChangeData?: (data: SingleSelectionState<Data>) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    margin?: 'dense' | 'normal' | 'none';
    label?: ReactNode;
    canChooseNone?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
};

export const SingleSelection: FC<SingleSelectionProps> = (props) => {
    const hasErrorMessages = !!props.data.messages.find((m) => m.severity === 'error');
    return (
        <CoreSelection
            variant={props.variant}
            margin={props.margin}
            label={props.label}
            canChooseNone={props.canChooseNone}
            disabled={props.disabled}
            readOnly={props.readOnly}
            fullWidth={props.fullWidth}
            size={props.size}
            options={props.provider.entries}
            chosenOption={props.data.chosenOption}
            onChange={(chosenOption) => {
                if (props.onChangeData) {
                    props.onChangeData({ ...props.data, chosenOption });
                }
            }}
            renderOption={props.renderOption}
            error={hasErrorMessages}
            errorSection={props.data.messages.length ? <Messages messages={props.data.messages} /> : undefined}
        />
    );
};
