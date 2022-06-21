import { FC, useState } from 'react';
import { NavBarPage } from '@components/page-layout';
import { T, useTranslator } from '@packages/core/i18n';
import {
    Button,
    Checkbox,
    CheckboxState,
    createCheckboxState,
    createSingleSelectionState,
    createTextFieldState,
    Form,
    getStateWithEnrichedFormElementStates,
    SingleSelectionState,
    TextField,
    TextFieldState,
} from '@packages/core/form';
import { FunctionalLink } from '@packages/core/routing';
import { Typography } from '@mui/material';
import { SingleSelection } from '@packages/core/form/SingleSelection';
import { Entry, useArrayCollectionProvider } from '@packages/core/collection';
import { ApiV1ResponseTypes, useApiV1RequestHandler } from '@packages/core/api-v1/core';
import { registerUser } from '@packages/core/api-v1/auth';
import { useCurrentUserRepository } from '@packages/core/auth';

type GenderId = 'f' | 'm' | 'o';

const genderIds: GenderId[] = ['f', 'm', 'o'];

type RegistrationFormState = {
    genderSelection: SingleSelectionState<GenderId>;
    usernameField: TextFieldState;
    emailField: TextFieldState;
    passwordField: TextFieldState;
    agreeCheckbox: CheckboxState;
};

function createRegistrationFormState(): RegistrationFormState {
    return {
        genderSelection: createSingleSelectionState({ pathPart: ['gender'] }),
        usernameField: createTextFieldState({ pathPart: ['username'] }),
        emailField: createTextFieldState({ pathPart: ['email'] }),
        passwordField: createTextFieldState({ pathPart: ['password'] }),
        agreeCheckbox: createCheckboxState(),
    };
}

type RegistrationFormProps = {
    data: RegistrationFormState;
    onChangeData: (data: RegistrationFormState) => void;
    onSubmit: () => void;
};

const RegistrationForm: FC<RegistrationFormProps> = (props) => {
    const genderIdsProvider = useArrayCollectionProvider<GenderId>({
        dataArray: genderIds,
        createEntryKey: (gId) => gId,
    });
    const { t } = useTranslator();
    const termsAndConditionsLabel = (
        <T
            id="pages.registerPage.agreeOnTermsAndConditions"
            placeholders={{
                termsAndConditions: (
                    <FunctionalLink onClick={() => console.log('open terms and conditions')}>
                        {t('pages.registerPage.termsAndConditions')}
                    </FunctionalLink>
                ),
            }}
        />
    );
    return (
        <Form onSubmit={props.onSubmit}>
            <SingleSelection
                data={props.data.genderSelection}
                onChangeData={(data) => props.onChangeData({ ...props.data, genderSelection: data })}
                provider={genderIdsProvider}
                renderOption={(e: Entry<GenderId>) => {
                    switch (e.data) {
                        case 'f':
                            return t('pages.registerPage.genderOptions.female');
                        case 'm':
                            return t('pages.registerPage.genderOptions.male');
                        case 'o':
                            return t('pages.registerPage.genderOptions.other');
                        default:
                            console.error(`genderId "${e.data}" is not supported!`);
                            return null;
                    }
                }}
                label={t('pages.registerPage.gender')}
                variant="outlined"
                margin="dense"
                canChooseNone
                fullWidth
            />
            <TextField
                label={t('pages.registerPage.username')}
                data={props.data.usernameField}
                onChangeData={(data) => props.onChangeData({ ...props.data, usernameField: data })}
                type="text"
                maxLength={16}
                variant="outlined"
                margin="dense"
                fullWidth
                name="username"
            />
            <TextField
                label={t('pages.registerPage.email')}
                data={props.data.emailField}
                onChangeData={(data) => props.onChangeData({ ...props.data, emailField: data })}
                type="text"
                maxLength={191}
                variant="outlined"
                margin="dense"
                fullWidth
                name="email"
            />
            <TextField
                label={t('pages.registerPage.password')}
                data={props.data.passwordField}
                onChangeData={(data) => props.onChangeData({ ...props.data, passwordField: data })}
                type="password"
                variant="outlined"
                margin="dense"
                fullWidth
                name="password"
            />
            <Checkbox
                label={termsAndConditionsLabel}
                data={props.data.agreeCheckbox}
                onChangeData={(data) => props.onChangeData({ ...props.data, agreeCheckbox: data })}
                margin="dense"
            />
        </Form>
    );
};

export const RegisterPage: FC = () => {
    const { t } = useTranslator();
    const [registrationForm, setRegistrationForm] = useState(createRegistrationFormState());
    const apiV1RequestHandler = useApiV1RequestHandler();
    const currentUserRepo = useCurrentUserRepository();
    function canFormBeSubmitted(): boolean {
        return registrationForm.agreeCheckbox.value;
    }
    function submitForm() {
        if (!canFormBeSubmitted()) {
            return;
        }
        registerUser(apiV1RequestHandler, {
            username: registrationForm.usernameField.value,
            email: registrationForm.emailField.value,
            gender: registrationForm.genderSelection.chosenOption?.data as GenderId,
            password: registrationForm.passwordField.value,
        }).then((rr) => {
            if (!rr.response) {
                return;
            }
            if (rr.response.type !== ApiV1ResponseTypes.SUCCESS) {
                const newRegistrationFormState = getStateWithEnrichedFormElementStates(registrationForm, {
                    messages: rr.response.body.fieldMessages,
                    prefixPath: [],
                });
                setRegistrationForm(newRegistrationFormState);
                return;
            }
            currentUserRepo.setCurrentUser({
                type: 'authenticated',
                apiKey: rr.response.body.data.apiKey,
                data: {
                    id: rr.response.body.data.user.id,
                    username: rr.response.body.data.user.username,
                },
            });
            // todo: navigate to home!
        });
    }
    return (
        <NavBarPage title={t('pages.registerPage.title')}>
            <Typography component="h1" variant="h5">
                {t('pages.registerPage.title')}
            </Typography>
            <RegistrationForm
                data={registrationForm}
                onChangeData={(data) => setRegistrationForm(data)}
                onSubmit={() => submitForm()}
            />
            <Button
                margin="dense"
                variant="outlined"
                color="primary"
                disabled={!canFormBeSubmitted()}
                onClick={() => submitForm()}>
                {t('pages.registerPage.signUp')}
            </Button>
        </NavBarPage>
    );
};
