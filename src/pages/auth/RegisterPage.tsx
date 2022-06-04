import { FC, useState } from 'react';
import { NavBarPage } from '@components/page-layout';
import { useTranslator, T } from '@packages/core/i18n';
import { Checkbox, CheckboxState, Form, TextField, TextFieldState } from '@packages/core/form';
import { FunctionalLink } from '@packages/core/routing';

type RegistrationFormState = {
    usernameField: TextFieldState;
    agreeCheckbox: CheckboxState;
};

function createRegistrationFormState(): RegistrationFormState {
    return {
        usernameField: createTextFieldState(),
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
            />
            <Checkbox
                label={termsAndConditionsLabel}
                data={props.data.agreeCheckbox}
                onChangeData={(data) => props.onChangeData({ ...props.data, agreeCheckbox: data })}
            />
        </Form>
    );
};

export const RegisterPage: FC = () => {
    const { t } = useTranslator();
    const [registrationForm, setRegistrationForm] = useState(createRegistrationFormState());
    return (
        <NavBarPage title={t('pages.registerPage.title')}>
            <RegistrationForm data={registrationForm} onChangeData={(data) => setRegistrationForm(data)} />
        </NavBarPage>
    );
};
