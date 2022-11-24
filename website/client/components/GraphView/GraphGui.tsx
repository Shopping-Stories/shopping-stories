import ForceGraph2D, { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { useCallback, useState, useRef, useMemo } from "react";
import {
    Link,
    NodeInfo,
    AdjacencyList, GKey,
    GraphGuiProps,
    // NestedArrays, NestKey,
} from "./GraphTypes";
import NodeList from '@components/GraphView/NodeList';
import { getSVGIcon } from '@components/GraphView/util';
import ControlBar from '@components/GraphView/ControlBar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useColorMode } from "../../ThemeMode";
// import {useTheme} from "@mui/material";
// import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
// import Toolbar from '@mui/material/Toolbar';
// import ListItemText from '@mui/material/ListItemText';

// module override to get custom Node/Link properties
type Neighbors = { [key: string]: NodeObject }
declare module "react-force-graph-2d" {
    interface NodeObject {
        id: string | number;
        x?: number;
        y?: number;
        // other properties you want to access from `NodeObject` here
        label?: string | null;
        // other properties you want to add to the object here
        neighbors?: Neighbors;
        info: NodeInfo;
        canvasIcon?: HTMLImageElement;
        listIcon?: HTMLImageElement;
    }
    interface GraphData {
        nodes: NodeObject[],
        links: LinkObject[]
    }
    
    interface LinkObject {
        source?: string | number | NodeObject;
        target?: string | number | NodeObject;
        linkInfo?: unknown
    }
}

const GraphGui = ({ result }: GraphGuiProps): JSX.Element => {
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

    // const [nodeMap, graph] = useMemo(() => {
    const graph = useMemo(() => {
        // console.log('Entry Query Result: \n', result);
        // console.log(mode)
        // console.log("graph building...")
        let V: NodeObject[] = []//Node[] = [];
        let E: Link[] = [];
        let adjList: AdjacencyList = {};
        let nodeDict: { [key: string]: NodeObject } = {};
        // let linkDict: {[key:string]: Link} = {};

        // const processNestedArray = (parent: string, arr: NestedArrays, key: NestKey,
        // ) => {
        //     if (arr.length) {
        //         arr?.filter((item) => !!item).forEach((item) => {
        //             // updateGInfo(item, item[key]);
        //             // updateAL(parent, item[key]);
        //         });
        //     }
        // };

        const updateGInfo = (item: NodeInfo, itemID: GKey) => {
            if (!nodeDict[itemID]) {
                let tName = `${
                    item && item.__typename ? item.__typename : 'Error'
                }`;
                // console.log("item for icon: ", item)
                nodeDict[itemID] = {
                    id: itemID,
                    // label: itemID,
                    info: item,
                    canvasIcon: getSVGIcon(tName, 'light')
                };
            }
        };

        const updateAL = (vertex: string, edge: string) => {
            if (!adjList[vertex]) adjList[vertex] = new Set<string>();

            if (!adjList[vertex].has(edge)) adjList[vertex].add(edge);

            if (!adjList[edge]) adjList[edge] = new Set<string>();

            if (!adjList[edge].has(vertex)) adjList[edge].add(vertex);
        };

        //Builds the graph prop and node map
        if (result && result.rows) {
            for (let row of result.rows) {
                const {
                    meta,
                    // money,
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
                const parentEntry = `${meta.ledger}-${meta.folioPage}-${meta.entryID}`;
                // adjList[acc] = new Set<string>([]);
                updateGInfo(accountHolder, acc);
                updateGInfo(meta, parentEntry);
                updateAL(acc, parentEntry);
                updateAL(parentEntry, acc);

                // TODO: not sure if id is unique with these. There are also 4 possible id values:
                //  tm.markID, tm.markName, tm.populate.id, tm.populate.tobaccoMarkId
                // TODO: this would need to map to all entries where it appears to get their info
                // nullable fields
                // --nestedArrays
                if (tobaccoEntry) {
                    const {
                        marks,
                        notes,
                        // tobaccoShaved,
                        // money
                    } = tobaccoEntry;
                    marks?.forEach((mark) => {
                        const mName = `Mark-${mark.markName}`;
                        updateGInfo(mark, mName);
                        updateAL(parentEntry, mName);
                    });
                    notes?.forEach((note) => {
                        const nk = `Note-${note.noteNum}`;
                        updateGInfo(note, nk);
                        updateAL(parentEntry, nk);
                    });
                }
                if (regularEntry) {
                    const { tobaccoMarks, itemsMentioned } = regularEntry;
                    tobaccoMarks?.forEach((mark) => {
                        const mName = `Mark-${mark.markName}`;
                        updateGInfo(mark, mName);
                        updateAL(parentEntry, mName);
                    });
                    itemsMentioned?.forEach((item) => {
                        updateGInfo(item, item.item);
                        updateAL(parentEntry, item.item);
                    });
                }
                // --isArray
                itemEntries?.forEach((itemEntry) => {
                    const {
                        itemsMentioned,
                        itemsOrServices,
                        // perOrder,
                        // percentage,
                    } = itemEntry;
                    if (itemsOrServices.length) {
                        itemsOrServices.forEach((item) => {
                            if (item) {
                                updateGInfo(item, item.item);
                                updateAL(parentEntry, item.item);
                            }
                        });
                    }
                    if (itemsMentioned.length) {
                        itemsMentioned
                            .filter((item) => !!item)
                            .forEach((item) => {
                                updateGInfo(item, item.item);
                                updateAL(parentEntry, item.item);
                            });
                    }
                });
                // --isArray, no nesting
                people?.forEach((person) => {
                    updateGInfo(person, person.name);
                    updateAL(parentEntry, person.name);
                });
                places?.forEach((place) => {
                    updateAL(parentEntry, place.name);
                    updateGInfo(place, place.name);
                });
                ledgerRefs?.forEach((l) => updateAL(parentEntry, l));
                folioRefs?.forEach((f) => updateAL(parentEntry, f));
            }
        }

        // let notVis: Set<string> = new Set<string>([]);
        for (let node in adjList) {
            // TODO: Remove empty string checks after DB entries are corrected
            if (node !== '' && nodeDict[node]) {
                V.push(nodeDict[node]);
                let nei: Neighbors = {};
                adjList[node]?.forEach((edge) => {
                    if (edge !== '' && nodeDict[edge]) {
                        nei[edge] = nodeDict[edge];
                        E.push({ source: node, target: edge });
                    }
                });
                nodeDict[node].neighbors = nei;
            }
        }
        // console.log('Adjacency List: \n', adjList);
        // notVis.forEach((v) => V.push({ id: v }));
        V.sort(function(a, b){
            if (!a.info.__typename) return -1
            if (!b.info.__typename) return 1
            return a.info.__typename < b.info.__typename ? -1 : 1
        })
        // E.sort()
        let G: GraphData = { nodes: V, links: E }
        // setGraph({ nodes: V, links: E });
        // setNodeMap(nodeDict);
        // return [nodeDict, G]
        return G
    }, [result]);
    
    const toggleInfo = useCallback((node:NodeObject)=>{
        setGraphPanelInfo({
            info: node.info,
            name: node.id.toString()
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
            node.canvasIcon = getSVGIcon(
                node.info.__typename ? node.info.__typename : 'err',
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
        
    },[nodeFocused, mode])
    
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
                nodeLabel={(node) => (node?.id ? node.id.toString() : '')}
                nodeCanvasObject={
                    (node, ctx) =>
                        paintNodes(node, ctx)
                }
                onNodeClick={handleZoom}
            />
        </>
    );
};

export default GraphGui;

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