import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
// import { useRouter } from "next/router";
// import { useEntriesQuery } from "../../../graphql/generated/graphql";
import { useQuery } from '@tanstack/react-query';
import LoadingPage from '@components/LoadingPage';
import { Entry } from "new_types/api_types";
// import GraphGui from "@components/GraphView/GraphGui";
const ForceGraph = dynamic(() => import('../../../client/components/GraphView/GraphGui'), {
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
    const res = await fetch("https://api.preprod.shoppingstories.org:443/search/" + search);
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

    const { data,
        isLoading,
        isFetching,
        error,
        // refetch
    } = useQuery({
        queryKey:['entries', search],
        queryFn: () => doSearch(search),
    });
    console.log(error)
    // console.log("Query Result:", error ? error : data?.entries);

    // TODO: "fetching" component
    return (
        <>
            {(isFetching || isLoading) && <LoadingPage title={title}/>}
            {!!data && data.entries !== undefined &&  (
                
                <ForceGraph entries={data.entries} />
            )}
        </>
    );
};

export default EntryGraphView;
