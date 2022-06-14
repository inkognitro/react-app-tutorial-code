import { useEffect, useRef, useState } from 'react';
import {
    CollectionProvider,
    CollectionProviderState,
    CollectionQuery,
    defaultQuery,
    EntriesOperation,
    Entry,
    Sorting,
} from './collection';
import { v4 } from 'uuid';

type FieldDataType = 'stringLike' | 'boolean';

type TypeByDataKey = {
    [filterKey: string]: FieldDataType;
};

function getFilteredEntriesByStringLike<D = any>(entries: Entry<D>[], fieldKey: string, filterValue: any): Entry<D>[] {
    if (typeof filterValue !== 'string') {
        return entries;
    }
    return entries.filter((entry: Entry) => {
        // @ts-ignore
        let value = entry[fieldKey];
        if (typeof value === 'number') {
            value = value + '';
        }
        if (typeof value !== 'string') {
            return false;
        }
        return value.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
    });
}

function getFilteredEntries<D = any>(
    entries: Entry<D>[],
    query: CollectionQuery,
    typeByDataKey: TypeByDataKey
): Entry<D>[] {
    let filteredEntries = entries;
    for (let filterField in query.filters) {
        if (!query.filters.hasOwnProperty(filterField)) {
            continue;
        }
        const fieldDataType: FieldDataType = typeByDataKey[filterField] ?? 'stringLike';
        const filterValue = query.filters[filterField];
        switch (fieldDataType) {
            case 'stringLike':
                filteredEntries = getFilteredEntriesByStringLike(filteredEntries, filterField, filterValue);
                break;
            default:
                console.error(`fieldDataType "${fieldDataType}" is not supported`);
        }
    }
    return filteredEntries;
}

function getSortNumberByStringLikeComparison(value1: any, value2: any): number {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
        return 0;
    }
    if (value1 < value2) {
        return -1;
    }
    if (value1 > value2) {
        return 1;
    }
    return 0;
}

function getSortNumberByValueComparison(value1: any, value2: any, fieldDataType: FieldDataType): number {
    switch (fieldDataType) {
        case 'stringLike':
            return getSortNumberByStringLikeComparison(value1, value2);
        default:
            console.error(`fieldDataType "${fieldDataType}" is not supported`);
            return 0;
    }
}

function getSortedEntries(entries: Entry[], sorting: Sorting, typeByDataKey: TypeByDataKey) {
    const arrayToSort = [...entries];
    arrayToSort.sort((entry1, entry2) => {
        for (let index in sorting) {
            const sortingEntry = sorting[index];
            const fieldDataType: FieldDataType = typeByDataKey[sortingEntry.field] ?? 'stringLike';
            // @ts-ignore
            const value1 = entry1[sortingEntry.field];
            // @ts-ignore
            const value2 = entry2[sortingEntry.field];
            const sortNum = getSortNumberByValueComparison(value1, value2, fieldDataType);
            const directionFactor = sortingEntry.direction === 'asc' ? 1 : -1;
            if (sortNum !== 0) {
                return directionFactor * sortNum;
            }
        }
        return 0;
    });
    return arrayToSort;
}

function getPaginatedEntries(entries: Entry[], query: CollectionQuery) {
    return entries.slice(query.offset, query.offset + query.limit);
}

type EntriesToShowConfig = {
    currentEntries: Entry[];
    availableEntries: Entry[];
    query?: CollectionQuery;
    op?: EntriesOperation;
    typeByDataKey?: TypeByDataKey;
};

function createEntriesToShow(props: EntriesToShowConfig): Entry[] {
    const query = props.query ?? defaultQuery;
    let entriesToShow = props.availableEntries;
    entriesToShow = getFilteredEntries(entriesToShow, query, props.typeByDataKey ?? {});
    if (query?.sorting) {
        entriesToShow = getSortedEntries(entriesToShow, query.sorting, props.typeByDataKey ?? {});
    }
    entriesToShow = getPaginatedEntries(entriesToShow, query);
    entriesToShow =
        props.op === 'append' && props.currentEntries ? [...props.currentEntries, ...entriesToShow] : entriesToShow;
    return entriesToShow;
}

export type ArrayCollectionProviderProps<D = any> = {
    dataArray: D[];
    createEntryKey: (data: D) => string;
    typeByFilterKey?: TypeByDataKey;
};

export function useArrayCollectionProvider<D = any>(props: ArrayCollectionProviderProps<D>): CollectionProvider<D> {
    const availableEntriesRef = useRef<Entry<D>[]>(
        props.dataArray.map((data) => ({
            key: props.createEntryKey(data),
            data,
        }))
    );
    const [state, setState] = useState<CollectionProviderState>({
        key: v4(),
        isFetching: false,
        entries: [],
        hasInitialFetchBeenDone: false,
    });
    useEffect(() => {
        availableEntriesRef.current = props.dataArray.map((data) => ({
            key: props.createEntryKey(data),
            data,
        }));
        setState({
            ...state,
            entries: createEntriesToShow({
                availableEntries: availableEntriesRef.current,
                query: state.latestQueryInfo,
                currentEntries: state.entries,
                typeByDataKey: props.typeByFilterKey,
            }),
            hasInitialFetchBeenDone: true,
        });
    }, [JSON.stringify(props.dataArray), setState, availableEntriesRef]);
    function fetch(query: CollectionQuery = defaultQuery, op: EntriesOperation = 'replace') {
        return new Promise<void>((resolve) => {
            resolve();
            setState({
                ...state,
                entries: createEntriesToShow({
                    availableEntries: availableEntriesRef.current,
                    query: query,
                    currentEntries: state.entries,
                    typeByDataKey: props.typeByFilterKey,
                    op,
                }),
                hasInitialFetchBeenDone: true,
            });
        });
    }
    return { ...state, fetch };
}
