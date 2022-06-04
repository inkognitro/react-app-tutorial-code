import { FC, useState } from 'react';
import { NavBarPage } from '@components/page-layout';
import { useTranslator, T } from '@packages/core/i18n';
import {
    Checkbox,
    CheckboxState,
    createCheckboxState,
    createTextFieldState,
    Form,
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
        usernameField: createTextFieldState(),
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
            />
            <TextField
                label={t('pages.registerPage.password')}
                data={props.data.passwordField}
                onChangeData={(data) => props.onChangeData({ ...props.data, passwordField: data })}
                type="password"
                variant="outlined"
                margin="dense"
                fullWidth
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
    return (
        <NavBarPage title={t('pages.registerPage.title')}>
            <Typography component="h1" variant="h4">
                {t('pages.registerPage.title')}
            </Typography>
            <RegistrationForm data={registrationForm} onChangeData={(data) => setRegistrationForm(data)} />
        </NavBarPage>
    );
};
