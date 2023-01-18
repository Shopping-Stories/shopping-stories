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
} from "../../../graphql/generated/graphql";
import { LinkObject } from "react-force-graph-2d";

// interface Vertex extends NodeObject {
//     neighbors?: Neighbors;
//     info: NodeInfo;
//     canvasIcon?: HTMLImageElement;
//     listIcon?: HTMLImageElement;
//     focused: boolean
// }
// export type Node = Vertex & Required<Pick<NodeObject, 'id'>>

export interface Link extends LinkObject {
    icon?: HTMLImageElement
}

export interface CustomGraphData {
    nodes: Node[],
    links: Link[]
}
export type Neighbors = { [key: string]: Node }
export type NodeInfo = EntryResults

export type AdjacencyList = { [key:string]: Set<string> };

export type GKey = keyof NodeInfo | string;
export type NestKey = keyof NestedArray;

export type NestedArray = NoteObject | TobaccoMarkObject | MentionedItemsObject | ItemOrServiceObject
export type NestedArrays = NestedArray[]
export type ObjArray =  [
    arr: NestedArrays,//{ [Property in keyof NestedArray]: NestedArray[Property]; },
    key: keyof NestedArray
][]

type EntryResults =
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
