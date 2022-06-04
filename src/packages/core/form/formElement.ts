import { Translation } from '@packages/core/i18n';

export type Message = {
    id: string;
    severity: 'info' | 'success' | 'error';
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

export type FormElementState = TextFieldState | CheckboxState;
