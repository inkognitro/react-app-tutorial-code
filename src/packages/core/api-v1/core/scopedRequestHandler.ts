import { createContext, useContext, useEffect, useRef } from 'react';
import { ApiV1RequestExecutionSettings, ApiV1RequestResponse } from './types';
import { ApiV1RequestHandler } from './requestHandler';

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
