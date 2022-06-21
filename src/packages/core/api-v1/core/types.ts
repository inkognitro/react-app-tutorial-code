import { Request, RequestMethod, RequestResponse, Response } from '@packages/core/http';

export type ApiV1TranslationPlaceholders = {
    [key: string]: string;
};

export type ApiV1Translation = {
    id: string;
    placeholders?: ApiV1TranslationPlaceholders;
};

export type ApiV1Message = {
    id: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    translation: ApiV1Translation;
};

export type ApiV1FieldMessagePath = (string | number)[];

export type ApiV1FieldMessage = {
    path: ApiV1FieldMessagePath;
    message: ApiV1Message;
};

export type ApiV1EndpointId = {
    method: RequestMethod;
    path: string;
};

export type ApiV1Request<Payload = any> = {
    id: string;
    endpointId: ApiV1EndpointId;
    payload: Payload;
};

export type ApiV1RequestExecutionSettings<R extends ApiV1Request = any> = {
    request: R;
    transformer: ApiV1EndpointTransformer;
    onProgress?: (percentage: number) => void;
};

export type ApiV1ResponseBodyBase = {
    success: boolean;
    fieldMessages: ApiV1FieldMessage[];
    generalMessages: ApiV1Message[];
};

export enum ApiV1ResponseTypes {
    SUCCESS = 'success',
    ERROR = 'error',
}

export type ApiV1Response<T extends ApiV1ResponseTypes, Body extends object = {}> = { type: T } & Response<
    Body & ApiV1ResponseBodyBase
>;

export type ApiV1RequestResponse<Req extends ApiV1Request = any, Res extends ApiV1Response<any> = any> = {
    request: Req;
    response: undefined | Res;
    hasRequestBeenCancelled: boolean;
};

export type ApiV1EndpointTransformer<Req extends ApiV1Request = any, Res extends ApiV1Response<any> = any> = {
    endpointId: ApiV1EndpointId;
    createHttpRequest: (request: Req) => Request;
    createRequestResponse: (rr: RequestResponse, request: Req) => ApiV1RequestResponse<Req, Res>;
};
