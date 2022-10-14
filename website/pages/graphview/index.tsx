import GraphSideBar from '@components/GraphSideBar';
import GraphVisual from '@components/GraphView';
import Box from '@mui/material/Box';
import { useEffect, useState, Fragment } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { PaperStyles } from 'styles/styles';
import Header from '@components/Header';
import {
    ItemFields,
    PersonFields,
    PlaceFields,
    TobaccoMarkFields,
    CategoryFieldsDef,
    EntryFields,
    SearchEntryDef, FetchGlossaryItemDef
} from "client/graphqlDefs";
import { useQuery } from "urql";
import { GlossaryItemQueryResult } from "../../client/urqlConfig";
import { Entry } from "../../client/types";

// import { useMutation, usequery } from 'urql';
// import { cloneDeep } from 'lodash';

//possibly change to server side rendered
const GraphViewPage: NextPage = () => {
    
    // get search params from route
    const router = useRouter();
    const id = router.query.id;
    
    //
    interface EntryQueryResult {
        rows: (Entry & { id: string })[];
        count: number;
    }
    
    const [findGlossaryItemResult, _findGlossaryItem] =
        useQuery<EntryQueryResult>({
            query: queryDef,
            variables:  { options, search, populate: true },
            requestPolicy: 'cache-and-network',
        });
    
    return (
        // prob wrap sidebar and vis in context for shared state
        <>
            <Header />
            <GraphSideBar />
            <GraphVisual />
        </>
    );
};

export default GraphViewPage;
