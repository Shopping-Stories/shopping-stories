import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { EntriesQuery, useEntriesQuery } from "../../../graphql/generated/graphql";
import LoadingPage from '@components/LoadingPage';
import { useEffect, useState } from "react";
import { AdjacencyList, Edges, GKey, GraphInfo, MyGraphData, NodeInfo, Vertices } from "../../../types/GraphTypes";
// import { Suspense} from 'react';
// import { NextPage } from 'next';
// import { useRouter } from 'next/router';

const ForceGraph = dynamic(() => import('@components/GraphView/GraphGui'), {
    ssr: false,
    loading: () => <LoadingPage />,
});

export const getServerSideProps: GetServerSideProps = async context => {
    let arg = context.query['search'];
    console.log(arg);
    return {
        props: { arg },
    };
};

interface GraphGuiPageProps {
    arg: string;
}
type QueryResult = EntriesQuery | undefined;

//possibly change to server side rendered
const EntryGraphView = ({ arg }: GraphGuiPageProps) => {
    // get search params from route
    // const router = useRouter();
    // let arg = router.query["arg"]
    // if (!arg) arg = ""
    // const init: GKey = "key"
    const [result] = useEntriesQuery({
        variables: {
            options: { limit: 50, skip: null },
            search: arg,
        },
        // requestPolicy: 'cache-and-network',
    });
    const { data, fetching, error } = result;
    console.log(result);
    const [graph, setGraph] = useState<MyGraphData>({
        nodes: [],
        links: [],
    });
    // This will hold all the extraneous node info for other gui components
    const [graphInfo, setGraphInfo] = useState<GraphInfo>({ init: [""] });
    
    const buildGraph = (res: QueryResult): [MyGraphData, GraphInfo] => {
        let V: Vertices = [];
        let E: Edges = [];
        let adjList: AdjacencyList = {};
        let gInfo: GraphInfo = {};
        
        const updateGInfo = (item: NodeInfo, idemID: GKey) => {
            if (!gInfo[idemID]) gInfo[idemID] = item;
        };
        
        //First Build the adjacency list:
        res?.rows?.forEach((row) => {
            const {
                meta,
                money,
                accountHolder,
                tobaccoEntry,
                regularEntry,
                itemEntries,
                people,
                places,
                ledgerRefs,
                folioRefs,
            } = row;
            const acc: GKey = `${accountHolder.accountFirstName} ${accountHolder.accountLastName}`;
            gInfo[acc] = accountHolder;
            adjList[acc] = new Set<string>();
            
            const parentEntry = meta.entryID;
            adjList[parentEntry] = new Set<string>();
            
            // Non-nullable
            let nonNull = [
                parentEntry,
                // meta.ledger,
                meta.store,
                money.commodity,
            ];
            nonNull.forEach((id: GKey) => adjList[acc].add(id));
            
            // TODO: not sure if id is unique with these. There are also 4 possible id values:
            //  tm.markID, tm.markName, tm.populate.id, tm.populate.tobaccoMarkId
            // TODO: this would need to map to all entries where it appears to get their info
            // nullable fields
            // --nestedArrays
            if (tobaccoEntry) {
                const { marks, notes } = tobaccoEntry;
                const tEntry = tobaccoEntry.entry;
                adjList[tEntry] = new Set<string>();
                adjList[parentEntry].add(tEntry);
                updateGInfo(tobaccoEntry, tEntry);
                
                marks?.forEach((mark) => {
                    adjList[parentEntry].add(mark.markID);
                    updateGInfo(mark, mark.markID);
                });
                notes?.forEach((note) => {
                    const nk = note.noteNum.toString();
                    adjList[parentEntry].add(nk);
                    updateGInfo(note, nk);
                });
            }
            if (regularEntry) {
                const rEntry = regularEntry.entry;
                adjList[rEntry] = new Set<string>();
                adjList[parentEntry].add(parentEntry);
                updateGInfo(regularEntry, rEntry);
                
                const { tobaccoMarks, itemsMentioned } = regularEntry;
                tobaccoMarks?.forEach((mark) => {
                    adjList[rEntry].add(mark.markID);
                    updateGInfo(mark, mark.markID);
                });
                itemsMentioned?.forEach((item) => {
                    adjList[parentEntry].add(item.item);
                    updateGInfo(item, item.item);
                });
            }
            // --isArray
            itemEntries?.forEach((itemEntry) => {
                const { itemsMentioned, itemsOrServices } = itemEntry;
                if (!(itemsOrServices === []) || null) {
                    itemsOrServices.forEach((item) => {
                        if (item) {
                            adjList[item.item] = new Set<string>();
                            adjList[item.item].add(parentEntry);
                        }
                    });
                }
                itemsMentioned
                    ?.filter((item) => !!item)
                    .forEach((item) => {
                        adjList[item.item] = new Set<string>();
                        adjList[item.item].add(parentEntry);
                    });
            });
            // --isArray, no nesting
            people?.forEach((person) => adjList[parentEntry].add(person.name));
            places?.forEach((place) => adjList[parentEntry].add(place.name));
            ledgerRefs?.forEach((l) => adjList[parentEntry].add(l));
            folioRefs?.forEach((f) => adjList[parentEntry].add(f));
        });
        
        let notVis: Set<string> = new Set<string>();
        for (let node in adjList) {
            // TODO: Remove empty string checks after DB entries are corrected
            if (node !== '') {
                V.push({ id: node });
                adjList[node].forEach((edge) => {
                    if (edge !== '') {
                        if (!adjList[edge]) {
                            notVis.add(edge);
                            adjList[edge] = new Set<string>();
                        }
                        E.push({ source: node, target: edge });
                    }
                });
            }
        }
        console.log('Adjacency List: \n', adjList);
        notVis.forEach((v) => V.push({ id: v }));
        // console.log(visited)
        // V.filter(v => !adjList[v.id]).forEach(iso => console.log(iso))
        const newGraph = { nodes: V, links: E };
        return [newGraph, gInfo];
    };
    
    useEffect(() => {
        console.log('Entry Query Result: \n', data);
        const [gData, gInfo] = buildGraph(data);
        setGraph(gData);
        setGraphInfo(gInfo);
    }, [data]);
    console.log('Graph: \n', graph);
    console.log('Graph Info: \n', graphInfo);
    
    // TODO: "fetching" component
    return (
        // prob wrap sidebar and vis in context for shared state
        <>
            {fetching && <LoadingPage />}
            {!error && <ForceGraph gData={graph} gInfo={graphInfo} />}
            {/*<GraphSideBar />*/}
            {/*<GraphVisual />*/}
        </>
    );
};

export default EntryGraphView;
