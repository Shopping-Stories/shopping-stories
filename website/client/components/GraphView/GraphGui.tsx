import ForceGraph2D, { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import { Entry } from "new_types/api_types"

import NodeList from '@components/GraphView/NodeList';
import {
    setNodeSVGIcon,
    getLinkKeys,
    getNodeType,
    ledgerKeys,
    getledgerKeys,
    getNodeKeys, filterEntry
} from "@components/GraphView/util";
import ControlBar from '@components/GraphView/ControlBar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useColorMode } from "../../ThemeMode";

// import { ControlBarProps } from "@components/GraphView/ControlBar";
// import {useTheme} from "@mui/material";
// import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
// import Toolbar from '@mui/material/Toolbar';
// import ListItemText from '@mui/material/ListItemText';

// type GeneralEdge = Omit<Entry, "peopleID" | "account_name" | "accountHolderID" | "item" | "itemID" >
// type ProviderEdge = Omit<GeneralEdge, "account_name" | "accountHolderID" | "item" | "itemID" >
// type ConsumerEdge = Omit<Entry, "account_name" | "accountHolderID" | "item" | "itemID" >
// type LinkInfo = ProviderEdge | ConsumerEdge | GeneralEdge
// type LinkInfo = Omit<Entry, "peopleID" | "account_name" | "accountHolderID" | "item" | "itemID" >
// type LinkInfo = Omit<Entry, "a" | "b">

type NodeDict = { [key: string]: NodeObject }
type LinkDict = { [key: string]: LinkObject }
declare module "react-force-graph-2d" {
    interface NodeObject {
        id: string | number;
        x?: number;
        y?: number;
        // other properties you want to access from `NodeObject` here
        label: string;
        // other properties you want to add to the object here
        neighbors: NodeDict;
        linkDict: LinkDict;
        entries: Set<number>;
        entryKeys: (keyof Entry)[]
        nodeType: string;
        canvasIcon?: HTMLImageElement;
        listIcon?: HTMLImageElement;
        color?: string
    }
    interface LinkObject {
        id: string | number;
        source: string | number | NodeObject;
        target: string | number | NodeObject;
        entries: Set<number>;
        entryKeys: (keyof Entry)[]
        linkType: string;
        label?: string;
        color?: string
        // canvasIcon?: HTMLImageElement;
    }
    interface GraphData {
        nodes: NodeObject[],
        links: LinkObject[],
        nodeDict?: NodeDict,
        linkDict?: LinkDict
    }
}

interface NodeTypePredicates {
    person?: boolean,
    personAccount?: boolean,
    item?: boolean,
    store?: boolean,
    mention?: boolean,
}
interface LinkTypePredicates {
    item_personAccount?: boolean,
    item_person?: boolean,
    item_store?: boolean,
    person_personAccount?: boolean,
    mention_personAccount?: boolean,
}
interface DateRange {
    start: Date | undefined,
    end: Date | undefined
}
export interface GraphPredicates {
    nodeTypes?: NodeTypePredicates;
    linkTypes?: LinkTypePredicates;
    dateRange?: DateRange
    search: string | undefined
}

export interface GraphGuiProps {
    // result: EntriesQuery | undefined;
    entries: Array<Entry>
}

const initFilter = {
    nodeTypes: {
        person: true,
        personAccount: true,
        item: true,
        store: true,
        mention: true,
    },
    linkTypes: {
        item_personAccount: true,
        item_person: true,
        item_store: true,
        person_personAccount: true,
        mention_personAccount: true,
    },
    dateRange: undefined,
    search: undefined
}


const GraphGui = ({entries}: GraphGuiProps): JSX.Element => {
    const graphRef = useRef<ForceGraphMethods|undefined>();
    const [nodeFocused, setNodeFocused] = useState("")
    const [graphPanelInfo, setGraphPanelInfo] = useState<GraphPanelInfo>();
    const {mode} = useColorMode()
    
    const initGraph: GraphData = useMemo(() => {
        // if (!entries) return {nodes:[], links:[]}
        // let V: NodeObject[] = [];
        // let E: LinkObject[] = [];
        let visited: NodeDict = {}
        let linkDict: LinkDict = {}
        let index = 0
        
        const makeNode = (t:string, nodeID:string, entryID:string) => {
            if (!visited[nodeID]) {
                let node = {
                    id: nodeID,
                    nodeType: t,
                    label: t !== "mention" ? entries[index][getNodeType(t)] : "",
                    canvasIcon: setNodeSVGIcon(t, "light"),
                    entries: new Set<number>(),
                    entryKeys: getNodeKeys(t),
                    linkDict: {},
                    neighbors: {}
                };
                node.canvasIcon = setNodeSVGIcon(
                    node.nodeType ? node.nodeType : 'err',
                    mode,
                );
                visited[nodeID] = node
            }
            visited[nodeID].entries.add(index)
        }
        
        const makeLink = (v1:string, v2:string, eID:string) => {
            let keyArr = [visited[v1].id, visited[v2].id].sort();
            let linkID = `${keyArr[0]}_${keyArr[1]}`
            if (!linkDict || !linkDict[linkID]) {
                let typeArr = [visited[v1].nodeType, visited[v2].nodeType].sort()
                let t = `${typeArr[0]}_${typeArr[1]}`
                linkDict[linkID] = {
                    id: linkID,
                    source: visited[keyArr[0]],
                    target: visited[keyArr[1]],
                    linkType: t,
                    entries: new Set<number>(),
                    entryKeys: getLinkKeys(t)
                }
                visited[v1].linkDict[linkID] = linkDict[linkID]
                visited[v2].linkDict[linkID] = linkDict[linkID]
            }
            linkDict[linkID].entries.add(index)
        }
        
        const addNeighbors = (node:string, neighbors:NodeObject[], eID:string) => {
            if (!visited || node === '' || !visited[node]) return
            if (!visited[node].neighbors) {
                visited[node].neighbors = {};
            }
            for (let nei of neighbors) {
                
                let A = false
                let B = false
                if (!visited[nei.id] || !visited[nei.id].neighbors){
                    // visited[nei].neighbors = {};
                    makeNode(nei.nodeType, nei.id.toString(), eID)
                }
                if (!visited[node] || !visited[node].neighbors[nei.id]) {
                    A = true
                    visited[node].neighbors[nei.id] = nei;
                }
                if (!nei.neighbors[node]) {
                    B = true
                    nei.neighbors[node] = visited[node];
                }
                if (A && B){
                    makeLink(node, nei.id.toString(), eID)
                }
            }
        }
        
        const processEntry = (e: Entry) => {
            let toItem = []
            let toAccount = []
            if (!e._id) return
            if (e.store_owner) {
                makeNode("store", e.store_owner, e._id)
                toItem.push(visited[e.store_owner])
            }
            if (e.itemID){
                makeNode("item", e.itemID, e._id)
                
            }
            if (e.accountHolderID) {
                makeNode("personAccount", e.accountHolderID, e._id)
                toItem.push(visited[e.accountHolderID])
            }
            // if (e.peopleID && e.people){}
            if (e.mentions) {
                for (let mention in e.mentions) {
                    if (visited[mention]){
                        makeNode("Mention", mention, e._id)
                        visited[mention].label = mention
                        toAccount.push(visited[mention])
                        toItem.push(visited[mention])
                    }
                }
            }
            if (e.itemID){
                addNeighbors(e.itemID, toItem, e._id)
            }
            if (e.accountHolderID){
                addNeighbors(e.accountHolderID, toAccount, e._id)
            }
            if (e.peopleID){
                // add(Ne)
            }
        };
        
        for (const [i, entry] of entries.entries()) {
            index = i
            processEntry(entry)
        }
        const comparator = (a:NodeObject, b:NodeObject) => {
            if (!a.nodeType) return -1
            if (!b.nodeType) return 1
            return a.nodeType < b.nodeType ? -1 : 1
        }
        return {
            nodes: Object.values(visited).sort((a,b) => comparator(a, b)),
            links: Object.values(linkDict),
            linkDict: linkDict,
            nodeDict: visited
        }
    }, [entries])
    
    const [filter, setFilter] = useState<GraphPredicates | undefined>(initFilter)
    
    const makePredicates = useCallback((nodeOrLink:string, t:string, check:boolean)=>{
        if (!filter) {
            setFilter(initFilter);
            return
        }
        let newFilter = { ...filter };
        if (nodeOrLink === "node" && newFilter.nodeTypes){
            newFilter.nodeTypes = {...newFilter.nodeTypes, [t as keyof NodeTypePredicates]:check}
        }
        if (nodeOrLink === "link" && newFilter.linkTypes) {
            newFilter.linkTypes = {...newFilter.linkTypes, [t as keyof LinkTypePredicates]:check}
        }
        // console.log("old filter: ", filter.nodeTypes)
        // console.log("new filter: ", newFilter.nodeTypes)
        setFilter(newFilter)
    },[])
    
    const graph = useMemo(() => {
        // null filter, change nothing
        if (!filter) {
            return ({ nodes: initGraph.nodes, links: initGraph.links });
        }
        
        const {dateRange, linkTypes, nodeTypes} = filter
        
        // subtractive filter so if nothing is false everything stays, return early
        if (linkTypes && Object.values(linkTypes).every(p => p !== false) &&
            nodeTypes && Object.values(nodeTypes).every(p => p !== false))
            return { nodes: initGraph.nodes, links: initGraph.links }
        
        const nodePredicates = (node: NodeObject) => {
            return nodeTypes === undefined ||
                (!!nodeTypes[node.nodeType as keyof NodeTypePredicates] &&
                    nodeTypes[node.nodeType as keyof NodeTypePredicates] === true
                )
        }
        
        // temporary nodemap
        let nodes: NodeObject[] = initGraph.nodes.filter(nodePredicates)
        
        let nodeMap: NodeDict = Object.fromEntries(
            nodes.map((node) => [node.id, node]),
        );
        
        const linkPredicates = (link: LinkObject) => {
            if (!linkTypes) return true
            let datePred =
                dateRange === undefined ||
                (Object.values(link.entries)
                    .map((ek) => entries[ek])
                    .some((e) => {
                        if (!e.date) return false
                        let date = new Date(e.date)
                       return dateRange.start <= date && date <= dateRange.end
                    })
                )
            
            let srcKey: keyof NodeDict = typeof link.source === "object" ? link.source.id : link.source
            let targKey: keyof NodeDict = typeof link.target === "object" ? link.target.id : link.target
    
            
            return datePred &&
                (!!nodeMap[srcKey] && !!nodeMap[targKey]) && // if the node isn't in the map then it was filtered out
                (!filter.linkTypes || filter.linkTypes[link.linkType as keyof LinkTypePredicates] === true)
        }
        let links: LinkObject[] = initGraph.links.filter(linkPredicates)
        
        let linkMap: LinkDict = Object.fromEntries(
            links.map((link) => [link.id, link]),
        );
        
        // remove unused links after filtering
        nodes.forEach(n => {
            for (let link in n.linkDict){
                if (!linkMap[link]){
                    delete n.linkDict[link]
                }
            }
        })
        
        // console.log({nodes:nodes, links:links})
        return {nodes:nodes, links:links}
        // setGraph({nodes:nodes, links:links})
    }, [filter, initGraph, entries])
    
    const toggleInfo = useCallback((node:NodeObject, link?:LinkObject)=>{
        let info:Partial<Entry>[] = []
        // let entryProps = getNodeKeys(node.nodeType)
        if (node && !link) {
            for (let e of node.entries){
                info.push(filterEntry(entries[e], node.entryKeys))
            }
            setGraphPanelInfo({name:node.label, info:info, entityType:node.nodeType})
        }
        else if (link) {
            for (let e of link.entries){
                info.push(filterEntry(entries[e], link.entryKeys))
            }
            setGraphPanelInfo({name:node.label, info:info, entityType:node.nodeType})
        }
        // console.log(info)
    }, [entries])
    
    const focusOn = useCallback((id) => {
        setNodeFocused(id)
    }, [])
    
    const focusOff = useCallback((id) => {
        setNodeFocused(id)
    }, [])
    
    const handleZoom:nodeHandler = useCallback((node )=> {
        if (graphRef.current) {
            graphRef.current.zoom(5, 200);
            graphRef.current.centerAt(node.x, node.y, 200);
        }
    },[graphRef]);
    
    const paintNodes = useCallback((node:NodeObject, ctx:CanvasRenderingContext2D)=> {
        // let node = node//nodeMap[node.id]
        if (!node || node.x === undefined || node.y === undefined) {
            return;
        }
        const size = 24;
        if (nodeFocused === node.id){
            ctx.beginPath();
            ctx.arc(node.x, node.y, 12 * 1.4, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
        }
        if (node.canvasIcon) {
            ctx.drawImage(node.canvasIcon, node.x - size / 2, node.y - size / 2, size, size,);
        }
        
    },[nodeFocused])
    
    useMemo(() =>{
        for (let v in graph.nodes){
            let node = graph.nodes[v]
            node.canvasIcon = setNodeSVGIcon(
                node.nodeType ? node.nodeType : 'err',
                mode,
            );
        }
    } , [ mode])
    
    // useEffect(() => {
    //     console.log('Graph: \n', graph);
    // }, [graph]);
    
    // console.log("render");
    return (
        <>
            <ControlBar
                // width={240}
                name={graphPanelInfo?.name}
                info={graphPanelInfo?.info}
                entityType={graphPanelInfo?.entityType}
                makePredicates={makePredicates}
            />
            <Drawer
                variant="permanent"
                anchor="left"
                open
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        // width: 240,
                        width: `15%`,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {/*<Toolbar>*/}
                {/*    <SubdirectoryArrowRightIcon />*/}
                {/*    <ListItemText primary="Nodes" secondary="Edges" />*/}
                {/*</Toolbar>*/}
                <Divider />
                {graphRef && (
                    <NodeList
                        gData={graph}
                        handleClickZoom={handleZoom}
                        focusOn={focusOn}
                        focusOff={focusOff}
                        toggleInfo={toggleInfo}
                    />
                )}
                <Divider />
            </Drawer>
            <ForceGraph2D
                ref={graphRef}
                graphData={graph}
                // nodeRelSize={24}
                // autoPauseRedraw={false}
                linkColor={() => 'gray'}
                linkWidth={0.75}
                // TODO: Figure out canvas interaction with next.js
                nodeLabel={(node) =>
                    node?.label ? node.label.toString() : node.id.toString()
                }
                // nodeCanvasObjectMode={()=>'after'}
                nodeCanvasObject={(node, ctx) => paintNodes(node, ctx)}
                onNodeClick={handleZoom}
                // enablePointerInteraction={true}
            />
        </>
    );
};

export default GraphGui;

//Graph types that must be declared in this file
type NKey = keyof NodeObject | string | number
type focusHandler = (id: NKey) => void ;
type nodeHandler = (node:NodeObject) => void;
type itemHandler = (node:NodeObject, link?:LinkObject) => void

interface GraphPanelInfo {
    name: string | undefined;
    info: Entry[] | undefined;
    entityType: string | undefined
}

export interface ControlBarProps {
    // width: number;
    name: string | undefined;
    info: Entry[] | undefined;
    entityType: string | undefined
    makePredicates: (nodeOrLink:string, t:string, check:boolean) => void;
    filter?: GraphPredicates
    // startDate: Date,
    // endDate: Date,
}

export interface NodeListProps {
    gData: GraphData
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
}
export interface NodeListItemProps {
    node: NodeObject
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
}

export interface LinkListItemProps {
    link:LinkObject;
    node: NodeObject
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
}