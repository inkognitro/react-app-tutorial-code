import axios, { AxiosRequestConfig, CancelTokenSource, Method, AxiosResponse } from 'axios';
import { Request } from './request';
import { RequestExecutionConfig, RequestHandler, RequestResponse } from './requestHandler';

function createRequestResponse(
    request: Request,
    response: undefined | AxiosResponse,
    hasRequestBeenCancelled: boolean
): RequestResponse {
    return {
        hasRequestBeenCancelled,
        request,
        response: !response
            ? undefined
            : {
                  status: response.status,
                  headers: response.headers,
                  body: response.data,
              },
    };
}

function createAxiosConfig(generalReqCfg: AxiosRequestConfig, config: RequestExecutionConfig): AxiosRequestConfig {
    const { request } = config;
    let requestConfig: AxiosRequestConfig = {
        ...generalReqCfg,
        method: request.method as Method,
        url: request.url,
    };
    if (request.headers) {
        requestConfig.headers = request.headers;
    }
    if (request.body) {
        requestConfig.data = request.body;
    }
    if (request.queryParameters) {
        requestConfig.params = request.queryParameters;
    }
    if (config.onProgress) {
        requestConfig.onUploadProgress = (progressEvent) => {
            if (!config.onProgress) {
                return;
            }
            config.onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        };
    }
    return requestConfig;
}

type RequestIdToCancelTokenSourceMapping = {
    [requestId: string]: CancelTokenSource;
};

export class AxiosRequestHandler implements RequestHandler {
    private readonly generalRequestConfig: AxiosRequestConfig;
    private readonly requestIdToCancelTokenSourceMapping: RequestIdToCancelTokenSourceMapping;

    constructor(generalRequestConfig: AxiosRequestConfig = {}) {
        this.generalRequestConfig = generalRequestConfig;
        this.requestIdToCancelTokenSourceMapping = {};
    }

    executeRequest(config: RequestExecutionConfig): Promise<RequestResponse> {
        const { request } = config;
        const cancelTokenSource = axios.CancelToken.source();
        const requestIdToCancelTokenSourceMapping = this.requestIdToCancelTokenSourceMapping;
        const axiosRequestCfg: AxiosRequestConfig = {
            ...createAxiosConfig(this.generalRequestConfig, config),
            cancelToken: cancelTokenSource.token,
        };
        requestIdToCancelTokenSourceMapping[request.id] = cancelTokenSource;
        return new Promise((resolve) => {
            axios(axiosRequestCfg)
                .then((response): void => {
                    delete requestIdToCancelTokenSourceMapping[request.id];
                    const requestResponse = createRequestResponse(request, response, false);
                    resolve(requestResponse);
                })
                .catch((error): void => {
                    delete requestIdToCancelTokenSourceMapping[request.id];
                    if (axios.isCancel(error)) {
                        const requestResponse = createRequestResponse(request, error.response, true);
                        resolve(requestResponse);
                        return;
                    }
                    if (!error.request) {
                        console.error(error);
                        throw new Error('unexpected axios error printed above');
                    }
                    const requestResponse = createRequestResponse(request, error.response, false);
                    resolve(requestResponse);
                });
        });
    }

    cancelRequestById(requestId: string) {
        const cancelTokenSource = this.requestIdToCancelTokenSourceMapping[requestId];
        if (!cancelTokenSource) {
            return;
        }
        cancelTokenSource.cancel();
        delete this.requestIdToCancelTokenSourceMapping[requestId];
    }
}
