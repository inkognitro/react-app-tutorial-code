import { Request, RequestExecutionConfig, RequestHandler as HttpRequestHandler } from '@packages/core/http';
import { ApiV1RequestExecutionSettings, ApiV1RequestResponse } from './types';
import { ApiV1RequestHandler } from './requestHandler';

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
