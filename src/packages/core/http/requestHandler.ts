import { createContext, useContext } from 'react';
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

const context = createContext<null | RequestHandler>(null);
export const RequestHandlerProvider = context.Provider;

export function useRequestHandler(): RequestHandler {
    const requestHandler = useContext(context);
    if (!requestHandler) {
        throw new Error('no RequestHandler was provided');
    }
    return requestHandler;
}
