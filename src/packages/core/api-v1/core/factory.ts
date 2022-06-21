import { v4 } from 'uuid';
import { Response, createRequest, Request } from '@packages/core/http';
import { ApiV1EndpointId, ApiV1FieldMessage, ApiV1Message, ApiV1Request, ApiV1ResponseBodyBase } from './types';

type AnyResponse = Response<{
    success: boolean;
    generalMessages?: ApiV1Message[];
    fieldMessages?: ApiV1FieldMessage[];
}>;

export function createApiV1BasicResponseBody(response: Response): ApiV1ResponseBodyBase {
    const r = response as AnyResponse;
    return {
        success: r.body.success,
        fieldMessages: r.body.fieldMessages ?? [],
        generalMessages: r.body.generalMessages ?? [],
    };
}

type PathParams = { [paramName: string]: string };
type QueryParams = object;
type BodyParams = object;

function createUrl(urlWithVars: string, pathParams: PathParams): string {
    let url = urlWithVars;
    for (let paramName in pathParams) {
        const value = pathParams[paramName];
        url = url.replaceAll('{' + paramName + '}', value);
    }
    return url;
}

type HttpRequestCreationOptions = {
    pathParams?: PathParams;
    queryParams?: QueryParams;
    bodyParams?: BodyParams;
};

export function createHttpRequestFromRequest(request: ApiV1Request, options: HttpRequestCreationOptions = {}): Request {
    return createRequest({
        url:
            options && options.pathParams
                ? createUrl(request.endpointId.path, options.pathParams)
                : request.endpointId.path,
        method: request.endpointId.method,
        id: request.id,
        queryParameters: options.queryParams,
        body: options.bodyParams,
    });
}

export type RequestBase = Pick<ApiV1Request, 'id' | 'endpointId'>;
export function createRequestBase(endpointId: ApiV1EndpointId): RequestBase {
    return {
        id: v4(),
        endpointId: endpointId,
    };
}
