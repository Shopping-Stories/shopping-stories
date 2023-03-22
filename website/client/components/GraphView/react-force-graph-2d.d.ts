import { LinkObject, NodeObject } from "react-force-graph-2d";
import { Entry } from "../../../new_types/api_types";
import { LinkTypeKey, NodeTypeKey, NodeDict, LinkDict, } from "@components/GraphView/GraphTypes";

declare module "react-force-graph-2d" {
    interface NodeObject {
        id: string | number;
        x?: number;
        y?: number;
        fx?: number;
        fy?: number;
        label: string;
        neighbors: NodeDict;
        value: number
        linkDict: LinkDict;
        entries: Set<number>;
        entryKeys: (keyof Entry)[]
        nodeType: NodeTypeKey;
        lightIcon?: HTMLImageElement;
        darkIcon?: HTMLImageElement;
        color?: string
    }
    interface LinkObject {
        id: string | number;
        source: string | number | NodeObject;
        target: string | number | NodeObject;
        entries: Set<number>;
        entryKeys: (keyof Entry)[]
        linkType: LinkTypeKey;
        label?: string;
        color?: string
    }
    interface GraphData {
        nodes: NodeObject[],
        links: LinkObject[],
        nodeDict?: NodeDict,
        linkDict?: LinkDict
    }
}