import { v4 } from 'uuid';

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type Request<Body = any, Qry = any, Headers = any> = {
    id: string;
    url: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    headers: Headers;
    queryParameters: Qry;
    body: Body;
};

type CreationSettings = Pick<Request, 'url' | 'method'> & Partial<Omit<Request, 'url' | 'method'>>;
export function createRequest(settings: CreationSettings): Request {
    return {
        id: v4(),
        body: {},
        headers: {},
        queryParameters: undefined,
        ...settings,
    };
}
