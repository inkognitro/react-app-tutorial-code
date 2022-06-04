import { FieldMessage, FormElementState, FormElementTypes, Message } from './formElement';

type FieldMessagePath = (string | number)[];

const FormElementTypesArray = Object.keys(FormElementTypes).map((key) => {
    // @ts-ignore
    return FormElementTypes[key];
});

function isOfTypeFormElement(anyState: any): anyState is FormElementState {
    const pseudoFormElement = <FormElementState>anyState;
    if (!pseudoFormElement.type) {
        return false;
    }
    return FormElementTypesArray.includes(pseudoFormElement.type);
}

function isOfTypeFieldMessagePath(anyState: any): anyState is FieldMessagePath {
    const pseudoPath = <FieldMessagePath>anyState;
    if (!Array.isArray(pseudoPath)) {
        return false;
    }
    for (let index in pseudoPath) {
        const value = pseudoPath[index];
        if (typeof value !== 'number' && typeof value !== 'string') {
            return false;
        }
    }
    return true;
}

function getMessagesByPath(fieldMessages: FieldMessage[], path: FieldMessagePath): Message[] {
    const messages: Message[] = [];
    const requiredPathString = path.join('-');
    for (let index in fieldMessages) {
        const fieldMessage = fieldMessages[index];
        if (fieldMessage.path.join('-') !== requiredPathString) {
            continue;
        }
        messages.push(fieldMessage.message);
    }
    return messages;
}

type EnrichmentSettings = {
    messages: FieldMessage[];
    prefixPath: FieldMessagePath;
};

function getWithMessagesEnrichedFormElementState<S extends FormElementState>(
    state: S,
    settings: EnrichmentSettings
): S {
    switch (state.type) {
        case FormElementTypes.TEXT_FIELD:
        case FormElementTypes.CHECKBOX:
            if (!state.pathPart) {
                return state;
            }
            const requiredPath: FieldMessagePath = [...settings.prefixPath, ...state.pathPart];
            return {
                ...state,
                messages: getMessagesByPath(settings.messages, requiredPath),
            };
        default:
            return state;
    }
}

type AnyState = {
    pathPart?: FieldMessagePath;
};

export function getStateWithEnrichedFormElementStates<S = any>(anyState: S, settings: EnrichmentSettings): S {
    if (typeof anyState !== 'object' || anyState === null) {
        return anyState;
    }
    if (isOfTypeFormElement(anyState)) {
        return getWithMessagesEnrichedFormElementState(anyState, settings);
    }
    let newState = { ...anyState };
    for (let key in anyState) {
        const subState: AnyState = anyState[key];
        const prefixPath: FieldMessagePath =
            typeof subState === 'object' &&
            subState !== null &&
            subState.pathPart &&
            !isOfTypeFieldMessagePath(subState.pathPart)
                ? [...settings.prefixPath, ...subState.pathPart]
                : settings.prefixPath;
        // @ts-ignore
        newState[key] = getStateWithModifiedFormElementMessages(subState, {
            ...settings,
            prefixPath,
        });
    }
    return newState;
}
