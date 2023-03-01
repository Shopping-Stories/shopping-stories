import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
// import { useRouter } from "next/router";
// import { useEntriesQuery } from "../../../graphql/generated/graphql";
import {
    // useQuery, UseQueryResult, QueryClient,
    useQueries,
    UseQueryOptions
} from "@tanstack/react-query";
import LoadingPage from '@components/LoadingPage';
import { Entry } from "new_types/api_types";
import { useState } from "react";
// import GraphGui from "@components/GraphView/GraphGui";
const ForceGraph = dynamic(() => import('../../../client/components/GraphView/GraphGui'), {
    ssr: false,
    loading: () => <LoadingPage title={"GraphView"}/>,
});


export const getServerSideProps: GetServerSideProps = async context => {
    let search = context.query.search as string
    // console.log("Search:", arg);
    return {
        props: {
            search: search,
            title: 'GraphView'
        },
    };
};

export interface EntryQueryResult {
    entries: Entry[];
}

interface GraphGuiPageProps {
    search: string
    title: string
}

export interface GraphGuiProps {
    entries: Array<Entry>,
    fetchMore:  (newSearch: string) => void
}

type EntriesQueryKey = string[]
type EntriesQueryOptions = UseQueryOptions<EntryQueryResult, Error, EntryQueryResult, EntriesQueryKey>[]

//possibly change to server side rendered
const EntryGraphView = ({search,title}:GraphGuiPageProps) => {
    
    const doSearch = async (arg:string = search): Promise<EntryQueryResult> => {
        const res = await fetch("https://api.preprod.shoppingstories.org:443/search/" + arg);
        // console.log(await res.text());
        // let toret: EntryQueryResult = JSON.parse(await res.text());
        return JSON.parse(await res.text());
    };
    // const router = useRouter();
    // const { search } = router.query;
    
    const [params, setParams] = useState<EntriesQueryOptions>(
        [{
            queryKey: ["entries", search],
            queryFn: ({ queryKey }) => doSearch(queryKey[1]),
            refetchInterval: false,
            // retry: false,
            // retryOnMount: false,
            refetchOnWindowFocus: false
        }])
    
    const queries = useQueries<EntriesQueryOptions>(
        {
            queries: params
        }
    );
    const fetchMore = async (newSearch:string) => {
        let newParams: EntriesQueryOptions = [
            ...params,
            {
                queryKey: ["entries", newSearch],
                queryFn: ({ queryKey }) => doSearch(queryKey[1]),
                refetchInterval: false,
                // retry: false,
                // retryOnMount: false,
                refetchOnWindowFocus: false
            }
            
        ]
        setParams(newParams)
    }
    // const test: Entry[] = require('@components/GraphView/Hat.json')
    let entries = queries //.filter(q =>  q.data !== undefined && q.data.entries !== undefined)
        .map(q=>q.data !== undefined ? q.data.entries : []).flat()
    // console.log(entries)
    // console.log("Query Result:", error ? error : data?.entries);
    // TODO: "fetching" component
    // TODO: figure refetch logic
    return (
        <>
            {queries.some(q => q.isFetching || q.isLoading)
                ? // console.log(queries) &&
                <LoadingPage title={title}/>
                : !queries.some(q => q.error && console.log(q.error)) &&
                <ForceGraph
                    // entries={entries.length ? entries : test}
                    entries={entries}
                    fetchMore={fetchMore}
                />
            }
        </>
    );
};

export default EntryGraphView;
