import { FC, useState } from 'react';
import { NavBarPage } from '@components/page-layout';
import { useTranslator, T } from '@packages/core/i18n';
import {
    Button,
    Checkbox,
    CheckboxState,
    createCheckboxState,
    createTextFieldState,
    FieldMessage,
    Form,
    getStateWithEnrichedFormElementStates,
    TextField,
    TextFieldState,
} from '@packages/core/form';
import { FunctionalLink } from '@packages/core/routing';
import { Typography } from '@mui/material';

type RegistrationFormState = {
    usernameField: TextFieldState;
    emailField: TextFieldState;
    passwordField: TextFieldState;
    agreeCheckbox: CheckboxState;
};

function createRegistrationFormState(): RegistrationFormState {
    return {
        usernameField: createTextFieldState({ pathPart: ['username'] }),
        emailField: createTextFieldState(),
        passwordField: createTextFieldState(),
        agreeCheckbox: createCheckboxState(),
    };
}

type RegistrationFormProps = {
    data: RegistrationFormState;
    onChangeData: (data: RegistrationFormState) => void;
};

const RegistrationForm: FC<RegistrationFormProps> = (props) => {
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
        <Form>
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
    function addErrors() {
        console.log('sdfkljsdfjklsd');

        const fieldMessages: FieldMessage[] = [
            {
                path: ['username'],
                message: {
                    id: 'foo',
                    severity: 'error',
                    translation: { id: 'missing.translation.key' },
                },
            },
        ];

        console.log(
            getStateWithEnrichedFormElementStates(registrationForm, {
                messages: fieldMessages,
                prefixPath: [],
            })
        );

        setRegistrationForm(
            getStateWithEnrichedFormElementStates(registrationForm, {
                messages: fieldMessages,
                prefixPath: [],
            })
        );
    }
    return (
        <NavBarPage title={t('pages.registerPage.title')}>
            <Typography component="h1" variant="h5">
                {t('pages.registerPage.title')}
            </Typography>
            <RegistrationForm data={registrationForm} onChangeData={(data) => setRegistrationForm(data)} />
            <Button margin="dense" variant="outlined" color="primary" onClick={() => addErrors()}>
                {t('pages.registerPage.signUp')}
            </Button>
        </NavBarPage>
    );
};
