import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { useMemo } from "react";
import {
    // useQuery, UseQueryResult, QueryClient,
    useQueries,
    UseQueryOptions
} from "@tanstack/react-query";
import LoadingPage from '@components/LoadingPage';
import { Entry } from "new_types/api_types";
import { useCallback, useState } from "react";
// import GraphItemProvider from "@components/context/GraphItemContext";
// import { useSearch } from "@components/context/SearchContext";
// import GraphGui from "@components/GraphView/GraphGui";
const ForceGraph = dynamic(() => import('../../../client/components/GraphView/GraphGui'), {
    ssr: false,
    loading: () => <LoadingPage title={"GraphView"}/>,
});


export const getServerSideProps: GetServerSideProps = async context => {
    const {search, fuzzy, advanced} = context.query
    // console.log("Search:", arg);
    return {
        props: {
            search: search as string,
            fuzzy: fuzzy === 'true',
            advanced: advanced === 'advanced',
            title: 'GraphView'
        },
    };
};

export interface EntryQueryResult {
    entries: Entry[];
}

interface GraphGuiPageProps {
    search: string
    fuzzy: boolean,
    advanced: boolean
    title: string
}

type EntriesQueryKey = [string, string, boolean, boolean]//string[]
type EntriesQueryOptions = UseQueryOptions<EntryQueryResult, Error, EntryQueryResult, EntriesQueryKey>[]

//possibly change to server side rendered
const EntryGraphView = ({
    search,
    fuzzy,
    advanced,
    title
}:GraphGuiPageProps) => {
    // const {search, fuzzy, advanced} = useSearch()
    console.log(title)
    console.log(search, fuzzy, advanced)
    // const doSearch = async (arg:string = search): Promise<EntryQueryResult> => {
    //     const res = await fetch("https://api.shoppingstories.org:443/search/" + arg);
    //     // console.log(await res.text());
    //     // let toret: EntryQueryResult = JSON.parse(await res.text());
    //     return JSON.parse(await res.text());
    // };
    const doSearch = useCallback(async (search:string, fuzzy:boolean, advanced:boolean) => {
        const req = advanced
            ? `https://api.shoppingstories.org/itemsearch${fuzzy ? '-fuzzy' : ""}/?${search}`
            : `https://api.shoppingstories.org/${fuzzy ? "fuzzy" : ""}search/${search}`
        const res = await fetch(req);
        let toret: EntryQueryResult = JSON.parse(await res.text());
        // console.log("Search Options: ", search, "fuzzy-", fuzzy, "advanced-", advanced)
        // console.log(req)
        // console.log(toret);
        return toret;
    },[])
    // const router = useRouter();
    // const { search } = router.query;
    
    const [params, setParams] = useState<EntriesQueryOptions>([{
        queryKey: ["entries", search, fuzzy, advanced],
        queryFn: () => doSearch(search, fuzzy, advanced),
        // queryKey: ["entries", search],
        // queryFn: ({ queryKey }) => doSearch(queryKey[1]),
        refetchInterval: false,
        // retry: false,
        // retryOnMount: false,
        refetchOnWindowFocus: false
    }])
    const extendQuery = async (newSearch:string) => {
        let newParams: EntriesQueryOptions = [
            ...params,
            {
                queryKey: ["entries", newSearch, true, false],
                queryFn: ({ queryKey }) => doSearch(queryKey[1], queryKey[2], queryKey[3]),
                refetchInterval: false,
                // retry: false,
                // retryOnMount: false,
                refetchOnWindowFocus: false
            }
        
        ]
        setParams(newParams)
    }
    
    const replaceQuery = async (newSearch:string) => {
        let newParams: EntriesQueryOptions = [
            {
                queryKey: ["entries", newSearch, true, false],
                queryFn: ({ queryKey }) => doSearch(queryKey[1], queryKey[2], queryKey[3]),
                refetchInterval: false,
                // retry: false,
                // retryOnMount: false,
                refetchOnWindowFocus: false
            }
    
        ]
        setParams(newParams)
    }
    
    const queries = useQueries<EntriesQueryOptions>(
        {
            queries: params
        }
    );
    // const test: Entry[] = require('@components/GraphView/Hat.json')
    const entries = useMemo(() => {
        return queries //.filter(q =>  q.data !== undefined && q.data.entries !== undefined)
            .map(q => q.data !== undefined ? q.data.entries : []).flat()
    }, [queries])
    // console.log(entries)
    // console.log("Query Result:", error ? error : data?.entries);
    return (
        <>
            {queries.some(q => q.isFetching || q.isLoading)
                ? // console.log(queries) &&
                <LoadingPage title={title}/>
                : !queries.some(q => q.error && console.log(q.error)) &&
                <ForceGraph
                    // entries={entries.length ? entries : test}
                    entries={entries}
                    extendFetch={extendQuery}
                    newFetch={replaceQuery}
                />
            }
        </>
    );
};

export default EntryGraphView;
