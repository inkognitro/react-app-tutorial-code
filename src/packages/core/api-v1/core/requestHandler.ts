import { createContext, useContext, useEffect, useRef } from 'react';
import { Request, RequestExecutionConfig, RequestHandler as HttpRequestHandler } from '@packages/core/http';
import { ApiV1RequestExecutionSettings, ApiV1RequestResponse } from './types';

export type ApiV1RequestHandler = {
    executeRequest: (settings: ApiV1RequestExecutionSettings) => Promise<any>;
    cancelAllRequests: () => void;
    cancelRequestById: (requestId: string) => void;
};

type AccessTokenFinder = () => null | string;

export class HttpApiV1RequestHandler implements ApiV1RequestHandler {
    private readonly baseUrl: string;
    private readonly requestHandler: HttpRequestHandler;
    private readonly findAccessToken: AccessTokenFinder;
    private runningRequestIds: string[];

    constructor(requestHandler: HttpRequestHandler, findAccessToken: AccessTokenFinder, baseUrl: string) {
        this.baseUrl = baseUrl;
        this.requestHandler = requestHandler;
        this.findAccessToken = findAccessToken;
        this.runningRequestIds = [];
    }

    public executeRequest(settings: ApiV1RequestExecutionSettings): Promise<ApiV1RequestResponse> {
        const requestFromTransformer = settings.transformer.createHttpRequest(settings.request);
        let request: Request = {
            ...requestFromTransformer,
            url: this.baseUrl + requestFromTransformer.url,
            id: settings.request.id,
        };
        const accessToken = this.findAccessToken();
        if (accessToken) {
            request = {
                ...request,
                headers: {
                    ...request.headers,
                    Authorization: 'Bearer ' + accessToken,
                },
            };
        }
        const requestExecutionCnf: RequestExecutionConfig = {
            onProgress: settings.onProgress,
            request,
        };
        const that = this;
        this.runningRequestIds.push(request.id);
        return new Promise((resolve) => {
            this.requestHandler
                .executeRequest(requestExecutionCnf)
                .then((requestResponse): void => {
                    let rr = settings.transformer.createRequestResponse(requestResponse, settings.request);
                    resolve(rr);
                })
                .finally(() => {
                    that.runningRequestIds = that.runningRequestIds.filter((requestId) => request.id !== requestId);
                });
        });
    }

    public cancelAllRequests() {
        const that = this;
        this.runningRequestIds.forEach((requestId) => that.cancelRequestById(requestId));
    }

    public cancelRequestById(requestId: string) {
        this.requestHandler.cancelRequestById(requestId);
    }
}

export class ScopedApiV1RequestHandler implements ApiV1RequestHandler {
    private readonly requestHandler: ApiV1RequestHandler;
    private runningRequestIds: string[];

    constructor(requestHandler: ApiV1RequestHandler) {
        this.requestHandler = requestHandler;
        this.runningRequestIds = [];
        this.createSeparated = this.createSeparated.bind(this);
        this.executeRequest = this.executeRequest.bind(this);
        this.cancelAllRequests = this.cancelAllRequests.bind(this);
        this.cancelRequestById = this.cancelRequestById.bind(this);
    }

    public createSeparated() {
        return new ScopedApiV1RequestHandler(this.requestHandler);
    }

    public executeRequest(settings: ApiV1RequestExecutionSettings): Promise<ApiV1RequestResponse> {
        const that = this;
        return new Promise((resolve) => {
            that.runningRequestIds.push(settings.request.id);
            that.requestHandler.executeRequest(settings).then((rr): void => {
                that.runningRequestIds = that.runningRequestIds.filter(
                    (requestId) => settings.request.id !== requestId
                );
                resolve(rr);
            });
        });
    }

    public cancelAllRequests() {
        this.runningRequestIds.forEach((requestId) => this.requestHandler.cancelRequestById(requestId));
    }

    public cancelRequestById(requestId: string) {
        if (!this.runningRequestIds.includes(requestId)) {
            return;
        }
        this.requestHandler.cancelRequestById(requestId);
    }
}

const scopedApiV1RequestHandlerContext = createContext<null | ScopedApiV1RequestHandler>(null);
export const ScopedApiV1RequestHandlerProvider = scopedApiV1RequestHandlerContext.Provider;

export function useApiV1RequestHandler(): ApiV1RequestHandler {
    const requestHandler = useContext(scopedApiV1RequestHandlerContext);
    if (!requestHandler) {
        throw new Error('no ScopedApiV1RequestHandler was provided');
    }
    const requestHandlerRef = useRef<ApiV1RequestHandler | null>(null);
    if (!requestHandlerRef.current) {
        requestHandlerRef.current = requestHandler.createSeparated();
    }
    useEffect(() => {
        return () => {
            if (requestHandlerRef.current) {
                requestHandlerRef.current.cancelAllRequests();
            }
        };
    }, []);
    return requestHandlerRef.current;
}
