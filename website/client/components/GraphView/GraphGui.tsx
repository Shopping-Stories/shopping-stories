import ForceGraph2D, { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import React, { useCallback, useState, useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { Entry } from "new_types/api_types";

import NodeList from '@components/GraphView/NodeList';
import {
    setNodeSVGIcon,
    getLinkKeys,
    getNodeType,
    ledgerKeys,
    getledgerKeys,
    getNodeKeys, filterEntry, EntryInfo, makeLinkSnake
} from "@components/GraphView/util";
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useColorMode } from "../../ThemeMode";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import GraphInfoPanel from "@components/GraphView/GraphInfoPanel";
import GraphFilterPanel from "@components/GraphView/GraphFilterPanel";

import {useTheme} from "@mui/material";
// import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
// import Toolbar from '@mui/material/Toolbar';
// import ListItemText from '@mui/material/ListItemText';
// import Container from "@mui/material/Container";
// import Toolbar from "@mui/material/Toolbar";

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
        // listIcon?: HTMLImageElement;
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
        // nodeDict?: NodeDict,
        // linkDict?: LinkDict
    }
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

export interface GraphGuiProps {
    // result: EntriesQuery | undefined;
    entries: Array<Entry>
}
const GraphGui = ({entries}: GraphGuiProps): JSX.Element => {
    const graphRef = useRef<ForceGraphMethods|undefined>();
    const [focusedItems, setFocusedItems] = useState(new Set<string | number>())
    const [graphPanelInfo, setGraphPanelInfo] = useState<GraphInfoPanelProps>();
    const {mode} = useColorMode()
    const {palette} = useTheme()
    const linkColors = useMemo(()=>{
        return {
            item_personAccount: palette.success.main,
            item_person: palette.success.main,
            item_store: palette.warning.main,
            person_personAccount: palette.info.main,
            mention_personAccount: palette.error.main
        }
    }, [palette])
    
    const comparator = (a:NodeObject, b:NodeObject) => {
        if (!a.nodeType) return 1
        if (!b.nodeType) return -1
        return a.nodeType < b.nodeType ? 1 : -1
    }
    
    const graphDict: GraphProps = useMemo(() => {
        // if (!entries) return {nodes:[], links:[]}
        // console.log(entries)
        let graphProps: GraphProps = {nodeProps:{}, linkProps:{}}
        let nodeProps = graphProps.nodeProps
        let linkProps = graphProps.linkProps
        let index = 0
        
        const makeNode = (t:string, nodeID:string) => {
            if (!nodeProps[nodeID]) {
                nodeProps[nodeID] = {
                    id: nodeID,
                    nodeType: t,
                    label: t !== "mention" ? entries[index][getNodeType(t)] : "",
                    entries: new Set<number>(),
                    entryKeys: getNodeKeys(t),
                    linkKeys: new Set<string>(),
                    neiKeys: new Set<string>()
                };
            }
            nodeProps[nodeID].entries.add(index)
        }
        
        const makeLink = (v1:string, v2:string) => {
            let [source, target, linkID] = makeLinkSnake(v1, v2)
            if (!linkProps || !linkProps[linkID]) {
                let t = makeLinkSnake(nodeProps[v1].nodeType, nodeProps[v2].nodeType)[2]
                linkProps[linkID] = {
                    id: linkID,
                    source: source,
                    target: target,
                    linkType: t,
                    entries: new Set<number>(),
                    entryKeys: getLinkKeys(t),
                    // label:
                }
                nodeProps[v1].linkKeys.add(linkID)
                nodeProps[v2].linkKeys.add(linkID)
            }
            linkProps[linkID].entries.add(index)
        }
        
        const addNeighbors = (node:string, neighbors:Set<string>) => {
            if (!nodeProps || node === '' || !nodeProps[node]) return
            if (!nodeProps[node].neiKeys) {
                nodeProps[node].neiKeys = new Set<string>();
            }
            
            for (let n of neighbors) {
                
                if (!nodeProps[node].neiKeys.has(n)) {
                    nodeProps[node].neiKeys.add(n);
                }
                if (!nodeProps[n].neiKeys.has(node)) {
                    nodeProps[n].neiKeys.add(node);
                }
                makeLink(node, nodeProps[n].id)
            }
        }
        
        const processEntry = (e: Entry) => {
            let toItem = new Set<string>()
            let toAccount = new Set<string>()
            let personID = e.peopleID?.match(/'([^']+)'/)
            if (!e._id) return
            if (e.store_owner) {
                makeNode("store", e.store_owner)
                toItem.add(e.store_owner)
            }
            if (e.itemID){
                makeNode("item", e.itemID)
            }
            if (e.accountHolderID) {
                makeNode("personAccount", e.accountHolderID)
                toItem.add(e.accountHolderID)
            }
            // if (e.peopleID && e.people){}
            if (e.mentions) {
                for (let mention in e.mentions) {
                    if (nodeProps[mention]){
                        makeNode("Mention", mention)
                        nodeProps[mention].label = mention
                        toAccount.add(mention)
                        toItem.add(mention)
                    }
                }
            }
            if (typeof personID === "string"){
                makeNode("person", personID)
                toAccount.add(personID)
            }
            if (e.itemID){
                addNeighbors(e.itemID, toItem)
            }
            if (e.accountHolderID){
                addNeighbors(e.accountHolderID, toAccount)
            }
            if (typeof personID === "string") {
                addNeighbors(personID, toAccount)
            }
        };
        
        for (const [i, entry] of entries.entries()) {
            index = i
            // console.log(index, entry._id)
            processEntry(entry)
        }
        return graphProps
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
    },[filter])
    
    const graph: GraphData = useMemo(() =>{
        const {nodeProps, linkProps} = graphDict
        
        let nodeDict: NodeDict = {}
        let nodes: NodeObject[] = []
        
        for (let [k, v] of Object.entries(nodeProps)){
            // let newEntries = new Set<number>()
            // for (let k of v.entries){
            //     newEntries.add(k)
            // }
            let node: NodeObject = {
                id: k,
                nodeType: v.nodeType,
                label: v.label,
                entries: new Set<number>(v.entries),
                entryKeys: [...v.entryKeys],
                neighbors: {},
                linkDict: {},
                canvasIcon: setNodeSVGIcon(v.nodeType, mode)
            }
            nodes.push(node)
            nodeDict[k] = node
        }
        
        let linkDict: LinkDict = {}
        let links: LinkObject[] = []
        
        for (let [k, l] of Object.entries(linkProps)){
            let link: LinkObject = {
                id: k,
                source: nodeDict[l.source],
                target: nodeDict[l.target],
                linkType: l.linkType,
                entries: new Set<number>(l.entries),
                entryKeys: [...l.entryKeys]
            }
            links.push(link)
            linkDict[k] = link
        }
        
        for (let node of nodes){
            for (let nei of nodeProps[node.id].neiKeys){
                node.neighbors[nei] = nodeDict[nei]
            }
            
            // console.log(nodeProps[node.id].linkKeys)
            for (let l of nodeProps[node.id].linkKeys){
                node.linkDict[l] = linkDict[l]
            }
        }
        nodes.sort(comparator)
        
        if (!filter) {
            return {  nodes: nodes, links: links }
        }
        
        const {dateRange, linkTypes, nodeTypes} = filter
    
        // subtractive filter so if nothing is false everything stays, return early
        if (linkTypes &&
            Object.values(linkTypes).every(p => p !== false) &&
            nodeTypes &&
            Object.values(nodeTypes).every(p => p !== false)
        ) {
            return { nodes: nodes, links: links  }
        }
        
        const nodePredicates = (node: NodeObject) => {
            return nodeTypes === undefined ||
                (!!nodeTypes[node.nodeType as keyof NodeTypePredicates] &&
                    nodeTypes[node.nodeType as keyof NodeTypePredicates] === true
                )
        }
        
        const linkPredicates = (link: LinkObject) => {
            if (!linkTypes) return true
            let datePred =
                (!dateRange) ||
                (Object.values(link.entries)
                        .map((ek) => entries[ek])
                        .some((e) => {
                            if (!e.date) return false
                            let date = new Date(e.date)
                            return (!dateRange.start || !dateRange.end) || (dateRange.start <= date && date <= dateRange.end)
                        })
                )
        
            let srcKey: keyof NodeDict = typeof link.source === "object" ? link.source.id : link.source
            let targKey: keyof NodeDict = typeof link.target === "object" ? link.target.id : link.target
        
        
            return datePred &&
                (!!nodeDict[srcKey] && !!nodeDict[targKey]) && // if the node isn't in the map then it was filtered out
                (!filter.linkTypes || filter.linkTypes[link.linkType as keyof LinkTypePredicates] === true)
        }
        
        nodes = nodes.filter(nodePredicates)
        nodeDict = Object.fromEntries(nodes.map((node) => [node.id, node]),);
        
        links = links.filter(linkPredicates)
        linkDict = Object.fromEntries(links.map((link) => [link.id, link]),);

        for (let n of nodes) {
            n.linkDict = Object.fromEntries(Object.entries(n.linkDict).filter(e => !!linkDict[e[0]]))
            n.neighbors = Object.fromEntries(Object.entries(n.neighbors).filter(e => !!nodeDict[e[0]]))
        }
        nodes.sort(comparator)
        
        return {nodes: nodes, links:links}
    }, [mode, graphDict, filter, entries])
    
    const toggleInfo = useCallback((node:NodeObject, link?:LinkObject)=>{
        let info:Partial<Entry>[] = []
        // let entryProps = getNodeKeys(node.nodeType)
        if (node && link===undefined) {
            for (let e of node.entries){
                info.push(filterEntry(entries[e], node.entryKeys))
            }
            setGraphPanelInfo({name:node.label, info:info, entityType:node.nodeType})
            return
        }
        if (node && link) {
            for (let e of link.entries){
                info.push(filterEntry(entries[e], link.entryKeys))
            }
            setGraphPanelInfo({name:node.label, info:info, entityType:node.nodeType})
        }
        // console.log(info)
    }, [entries])
    
    const focusOn = useCallback((elements) => {
        setFocusedItems(elements)
    }, [])
    
    const focusOff = useCallback((empty) => {
        setFocusedItems(empty)
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
        if (focusedItems.has(node.id)){
            ctx.beginPath();
            ctx.arc(node.x, node.y, 9 * 1.4, 0, 2 * Math.PI, false);
            ctx.fillStyle = palette.error.light;
            ctx.fill();
        }
        if (node.canvasIcon) {
            ctx.drawImage(node.canvasIcon, node.x - size / 2, node.y - size / 2, size, size,);
        }
        
    },[focusedItems, palette])
    
    const graphGridRef = useRef<HTMLDivElement>(null)
    const [graphWidth, setGraphWidth] = useState<number | undefined>(undefined)
    const [graphHeight, setGraphHeight] = useState<number | undefined>(undefined)
    
    useLayoutEffect(() => {
        // setGraphWidth(graphGridRef?.current?.clientWidth)
        setGraphHeight(graphGridRef?.current?.clientHeight)
        setGraphWidth(graphGridRef?.current?.getBoundingClientRect().width)
        // setGraphHeight(graphGridRef?.current?.getBoundingClientRect().height)
    },[])

    window.addEventListener('resize', () => {
        setGraphWidth(graphGridRef?.current?.getBoundingClientRect().width)
        // setGraphHeight(graphGridRef?.current?.getBoundingClientRect().height)
        // setGraphWidth(graphGridRef?.current?.clientWidth)
        setGraphHeight(graphGridRef?.current?.clientHeight)
        console.log(graphWidth, graphHeight)
    })
    console.log("render");
    return (
        <Box component={"main"} sx={{flexGrow: 1, overflow: 'auto'}} alignItems={"stretch"}>
            
            <Grid container>
                <Grid item xs={2} >
                    <Drawer
                        variant="permanent"
                        anchor="left"
                        open
                        sx={{
                            // width: 240,
                            flexShrink: 0,
                            position: 'relative',
                            [`& .MuiDrawer-paper`]: {
                                // width: 240,
                                width: `16.67%`,
                                // boxSizing: 'border-box',
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
                </Grid>
                <Grid component={'div'} item xs={7}  ref={graphGridRef}>
                    <Box position={"relative"}>
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graph}
                        width={graphWidth}
                        height={graphHeight}
                        // autoPauseRedraw={false}
                        linkColor={(l) => linkColors[l.linkType as keyof typeof linkColors]}
                        linkWidth={link => focusedItems.has(link.id) ? 2.5 : 1.4}
                        linkDirectionalParticles={4}
                        linkDirectionalParticleWidth={link => focusedItems.has(link.id) ? 4 : 0}
                        // TODO: Figure out canvas interaction with next.js
                        nodeLabel={(node) =>
                            node?.label ? node.label.toString() : node.id.toString()
                        }
                        // nodeCanvasObjectMode={()=>'after'}
                        nodeCanvasObject={(node, ctx) => paintNodes(node, ctx)}
                        onNodeClick={handleZoom}
                        // enablePointerInteraction={true}
                    />
                    <GraphFilterPanel makePredicates={makePredicates}/>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    {/*<Toolbar/>*/}
                    <GraphInfoPanel
                        // width={240}
                        name={graphPanelInfo?.name}
                        info={graphPanelInfo?.info}
                        entityType={graphPanelInfo?.entityType}
                    />
                </Grid>
            </Grid>
    </Box>
    );
};
export default GraphGui;

//Graph types that must be declared in this file
type NKey = keyof NodeObject | string | number
type focusHandler = (elements:Set<NKey>) => void ;
type nodeHandler = (node:NodeObject) => void;
type itemHandler = (node:NodeObject, link?:LinkObject) => void

export interface GraphFilterPanelProps {
    makePredicates: (nodeOrLink:string, t:string, check:boolean) => void;
    filter?: GraphPredicates
}

export interface GraphInfoPanelProps {
    // width: number;
    name: string | undefined;
    info: EntryInfo[] | undefined;
    entityType: string | undefined
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
    parent: NodeObject
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
}

type NodePicks = Pick<NodeObject, "label"| "entries"| "entryKeys"| "nodeType"| "color">
type LinkPicks = Pick<LinkObject, | "entries" | "entryKeys" | "linkType" | "label" | "color">
interface NodeProps extends NodePicks {
    id: string;
    neiKeys: Set<string>
    linkKeys: Set<string>
}
interface LinkProps extends LinkPicks {
    id: string;
    source: string;
    target: string;
}
interface GraphProps {
    nodeProps: {
        [key:string] : NodeProps
    };
    linkProps: {
        [key:string] : LinkProps
    };
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