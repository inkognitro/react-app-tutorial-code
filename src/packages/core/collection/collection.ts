export type Sorting = {
    field: string;
    direction: 'asc' | 'desc';
}[];

export type Filters = {
    [field: string]: string | number | boolean;
};

export type Entry<Data = any> = {
    key: string;
    data: Data;
};

export type CollectionQuery = {
    search?: string;
    offset: number;
    limit: number;
    filters: Filters;
    sorting: Sorting;
};

export const defaultQuery: CollectionQuery = {
    offset: 0,
    limit: 10,
    filters: {},
    sorting: [],
};

export function createQuery(provider: CollectionProvider): CollectionQuery {
    const latestQueryInfo = provider.latestQueryInfo ?? {};
    return {
        ...defaultQuery,
        ...latestQueryInfo,
    };
}

export type CollectionInfo = CollectionQuery & {
    totalCount: number;
    filteredCount: number;
};

export type CollectionProviderState<D = any> = {
    key: string;
    isFetching: boolean;
    hasInitialFetchBeenDone: boolean;
    entries: Entry<D>[];
    latestQueryInfo?: CollectionInfo;
};

export type EntriesOperation = 'append' | 'replace';

export type CollectionProvider<D = any> = CollectionProviderState<D> & {
    fetch: (query?: CollectionQuery, op?: EntriesOperation) => Promise<any>;
};
