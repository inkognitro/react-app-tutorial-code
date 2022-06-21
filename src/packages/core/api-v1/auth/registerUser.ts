import {
    ApiV1RequestHandler,
    ApiV1RequestResponse,
    ApiV1Response,
    createApiV1BasicResponseBody,
    createHttpRequestFromRequest,
    createRequestBase,
    ApiV1EndpointTransformer,
    ApiV1EndpointId,
    ApiV1Request,
    ApiV1ResponseTypes,
} from '../core';
import { RequestResponse, Response as HttpResponse } from '../../http';

const endpointId: ApiV1EndpointId = { method: 'post', path: '/auth/register' };

type AuthUser = {
    apiKey: string;
    user: {
        id: string;
        username: string;
    };
};

type RegisterUserResponse =
    | ApiV1Response<ApiV1ResponseTypes.SUCCESS, { data: AuthUser }>
    | ApiV1Response<ApiV1ResponseTypes.ERROR>;

type RegisterUserPayload = {
    gender: 'f' | 'm' | 'o';
    email: string;
    username: string;
    password: string;
};

type RegisterUserRequest = ApiV1Request<RegisterUserPayload>;

function createRegisterUserRequest(payload: RegisterUserPayload): RegisterUserRequest {
    return {
        ...createRequestBase(endpointId),
        payload,
    };
}

const registerUserTransformer: ApiV1EndpointTransformer<RegisterUserRequest, RegisterUserResponse> = {
    endpointId: endpointId,
    createHttpRequest: (request) => {
        return {
            ...createHttpRequestFromRequest(request),
            body: request.payload,
        };
    },
    createRequestResponse: (rr: RequestResponse, request) => {
        if (!rr.response) {
            return {
                request,
                hasRequestBeenCancelled: rr.hasRequestBeenCancelled,
                response: undefined,
            };
        }
        if (rr.response.status === 201) {
            const realSuccessResponse = rr.response as HttpResponse<{ data: AuthUser }>;
            return {
                request,
                hasRequestBeenCancelled: rr.hasRequestBeenCancelled,
                response: {
                    ...realSuccessResponse,
                    type: 'success',
                    body: {
                        ...createApiV1BasicResponseBody(realSuccessResponse),
                        ...rr.response.body,
                    },
                },
            };
        }
        const realErrorResponse = rr.response;
        return {
            request,
            hasRequestBeenCancelled: rr.hasRequestBeenCancelled,
            response: {
                ...realErrorResponse,
                type: 'error',
                body: createApiV1BasicResponseBody(realErrorResponse),
            },
        };
    },
};

export type RegisterUserRequestResponse = ApiV1RequestResponse<RegisterUserRequest, RegisterUserResponse>;

export function registerUser(
    requestHandler: ApiV1RequestHandler,
    payload: RegisterUserPayload
): Promise<RegisterUserRequestResponse> {
    return requestHandler.executeRequest({
        request: createRegisterUserRequest(payload),
        transformer: registerUserTransformer,
    }) as Promise<RegisterUserRequestResponse>;
}
