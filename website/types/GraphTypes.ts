import {
    MetaObject,
    MoneyObject,
    AccHolderObject,
    TobaccoEntryObject,
    RegularEntryObject,
    ItemEntryObject,
    PersonObject,
    PlaceObject,
    NoteObject,
    TobaccoMarkObject,
    MentionedItemsObject,
    ItemOrServiceObject,
} from '../graphql/generated/graphql';

export type Vertex = { id: string };
export type Edge = { source: string; target: string };
export type Vertices = Vertex[];
export type Edges = Edge[];
export type MyGraphData = { nodes: Vertices; links: Edges };
export type AdjacencyList = { [key: string]: Set<string> };

export type NodeInfo =
    /* Field Property BreakDown: */
    //Non-nullable:
    //  noNesting:
    //    hasID:
    | MetaObject
    //    noId+hasName:
    | MoneyObject
    //  nestObj: --only if populate field is used
    | AccHolderObject
    //Nullable:
    //  NestedArray:
    //    noID+hasName:
    | TobaccoEntryObject
    | RegularEntryObject
    //  isArray:
    //    noId: "itemEntries", "people", "places"
    | ItemEntryObject
    | PersonObject
    | PlaceObject // + ledger/folio refs
    //  Nested arrays from the above
    /*
    these need to have their entry info mapped to the entry in GraphInfo.
    GraphInfo will need to be changed to accommodate object sets/array;
    eg: graphInfo for note - gInfo[note][entry] = noteFields
    */
    | NoteObject //in: tobaccoEntry
    | TobaccoMarkObject //in: tobaccoEntry, regularEntry
    | MentionedItemsObject //in: ItemEntries
    | ItemOrServiceObject //in: ItemEntries
    | string[];
export type GraphInfo = { [key: string]: NodeInfo | NodeInfo[] };
export type GKey = keyof GraphInfo & string;
