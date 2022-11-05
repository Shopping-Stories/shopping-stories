import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { useEntriesQuery } from "../../../graphql/generated/graphql";
import LoadingPage from '@components/LoadingPage';

const ForceGraph = dynamic(() => import('@components/GraphView/GraphGui'), {
    ssr: false,
    loading: () => <LoadingPage />,
});

export const getServerSideProps: GetServerSideProps = async context => {
    let arg = context.query['search'];
    // console.log("Search:", arg);
    return {
        props: {
            search: arg,
            title: 'GraphView'
        },
    };
};

interface GraphGuiPageProps {
    arg: string;
}

//possibly change to server side rendered
const EntryGraphView = ({ arg }: GraphGuiPageProps) => {
    // get search params from route
    const [result] = useEntriesQuery({
        variables: {
            options: { limit: 50, skip: null },
            search: arg,
        },
        // requestPolicy: 'cache-and-network',
    });
    const { data, fetching, error } = result;
    // console.log("Query Result:", result);
    
    // TODO: "fetching" component
    return (
        <>
            {fetching && <LoadingPage />}
            {!error && <ForceGraph result={data} />}
        </>
    );
};

export default EntryGraphView;
