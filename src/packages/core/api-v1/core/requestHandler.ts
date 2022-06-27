import { ApiV1RequestExecutionSettings } from './types';

export type ApiV1RequestHandler = {
    executeRequest: (settings: ApiV1RequestExecutionSettings) => Promise<any>;
    cancelAllRequests: () => void;
    cancelRequestById: (requestId: string) => void;
};
