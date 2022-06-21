import { createContext, useContext } from 'react';
import { ApiV1Message, ApiV1RequestResponse } from '@packages/core/api-v1/core/types';
import { Toaster } from '@packages/core/toaster';
import { Translator } from '@packages/core/i18n';
import { ApiV1RequestHandlerMiddleware } from './requestHandler';

export class ApiV1ToasterMiddleware implements ApiV1RequestHandlerMiddleware {
    private readonly toaster: Toaster;
    private readonly translator: Translator;

    constructor(toaster: Toaster, translator: Translator) {
        this.toaster = toaster;
        this.translator = translator;
    }

    onRequestResponse(rr: ApiV1RequestResponse) {
        if (rr.hasRequestBeenCancelled) {
            return;
        }
        if (!rr.response) {
            this.toaster.showMessage({
                severity: 'error',
                content: this.translator.t('core.util.connectionToServerFailed'),
            });
            return;
        }
        rr.response.body.generalMessages.map((m: ApiV1Message) =>
            this.toaster.showMessage({
                id: m.id,
                severity: m.severity,
                content: this.translator.t(m.translation.id, m.translation.placeholders),
            })
        );
    }
}

const toasterMiddlewareContext = createContext<null | ApiV1ToasterMiddleware>(null);
export const ApiV1ToasterMiddlewareProvider = toasterMiddlewareContext.Provider;

export function useNullableApiV1ToasterMiddleware(): null | ApiV1ToasterMiddleware {
    return useContext(toasterMiddlewareContext);
}
