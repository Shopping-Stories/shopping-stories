import { Currency, Entry, Ledger } from "../../../new_types/api_types";
import { LinkObject, NodeObject } from "react-force-graph-2d";

export interface NodeTypes {
    person: EntryKey
    item: EntryKey
    personAccount: EntryKey
    store:  EntryKey
    help:  EntryKey
    mention: EntryKey
}

export interface LinkTypes {
    item_personAccount: EntryKey
    item_person: EntryKey
    item_store: EntryKey
    item_mention: EntryKey
    person_personAccount: EntryKey,
    // personAccount_personAccount: EntryKey,
    // person_person: EntryKey,
    mention_personAccount: EntryKey
}
export type NodeDict = { [key: string]: NodeObject }
export type LinkDict = { [key: string]: LinkObject }
export type NodeTypeKey = keyof NodeTypes
export type LinkTypeKey = keyof LinkTypes
export type GraphTypeKey = NodeTypeKey | LinkTypeKey

export type NodeIcons = { [key in NodeTypeKey] : string }
export type LinkTypeDict = { [key in LinkTypeKey] : "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }

export interface SvgIcons {
    light: NodeIcons
    dark: NodeIcons
}

export type EntryKey = keyof Entry;
export type LedgerKeys = Pick<Entry, "ledger"| "date"| "date_year"| "month"| "Day"| "liber_book">
export type EntryNonInfo = Pick<Entry,
    "itemID" | "amount_is_combo" | "price_is_combo" |
    "commodity_totaling_contextless" | "currency_totaling_contextless" |
    "peopleID" | "accountHolderID"
    // | "_id"
    >
export type EntryScalarInfo = Omit<Entry,
    "currency" | "ledger" | "sterling" | "mentions" | "people" |"context" |"phrases" | keyof EntryNonInfo
    >
// type FullEntryInfo = Currency | Ledger | EntryScalarInfo

export interface EntryObjects {
    ledger?: Ledger,
    currency?: Currency,
    sterling?: Currency,
}

export interface EntryInfo extends EntryScalarInfo{
    ledger?: Partial<Ledger>
    currency?: Partial<Currency>,
    sterling?: Partial<Currency>,
    people?: Entry["peopleID"],
    mentions?: Entry["mentions"],
    context?: Entry["context"],
    phrases?: Entry["phrases"],
    scalars?: EntryScalarInfo,
    text_as_parsed?: Entry['text_as_parsed'],
    original_entry?:Entry['original_entry'],
}

type NodePicks = Pick<NodeObject, "label"| "entries"| "entryKeys"| "nodeType"| "color" | "darkIcon" | "lightIcon">
type LinkPicks = Pick<LinkObject, | "entries" | "entryKeys" | "linkType" | "label" | "color">

export interface NodeProperties extends NodePicks {
    id: string;
    neiKeys: Set<string>
    linkKeys: Set<string>
}
export interface LinkProperties extends LinkPicks {
    id: string;
    source: string;
    target: string;
}

export interface GraphProperties {
    nodeProps: {
        [key:string] : NodeProperties
    };
    linkProps: {
        [key:string] : LinkProperties
    };
}

//Graph types that must be declared in this file
export type GraphKey = keyof NodeObject | LinkObject | string | number

export interface GraphKeys {
    nodes:  Set<GraphKey>
    links: Set<GraphKey>
    newEntries: Set<number>
}

export type NodeTypePredicates = {
    [key in NodeTypeKey]? : boolean
}

export type LinkTypePredicates = {
    [key in LinkTypeKey]?: boolean
}

export interface DateRange {
    start: Date | undefined,
    end: Date | undefined
}

// type Marks = Array<{ value:number, label:string }>
export interface GraphPredicates {
    nodeTypes?: NodeTypePredicates;
    linkTypes?: LinkTypePredicates;
    dateRange?: DateRange
    search: string | undefined
}

export interface InfoItems {
    name: string | undefined;
    info?: EntryInfo[]
    entityType: string | undefined
}

export type focusHandler = (elements:Set<GraphKey>) => void ;
export type nodeHandler = (node:NodeObject) => void;
export type itemHandler = (node:NodeObject, link?:LinkObject) => void
export type filterHandler = (field:string, t?:string, check?:boolean, dateRange?:DateRange) => void;