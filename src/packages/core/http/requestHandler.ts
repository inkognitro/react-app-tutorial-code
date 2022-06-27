import { Request } from './request';

export type Response<Body = any, Headers extends object = any> = {
    status: number;
    headers: Headers;
    body: Body;
};

export type RequestResponse<Res extends Response = any, Req extends Request = any> = {
    request: Req;
    response?: Res;
    hasRequestBeenCancelled: boolean;
};

export type RequestExecutionConfig = {
    request: Request;
    onProgress?: (percentage: number) => void;
};

export type RequestHandler = {
    executeRequest: (config: RequestExecutionConfig) => Promise<RequestResponse>;
    cancelRequestById(requestId: string): void;
};
