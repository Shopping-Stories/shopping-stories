import ForceGraph2D, { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { useCallback, useState, useRef, useMemo } from "react";
import { Entry } from "new_types/api_types"

import NodeList from '@components/GraphView/NodeList';
import { setNodeSVGIcon, getLinkInfo, getNodeInfo } from '@components/GraphView/util';
import ControlBar from '@components/GraphView/ControlBar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useColorMode } from "../../ThemeMode";
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
        linkKeys: Set<string>;
        entryKeys: Set<number>;
        nodeType: string;
        canvasIcon?: HTMLImageElement;
        listIcon?: HTMLImageElement;
        color?: string
    }
    interface LinkObject {
        id: string | number;
        source: string | number | NodeObject;
        target: string | number | NodeObject;
        entryKeys: Set<number>;
        infoKeys: string[]
        linkType: string;
        label?: string;
        color?: string
        // canvasIcon?: HTMLImageElement;
    }
    interface GraphData {
        nodes: NodeObject[],
        links: LinkObject[],
        nodeDict: NodeDict,
        linkDict: LinkDict
    }
}
export interface GraphGuiProps {
    // result: EntriesQuery | undefined;
    result: Entry[]
}
// import { EntryQueryResult } from "../../../pages/entries/graphview/[search]";
interface GraphGui {
    entries: Entry[]
}

const GraphGui = ({entries}: GraphGui): JSX.Element => {
    const graphRef = useRef<ForceGraphMethods|undefined>();
    const [nodeFocused, setNodeFocused] = useState("")
    
    const [graphPanelInfo, setGraphPanelInfo] = useState<{ info: NodeInfo, name:string }>();
    
    const handleZoom = useCallback(node => {
        if (graphRef.current) {
            graphRef.current.zoom(5, 200);
            graphRef.current.centerAt(node.x, node.y, 200);
        }
        setGraphPanelInfo({ info:node.info, name:node.id.toString() })
    },[graphRef]);
    
    const {mode} = useColorMode()
    
    const graph: GraphData = useMemo(() => {
        // if (!entries) return {nodes:[], links:[]}
        // let V: NodeObject[] = [];
        // let E: LinkObject[] = [];
        let visited: NodeDict = {}
        let linkDict: LinkDict = {}
        let index = 0
        
        const makeNode = (t:string, nodeID:string, entryID:string) => {
            if (!visited[nodeID]) {
                let newNode: NodeObject = {
                    id: nodeID,
                    nodeType: t,
                    label: t !== "mention" ? entries[index][getNodeInfo(t)] : "",
                    canvasIcon: setNodeSVGIcon(t, "light"),
                    entryKeys: new Set<number>(),
                    linkKeys: new Set<string>(),
                    neighbors: {}
                };
                visited[nodeID] = newNode
            }
            visited[nodeID].entryKeys.add(index)
        }
        
        const makeLink = (v1:string, v2:string, eID:string) => {
            let keyArr = [visited[v1].id, visited[v2].id].sort();
            let linkID = `${keyArr[0]}${keyArr[1]}`
            visited[v1].linkKeys.add(linkID)
            visited[v2].linkKeys.add(linkID)
            if (!linkDict || !linkDict[linkID]) {
                let typeArr = [visited[v1].nodeType, visited[v2].nodeType].sort()
                let t = `${typeArr[0]}-${typeArr[1]}`
                let newLink: LinkObject = {
                    id: linkID,
                    source: visited[keyArr[0]],
                    target: visited[keyArr[1]],
                    linkType: t,
                    entryKeys: new Set<number>(),
                    infoKeys: getLinkInfo(t)
                }
                linkDict[linkID] = newLink
            }
            linkDict[linkID].entryKeys.add(index)
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
                makeNode("Store", e.store_owner, e._id)
                toItem.push(visited[e.store_owner])
            }
            if (e.itemID){
                makeNode("Item", e.itemID, e._id)
                
            }
            if (e.accountHolderID) {
                makeNode("PersonAccount", e.accountHolderID, e._id)
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
    
    const toggleInfo = useCallback((node:NodeObject)=>{
        setGraphPanelInfo({
            info: Object.values(node.entryKeys).map(k => entries[k]),
            name: node.label
        })
    }, [])
    
    const focusOn = useCallback((id) => {
        setNodeFocused(id)
    }, [])
    
    const focusOff = useCallback((id) => {
        setNodeFocused(id)
    }, [])
    
    useMemo(() =>{
        for (let v in graph.nodes){
            let node = graph.nodes[v]
            node.canvasIcon = setNodeSVGIcon(
                node.nodeType ? node.nodeType : 'err',
                mode,
            );
        }
    } , [graph, mode])
    
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
    
    // useEffect(() => {
    //     console.log('Graph: \n', graph);
    // }, [graph]);
    
    // console.log("render");
    return (
        <>
            <ControlBar
                // width={240}
                {...graphPanelInfo}
            />
            <Drawer
                variant="permanent"
                anchor="left"
                open
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {/*<Toolbar>*/}
                {/*    <SubdirectoryArrowRightIcon />*/}
                {/*    <ListItemText primary="Nodes" secondary="Edges" />*/}
                {/*</Toolbar>*/}
                <Divider />
                {
                    graphRef &&
                    <NodeList
                      gData={graph}
                      handleClickZoom={handleZoom}
                      focusOn={focusOn}
                      focusOff={focusOff}
                      toggleInfo={toggleInfo}
                    />
                }
                <Divider />
            </Drawer>
            <ForceGraph2D
                ref={graphRef}
                graphData={graph}
                // autoPauseRedraw={false}
                linkColor={()=>'gray'}
                linkWidth={.75}
                // TODO: Figure out canvas interaction with next.js
                nodeLabel={(node) => (node?.label ? node.label.toString() : node.id.toString())}
                // nodeCanvasObjectMode={()=>'after'}
                nodeCanvasObject={
                    (node, ctx) =>
                        paintNodes(node, ctx)
                }
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
type nodeHandler = (node: NodeObject) => void;

export interface NodeListProps {
    gData: GraphData
    handleClickZoom: nodeHandler
    toggleInfo: nodeHandler
    focusOn: focusHandler
    focusOff: focusHandler
}
export interface NodeListItemProps {
    node: NodeObject
    handleClickZoom: nodeHandler
    toggleInfo: nodeHandler
    focusOn: focusHandler
    focusOff: focusHandler
}

export interface EdgeListItemProps {
    edge:NodeObject;
    handleClickZoom: nodeHandler
    toggleInfo: nodeHandler
    focusOn: focusHandler
    focusOff: focusHandler
}