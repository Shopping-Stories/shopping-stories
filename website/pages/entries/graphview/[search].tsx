import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
// import { useRouter } from "next/router";
// import { useEntriesQuery } from "../../../graphql/generated/graphql";
import { useQuery } from '@tanstack/react-query';
import LoadingPage from '@components/LoadingPage';
import { Entry } from "new_types/api_types";

const ForceGraph = dynamic(() => import('@components/GraphView/GraphGui'), {
    ssr: false,
    loading: () => <LoadingPage title={"GraphView"}/>,
});

export const getServerSideProps: GetServerSideProps = async context => {
    let search = context.query.search
    // console.log("Search:", arg);
    return {
        props: {
            search: search,
            title: 'GraphView'
        },
    };
};

const doSearch = async (search:string): Promise<EntryQueryResult> => {
    const res = await fetch("http://preprod.shoppingstories.org:4562/search/" + search);
    // console.log(await res.text());
    // let toret: EntryQueryResult = JSON.parse(await res.text());
    return JSON.parse(await res.text());
};

export interface EntryQueryResult {
    entries: Entry[];
}

interface GraphGuiPageProps {
    search: string
    title: string
}

//possibly change to server side rendered
const EntryGraphView = ({search,title}:GraphGuiPageProps) => {

    // const router = useRouter();
    // const { search } = router.query;

    const { data, refetch, isLoading, isFetching, error } = useQuery({
        queryKey:['entries', search],
        queryFn: () => doSearch(search),
    
});

    // console.log("Query Result:", result);

    // TODO: "fetching" component
    return (
        <>
            {(isFetching || isLoading) && <LoadingPage title={title}/>}
            {!error && !!data && data.entries !== undefined && (
                <ForceGraph entries={data.entries} />
            )}
        </>
    );
};

export default EntryGraphView;
