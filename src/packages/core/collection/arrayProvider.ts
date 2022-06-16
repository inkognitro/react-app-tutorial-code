import { useEffect, useRef, useState } from 'react';
import {
    CollectionProvider,
    CollectionProviderState,
    CollectionQuery,
    defaultQuery,
    EntriesOperation,
    Entry,
} from './collection';
import { v4 } from 'uuid';

function getPaginatedEntries(entries: Entry[], query: CollectionQuery) {
    return entries.slice(query.offset, query.offset + query.limit);
}

type EntriesToShowConfig = {
    currentEntries: Entry[];
    availableEntries: Entry[];
    query?: CollectionQuery;
    op?: EntriesOperation;
};

function createEntriesToShow(props: EntriesToShowConfig): Entry[] {
    const query = props.query ?? defaultQuery;
    let entriesToShow = props.availableEntries;
    // todo: support filtering (not part of the tutorial yet)
    // todo: support sorting (not part of the tutorial yet)
    entriesToShow = getPaginatedEntries(entriesToShow, query);
    entriesToShow =
        props.op === 'append' && props.currentEntries ? [...props.currentEntries, ...entriesToShow] : entriesToShow;
    return entriesToShow;
}

export type ArrayCollectionProviderProps<D = any> = {
    dataArray: D[];
    createEntryKey: (data: D) => string;
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
                    op,
                }),
                hasInitialFetchBeenDone: true,
            });
        });
    }
    return { ...state, fetch };
}
