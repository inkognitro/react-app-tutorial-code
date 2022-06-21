import { Translation } from '@packages/core/i18n';
import { Entry } from '@packages/core/collection';

export type Message = {
    id: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    translation: Translation;
};

export type FieldMessagePath = (string | number)[];

export type FieldMessage = {
    path: FieldMessagePath;
    message: Message;
};

export enum FormElementTypes {
    TEXT_FIELD = 'textField-c615d5de',
    CHECKBOX = 'checkbox-c615d5de',
    SINGLE_SELECTION = 'singleSelection-c615d5de',
}

type GenericFormElementState<T extends FormElementTypes, P extends object = {}> = {
    type: T;
    pathPart?: FieldMessagePath;
} & P;

export type TextFieldState = GenericFormElementState<
    FormElementTypes.TEXT_FIELD,
    { value: string; messages: Message[] }
>;

export type CheckboxState = GenericFormElementState<FormElementTypes.CHECKBOX, { value: boolean; messages: Message[] }>;

export type SingleSelectionState<D = any> = GenericFormElementState<
    FormElementTypes.SINGLE_SELECTION,
    { chosenOption: null | Entry<D>; messages: Message[] }
>;

export type FormElementState = TextFieldState | CheckboxState | SingleSelectionState;

export function createTextFieldState(partial: Partial<Omit<TextFieldState, 'type'>> = {}): TextFieldState {
    return {
        messages: [],
        value: '',
        ...partial,
        type: FormElementTypes.TEXT_FIELD,
    };
}

export function createCheckboxState(partial: Partial<Omit<CheckboxState, 'type'>> = {}): CheckboxState {
    return {
        messages: [],
        value: false,
        ...partial,
        type: FormElementTypes.CHECKBOX,
    };
}

export function createSingleSelectionState<D = any>(
    partial: Partial<Omit<SingleSelectionState, 'type'>> = {}
): SingleSelectionState<D> {
    return {
        messages: [],
        chosenOption: null,
        ...partial,
        type: FormElementTypes.SINGLE_SELECTION,
    };
}
