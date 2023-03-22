import ForceGraph2D, { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import * as d3 from "d3-force"
import React, { useCallback, useState, useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { useRouter } from "next/router";
import { useEntryDispatch } from "@components/context/EntryContext";
import {useGraphItemDispatch, useGraphItem} from "@components/context/GraphItemContext";
import { Entry } from "new_types/api_types";
import NodeList from '@components/GraphView/NodeList';
import {
    initFilter,
    setNodeSVGIcon,
    getInfoKeys,
    getNodeType,
    getNodeKeys,
    makeLinkType,
    makeEntryInfo,
    makeLinkID,
    formatLabel,
    mdy, comparator
} from "@components/GraphView/GraphUtils";
import {
    NodeDict, LinkDict,
    GraphKey, GraphKeys, GraphTypeKey, NodeTypeKey,
    GraphProperties, NodeProperties, LinkProperties,
    GraphPredicates,
    EntryInfo, InfoItems,
    filterHandler, nodeHandler,
} from "@components/GraphView/GraphTypes";
import GraphInfoPanel from "@components/GraphView/GraphInfoPanel";
import GraphControlPanel from "@components/GraphView/GraphControlPanel";
import { GraphGuiProps } from "../../../pages/entries/graphview/[search]";
import { useColorMode } from "../../ThemeMode";
import {useTheme} from "@mui/material";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem";
import Toolbar from '@mui/material/Toolbar';

// import Drawer from '@mui/material/Drawer';
// import Divider from '@mui/material/Divider';
// import ClickAwayListener from '@mui/material/ClickAwayListener';
// import Grow from '@mui/material/Grow';
// import Paper from '@mui/material/Paper';
// import Popper from '@mui/material/Popper';
// import MenuItem from '@mui/material/MenuItem';
// import MenuList from '@mui/material/MenuList';
// import Stack from '@mui/material/Stack';
// import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
// import ListItemText from '@mui/material/ListItemText';
// import Container from "@mui/material/Container";

const GraphGui = ({entries, fetchMore}: GraphGuiProps): JSX.Element => {
    const graphRef = useRef<ForceGraphMethods|undefined>();
    const [filter, setFilter] = useState<GraphPredicates | undefined>(initFilter)
    const [nodeLabelsVisible, setNodeLabelsVisible] =  useState<boolean>(false)
    // const [edgeLabelsVisible, setEdgeLabelsVIsible] = useState<boolean>(false)
    const [focusedItems, setFocusedItems] = useState<Set<string | number>>(new Set())
    const [scrolledItem, setScrolledItem] = useState<string | number>('')
    const [graphPanelInfo, setGraphPanelInfo] = useState<InfoItems>();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
        id: string | number | undefined
    } | null>(null);
    // const [rightClicked, setRightClicked] = useState<string | number | undefined>()
    
    const graphGridRef = useRef<HTMLDivElement>(null)
    const [graphWidth, setGraphWidth] = useState<number | undefined>(undefined)
    const [graphHeight, setGraphHeight] = useState<number | undefined>(undefined)
    const relSize = 4
    // const offsetRef = useRef<HTMLDivElement>(null)
    // const [expandedNodes, setExpandedNodes] = useState()
    
    const {mode} = useColorMode()
    const {palette} = useTheme()
    const linkColors = useMemo(()=>{
        return {
            item_personAccount: palette.success.main,
            item_person: palette.success.main,
            item_store: palette.warning.main,
            person_personAccount: palette.info.main,
            mention_personAccount: palette.error.main,
            item_mention: palette.secondary.main
        }
    }, [palette])
    
    const entryDispatch = useEntryDispatch()
    const router = useRouter()
    
    const graphItem = useGraphItem()
    const graphItemDispatch = useGraphItemDispatch()
    
    // Sets the overall structure and properties for actual graph later on
    // Used for resetting the graph from filters
    const graphDict: GraphProperties = useMemo(() => {
        // if (!entries) return {nodes:[], links:[]}
        // console.log(entries)
        let graphProps: GraphProperties = {nodeProperties:{}, linkProperties:{}}
        let nodeProps = graphProps.nodeProperties
        let linkProps = graphProps.linkProperties
        let entryIndex = 0 // The index of the current entry in the entries prop
        
        // Makes a node if it does not already exist then associates the current entryIndex to it
        const makeNode = (t:NodeTypeKey | "type", nodeID:string) => {
            if (!nodeProps[nodeID]) {
                nodeProps[nodeID] = {
                    id: nodeID,
                    nodeType: t === "type" ? "item" : t,
                    label: t !== "type" ? entries[entryIndex][getNodeType(t)] : entries[entryIndex].type,
                    entries: new Set<number>(),
                    entryKeys: getNodeKeys(t),
                    linkKeys: new Set<string>(),
                    neiKeys: new Set<string>(),
                    color: "inherit",
                    darkIcon: setNodeSVGIcon(t, "dark"),
                    lightIcon: setNodeSVGIcon(t, "light")
                };
            }
            nodeProps[nodeID].entries.add(entryIndex)
        }
    
        // Makes a link if it does not already exist then associates the current entryIndex to it
        // The size 'entries' prop is essentially the weight of the link
        const makeLink = (v1:string, v2:string) => {
            // v1 = format(v1)
            // v2 = format(v2)
            let [source, target, linkID] = makeLinkID(v1, v2)
            if (!linkProps || !linkProps[linkID]) {
                let t = makeLinkType(nodeProps[v1].nodeType, nodeProps[v2].nodeType)[2]
                linkProps[linkID] = {
                    id: linkID,
                    source: source,
                    target: target,
                    linkType: t,
                    entries: new Set<number>(),
                    entryKeys: getInfoKeys(t),
                    color: linkColors[t]
                    // label:
                }
                nodeProps[v1].linkKeys.add(linkID)
                nodeProps[v2].linkKeys.add(linkID)
            }
            linkProps[linkID].entries.add(entryIndex)
        }
        
        const addNeighbors = (node:string, neighbors:Set<string>) => {
            if (!nodeProps || !nodeProps[node]) return
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
            // let matcher = e.peopleID?.match(/'([^']+)'/)
            // let personID = matcher ? matcher[1] : null
            // console.log(personID)
            if (!e._id) return
            if (e.store) {
                let store = formatLabel(e.store)
                makeNode("store", store)
                toItem.add(store)
            }
            // if (e.store_owner || e.Marginalia) {
            //     if (e.Marginalia){
            //         makeNode("store", e.Marginalia)
            //         toItem.add(e.Marginalia)
            //     } else if (e.store_owner && !e.Marginalia){
            //         makeNode("store", e.store_owner)
            //         toItem.add(e.store_owner)
            //     }
            // }
            if (e.itemID){
                let itemID = formatLabel(e.itemID)
                if (e.item) makeNode("item", itemID)
                else makeNode("type", itemID)
            }
            // if (e.accountHolderID) {
            if (e.account_name) {
                let account_name = formatLabel(e.account_name)
                // if (nodeProps[account_name] && nodeProps[account_name].nodeType === 'person'){
                //     nodeProps[account_name].nodeType = 'personAccount'
                //     for (let link in nodeProps[account_name].)
                // }
                makeNode("personAccount", account_name)
                toItem.add(account_name)
            }
            if (e.people){
                for (let p of e.people){
                    p = formatLabel(p)
                    if (nodeProps[p] && nodeProps[p].nodeType === 'personAccount'){
                        // console.log(p, nodeProps[p].id)
                        makeNode("personAccount", p)
                        toItem.add(p)
                        toAccount.add(p)
                    }
                    else{
                        makeNode("person", p)
                        nodeProps[p].label = p
                        toAccount.add(p)
                        toItem.add(p)
                    }
                }
            }
            // if (e.peopleID && e.people){}
            if (e.mentions) {
                for (let mention of e.mentions) {
                    mention = formatLabel(mention)
                    // if (!nodeProps[mention]){
                        // console.log(mention)
                    makeNode("mention", mention)
                    nodeProps[mention].label = mention
                    toAccount.add(mention)
                    toItem.add(mention)
                    // }
                }
            }
            // if (personID){
            //     makeNode("person", personID)
            //     toAccount.add(personID)
            // }
            if (e.itemID){
                addNeighbors(formatLabel(e.itemID), toItem)
            }
            // if (e.accountHolderID){
            if (e.account_name) {
                addNeighbors(formatLabel(e.account_name), toAccount)
            }
            // if (personID) {
            //     addNeighbors(personID, toAccount)
            // }
        };
        // const entrySet = new Set<string>()
        for (const [i, entry] of entries.entries()) {
            entryIndex = i
            if (!!entry) {
                const { date_year, Day, month } = entry
                if (!date_year || !Day || !month)
                    continue
                if (date_year) {
                    let dateCheck = new Date(`1/1/${date_year}`)
                    if (dateCheck.toString() === "Invalid Date")
                        continue
                }
                processEntry(entry);
            }
            
            // console.log(index, entry._id)
            // if (entry && entry._id && !entrySet.has(entry._id)) {
            //     entrySet.add(entry._id);
            // }
        }
        // console.log(graphProps)
        return graphProps
    }, [entries, linkColors])
    
    const dates = useMemo<string[]>(()=> {
        let dates = new Set<string>()
        for (let entry of entries){
            
            if (!!entry){
                let {month, Day, date_year} = entry
                if (month && Day && date_year) {
                    let dy = date_year.replace(/[\[\]']+/g, '')
                    let ds = mdy(month, Day, dy)
                    // console.log(ds)
                    let date = new Date(ds)
                    if (date.toString() !== "Invalid Date")
                        dates.add(ds)
                }
            }
        }
        let dArr: string[] = Array.from(dates) //.filter(d=>d.toString() !== "Invalid Date")
        dArr.sort((a, b)=>{return new Date(a).getTime() < new Date(b).getTime() ? -1 : 1})
        // console.log(dArr)
        // let marks: Array<{ value:number, label:Date }> = dArr.map((d,v)=>({
        //     value:v,
        //     label:d
        // }))
        // console.log(dArr)
        return dArr
    }, [entries])
    
    const makePredicates:filterHandler = useCallback((field, t, check, dateRange)=>{
        // console.log(field, t, check, dateRange)
        if (!filter || !(check || t || dateRange)) {
            // console.log("filter, check, t, dateRange", filter, check, t, dateRange)
            setFilter(initFilter);
            return
        }
        let newFilter = { ...filter };
        if (t) {
            if (field === 'node' && newFilter.nodeTypes) {
                newFilter.nodeTypes = { ...newFilter.nodeTypes, [t]: check };
                if (t === 'personAccount') {
                    newFilter.nodeTypes = {
                        ...newFilter.nodeTypes,
                        person: check,
                    };
                }
            }
            if (field === 'link' && newFilter.linkTypes) {
                newFilter.linkTypes = { ...newFilter.linkTypes, [t]: check };
            }
        }
        if (field === 'date') {
            newFilter.dateRange = dateRange//{ ...newFilter.dateRange, end: dateRange.end, start: dateRange.start };
        }
        // console.log("old filter: ", filter.nodeTypes)
        // console.log("new filter: ", newFilter.nodeTypes)
        // console.log("new filter dr: ", newFilter.dateRange)
        // console.log(newFilter)
        setFilter(newFilter)
    },[filter])
    
    const filteredKeys = useMemo<GraphKeys>(()=>{
        const {nodeProperties, linkProperties} = graphDict
        
        if (!filter) {
            return {
                nodes: new Set<GraphKey>(Object.keys(nodeProperties)),
                links: new Set<GraphKey>(Object.keys(linkProperties)),
                newEntries: new Set<number>(entries.map((_,i)=>i))
            }
        }
        
        const {dateRange, nodeTypes} = filter
        // console.log(dateRange)
        // subtractive filter so if nothing is false everything stays, return early
        if (
            // linkTypes &&
            // Object.values(linkTypes).every(p => p) &&
            nodeTypes &&
            Object.values(nodeTypes).every(p => p)
            && (!dateRange || !dateRange.start || !dateRange.end)
        ) {
            let ne = new Set<number>(entries.map((_,i)=>i))
            // console.log("ne", ne)
            return {
                nodes: new Set<GraphKey>(Object.keys(nodeProperties)),
                links: new Set<GraphKey>(Object.keys(linkProperties)),
                newEntries: ne
            }
        }
        
        const nodePredicates = (node: NodeProperties) => {
            return !nodeTypes ||
                (!!nodeTypes[node.nodeType] &&
                    nodeTypes[node.nodeType] === true
                )
        }
        
        const linkPredicates = (link: LinkProperties) => {
            // if (!linkTypes) return true
            // if the node isn't in the map then it was filtered out
            // console.log(link.source, link.target)
            return nodes.has(link.source) && nodes.has(link.target) &&
                Array.from(link.entries).some(e=>newEntries.has(e));
            
        }
        
        const datePredicates = (e: number, start: Date, end:Date) => {
            // return (!dateRange) ||
            // if (!dateRange || !dateRange.start || !dateRange.end) {
            //     // console.log(289)
            //     return true
            // }
            const {month, Day, date_year} = entries[e]
            if (month && Day && date_year) {
                let dy = date_year.replace(/[\[\]']+/g,'')
                let date = mdy(month, Day, dy)
                let dt = new Date(date)
                // console.log(dt.toString());
                if (dt.toString() === 'Invalid Date') return false;
                let ret =
                    // (!!e.date || !!dateBool) &&
                    (start.getTime() <= dt.getTime() &&
                        dt.getTime() <= end.getTime());
                // console.log(date)
                // if (ret) newEntries.add(e)
                return ret;
            }
            return false
            // let start = new Date(dateRange.start)
            // let end = new Date(dateRange.end)
            // let dr = Array.from(link.entries)
            //     .map((ek: number) => {
            //         // console.log(ek)
            //         return entries[ek];
            //     })
            //     .some((e) => {
            //         const {month, Day, date_year} = e
            //         // else if (e.date && !dateBool) {
            //         //     date = new Date(e.date)
            //         // }
            //     });
            // // console.log(dr)
            // return dr
        }
        let nodes = new Set<GraphKey>()
        let links = new Set<GraphKey>()
        let newEntries = new Set<number>()
        
        if (dateRange && dateRange.start && dateRange.end){
            let start = new Date(dateRange.start)
            let end = new Date(dateRange.end)
            entries.forEach((_, i)=> {
                if (datePredicates(i, start, end))
                    newEntries.add(i)
            })
        } else {
            newEntries = new Set<number>(entries.map((_,i)=>i))
        }
        
        
        // console.log(newEntries)
        Object.keys(nodeProperties).forEach(k => {
            if (nodePredicates(nodeProperties[k])) nodes.add(k)
        })
        // console.log(nodes)
        Object.keys(linkProperties).forEach(k => {
            let lp = linkPredicates(linkProperties[k])
            // console.log(lp)
            if (lp) links.add(k)
        })
        
        return {nodes: nodes, links: links, newEntries: newEntries}
    }, [filter, graphDict, entries])
    
    const graph: GraphData = useMemo(() =>{
        const {nodeProperties, linkProperties} = graphDict
        
        let nodeDict: NodeDict = {}
        let nodes: NodeObject[] = []
        
        for (let [k, v] of Object.entries(nodeProperties)) {
            if (filteredKeys.nodes.has(k)) {
                let node: NodeObject = {
                    id: k,
                    nodeType: v.nodeType,
                    label: v.label,
                    entries: new Set<number>(v.entries),
                    entryKeys: [...v.entryKeys],
                    neighbors: {},
                    linkDict: {},
                    value: 5
                }
                node.lightIcon = nodeProperties[node.id].lightIcon
                node.darkIcon = nodeProperties[node.id].darkIcon;
                nodes.push(node);
                nodeDict[k] = node
            }
        }
        nodes.sort(comparator)
        let linkDict: LinkDict = {}
        let links: LinkObject[] = []
        
        for (let [k, l] of Object.entries(linkProperties)) {
            const {source, target, linkType} = l
            if (filteredKeys.links.has(k)) {
                let link: LinkObject = {
                    id: k,
                    label: `${nodeDict[source].label} - ${nodeDict[target].label}`,
                    source: nodeDict[source].id,
                    target: nodeDict[target].id,
                    linkType: linkType,
                    entries: new Set<number>(Array
                        .from(l.entries)
                        .filter(i=>filteredKeys.newEntries.has(i))
                    ),
                    entryKeys: [...l.entryKeys]
                }
                links.push(link)
                linkDict[k] = link
            }
        }
        
        for (let node of nodes){
            for (let nei of nodeProperties[node.id].neiKeys){
                // if (filteredKeys.nodes.has(nei))
                node.neighbors[nei] = nodeDict[nei]
            }
            
            // console.log(nodeProps[node.id].linkKeys)
            for (let l of nodeProperties[node.id].linkKeys){
                // if (filteredKeys.links.has(l))
                node.linkDict[l] = linkDict[l]
            }
        }
        
        for (let n of nodes) {
            n.linkDict = Object.fromEntries(Object.entries(n.linkDict).filter(e => filteredKeys.links.has(e[0])))
            n.neighbors = Object.fromEntries(Object.entries(n.neighbors).filter(e => filteredKeys.nodes.has(e[0])))
            n.value = Math.max(n.value, Math.min(Object.keys(n.neighbors).length / 2, 10))
        }
        // console.log(nodeDict)
        return {nodes: nodes, links:links, nodeDict:nodeDict, linkDict:linkDict}
    }, [ graphDict, filteredKeys])
    
    const toggleInfo = useCallback((node:NodeObject, link?:LinkObject)=>{
        let info:EntryInfo[] = []
        // let entryProps = getNodeKeys(node.nodeType)
        let eType: string = ''
        let name: string = ''
        let id: string | number = ''
        if (node && !link) {
            name = node.label
            eType = `${node.nodeType} node`
            id = node.id
            for (let e of node.entries){
                if (filteredKeys.newEntries.has(e))
                    info.push(makeEntryInfo(entries[e], node.nodeType as GraphTypeKey))
            }
        }
        if (node && link) {
            name = link.label ?? name
            eType = 'Link'
            id = link.id
            for (let e of link.entries){
                if (filteredKeys.newEntries.has(e))
                    info.push(makeEntryInfo(entries[e], link.linkType as GraphTypeKey))
            }
        }
        if (node || link){
            setScrolledItem(id)
            setGraphPanelInfo({name:name, info:info, entityType:eType})
        }
        // console.log(info)
    }, [entries, filteredKeys])
    // console.log(scrolledItem)
    const handleEntryAction = useCallback((id:string | undefined, action:string) => {
        // const path = `/entries/${action}`;
        if (id) {
            entryDispatch({
                type: 'CREATE',
                payload: entries.filter(e => e._id === id)[0]
            })
            router.push(`/entries/${action}`)
        }
    }, [entries, entryDispatch, router])
    
    const toggleNodeLabels = useCallback((visible: boolean) => {
        setNodeLabelsVisible(visible)
    }, [])
    // const toggleEdgeLabels = useCallback((visible: boolean) => {
    //     setEdgeLabelsVIsible(visible)
    // }, [])
    
    const handleNodeZoom:nodeHandler = useCallback((node )=> {
        if (graphRef.current) {
            // graphRef.current?.pauseAnimation()
            graphRef.current.centerAt(node.x, node.y, 1000)
            graphRef.current.zoom(10, 1000);
            // graphRef.current.zoomToFit(1000, 10, v => !!node.neighbors[v.id] || v.id === node.id);
            // graphRef.current.zoomToFit(1000, 2*node.value*relSize)
            // graphRef.current?.resumeAnimation()
        }
        toggleInfo(node)
    },[graphRef, toggleInfo]);
    
    const handleLinkZoom = useCallback((link:LinkObject) => {
        if (typeof link.source !== "object" || typeof link.target !== "object") return
        
        let ux = link.source.x
        let uy = link.source.y
        
        let vx = link.target.x
        let vy = link.target.y
        
        if (!(ux && uy && vx && vy)) return
        
        if (graphRef.current) {
            // graphRef.current.zoom(5, 200);
            // graphRef.current.centerAt((ux+vx)/2, (uy+vy)/2, 100);
            graphRef.current.zoomToFit(1000, 20, (v) => {
                let tar = typeof link.target === "object" ? link.target.id : link.target
                let src = typeof link.source === "object" ? link.source.id : link.source
                return v.id === src || v.id === tar;
            });
        }
        toggleInfo(link.source as NodeObject, link)
    }, [graphRef, toggleInfo])
    
    const focusOn = useCallback((elements) => {
        setFocusedItems(elements)
    }, [])
    
    const focusOff = useCallback((empty) => {
        setFocusedItems(empty)
    }, [])
    
    const handleNodeRightClick = useCallback( (node: NodeObject, event: MouseEvent) => {
        event.preventDefault()
        // setFocusedItems(new Set([node.id]))
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                    id: node.id
                }
                :
                null,
        );
    }, [contextMenu])
    
    const fetchEntries = useCallback(() => {
        // let id = Array.from(focusedItems)[0]
        let id = contextMenu?.id
        // setRightClicked(id)
        if (id) {
            console.log("id", id)
            graphItemDispatch({type:'CREATE', payload: id})
            fetchMore(graphDict.nodeProperties[id].label);
            // graphRef.current?.resumeAnimation()
            // setFocusedItems(new Set([id]))
            // setTimeout(()=>focusOn([...graphDict.nodeProps[rightClicked].neiKeys.values(), rightClicked]), 2000)
            // setTimeout(() => handleNodeZoom(graph.nodes.filter((v) => v.id === rightClicked)[0],), 2000,);
        }
        handleClose()
    }, [contextMenu?.id, fetchMore, graphDict.nodeProperties, graphItemDispatch])
    
    // const toEntryView = useCallback((action: string = 'view', id: string) => {
    //     const path = `/entries/${action}`;
    //     if (payload && action && action !== "Create" ){
    //         entryDispatch({
    //             type: "CREATE",
    //             payload: payload
    //         })
    //     }
    //     router.push(path);
    // }, [entryDispatch, router])
    
    const handleClose = () => {
        setContextMenu(null);
        // setFocusedItems(new Set())
        // setRightClicked(undefined)
        // graphRef.current?.resumeAnimation()
    };
    
    const engineStopCB = useCallback(() =>{
        console.log("engine stop", graphItem)
        if (graphItem !== '' && graph.nodeDict)
            handleNodeZoom(graph.nodeDict[graphItem])
        graphItemDispatch({type:'CREATE', payload: ''})
    }, [graphItem,graphItemDispatch, handleNodeZoom, graph.nodeDict])
    
    // Post-mount effects
    useEffect(()=>{
        if (graph)
            toggleInfo(graph.nodes[0])
    }, [graph, toggleInfo])
    
    useLayoutEffect(() => {
        // let offset = offsetRef?.current?.clientHeight ? offsetRef.current.clientHeight : 0
        // let offset = mixins.toolbar.minHeight ? offsetRef?.current?.clientHeight : 0
        // let ch = graphGridRef?.current?.clientHeight ? graphGridRef?.current?.clientHeight : 0
        // let h = ch && offset ? ch - offset : window.innerHeight - 64
        // setGraphWidth(graphGridRef?.current?.clientWidth)
        // setGraphHeight(graphGridRef?.current?.clientHeight)
        // setGraphWidth(graphGridRef?.current?.getBoundingClientRect().width * (58.333))
        let h = window.innerHeight * .05 > 64 ? window.innerHeight * .95 : window.innerHeight-64
        setGraphHeight(h)
        setGraphWidth(window.innerWidth * (7/12))
        // console.log(graphWidth, graphHeight)
    },[])
    window.addEventListener('resize', () => {
        // let offset = mixins.toolbar.minHeight ? offsetRef?.current?.clientHeight : 0
        // let ch = graphGridRef?.current?.clientHeight ? graphGridRef?.current?.clientHeight : 0
        // let h = ch && offset ? ch - offset : window.innerHeight - 64
        // let o = mixins.toolbar.minHeight
        // setGraphWidth(graphGridRef?.current?.getBoundingClientRect().width)
        // setGraphHeight(graphGridRef?.current?.getBoundingClientRect().height - 48)
        // setGraphWidth(graphGridRef?.current?.clientWidth)
        let h = window.innerHeight * .05 > 64 ? window.innerHeight * .95 : window.innerHeight-64
        setGraphHeight(h)
        setGraphWidth(window.innerWidth * (7/12))
        // console.log(graphWidth, graphHeight)
    })
    useEffect(() => {
        if (graphRef.current) {
            const fg = graphRef.current;
            // fg.d3Force('link', d3.forceLink().id(l=>l.id).strength(l =>{
            //     let x = graphDict.nodeProps[graphDict.linkProps[l.id].source].neiKeys.size
            //     let y = graphDict.nodeProps[graphDict.linkProps[l.id].target].neiKeys.size
            //     return 1/ Math.min(x,y)
            // }))
            fg.d3Force('collide', d3.forceCollide(node => (relSize * node.value)/2))
            // fg.d3Force('link', d3.forceLink(graph.links)
            //     .distance(link => {
            //         return (30/link.entries.size) + (relSize * (link.source.value + link.target.value)/2)
            //     })
            //     .strength(link => {
            //         return link.entries.size / Math.min(link.source.value, link.target.value)
            //     })
            // )
        }
    }, [graph])
    
    // Main render callback
    const paintNodes = useCallback((node:NodeObject, ctx:CanvasRenderingContext2D, globalScale)=> {
        // let node = node//nodeMap[node.id]
        if (!node || node.x === undefined || node.y === undefined) {
            return;
        }
        // const size = 24;
        const size = relSize * node.value
        // console.log(size)

        if (focusedItems.has(node.id)){
            ctx.beginPath();
            ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = palette.error.light;
            ctx.fill();
        }
        if (node.lightIcon && node.darkIcon) {
            if (mode === "dark")
                ctx.drawImage(node.darkIcon, node.x - size / 2, node.y - size / 2, size, size,);
            else
                ctx.drawImage(node.lightIcon, node.x - size / 2, node.y - size / 2, size, size,);
            
        }
        if (nodeLabelsVisible){
            const fontSize = 12/globalScale
            const textWidth = ctx.measureText(node.label).width;
            const txtBox = [textWidth, fontSize]//.map(n => n + fontSize * 0.2); // some padding
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = mode === "light" ? 'white' : 'black';
            ctx.fillRect(node.x - txtBox[0] / 2, node.y + (node.value + txtBox[1]/2), txtBox[0], txtBox[1]);
        
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = mode !== "light" ? 'white' : 'black';
            // ctx.fillStyle = node.color;
            ctx.fillText(node.label, node.x, node.y + (node.value + txtBox[1]), textWidth);
            // node.txtBox = txtBox
        }
    },[focusedItems, palette, mode, nodeLabelsVisible])
    
    return (<>
        <Box component={"main"} sx={{flexGrow: 1, overflow: 'hidden'}} alignItems={"stretch"}>
            <Toolbar/>
            <Grid container>
                <Grid item xs={2} >
                    {graphRef && (
                        <NodeList
                            gData={graph}
                            handleClickZoom={handleNodeZoom}
                            focusOn={focusOn}
                            focusOff={focusOff}
                            toggleInfo={toggleInfo}
                            scrolledItem={scrolledItem}
                        />
                    )}
                </Grid>
                <Grid component={'div'} item xs={7}  >
                    <Box position={"relative"} ref={graphGridRef}>
                        <ForceGraph2D
                            ref={graphRef}
                            // dagMode={"td"}
                            graphData={graph}
                            width={graphWidth}
                            height={graphHeight}
                            // autoPauseRedraw={false}
                            linkColor={(l) => linkColors[l.linkType as keyof typeof linkColors]}
                            linkWidth={link => (focusedItems.has(link.id) ? 6 : 3)}
                            linkDirectionalParticles={4}
                            linkDirectionalParticleWidth={link => focusedItems.has(link.id) ? 8 : 0}
                            // TODO: Figure out canvas interaction with next.js
                            nodeLabel={(node) =>
                                (node?.label && !nodeLabelsVisible) ? node.label.toString() : ""
                            }
                            nodeRelSize={relSize}
                            // nodeCanvasObjectMode={()=>'after'}
                            nodeCanvasObject={(node, ctx, globalScale) => paintNodes(node, ctx, globalScale)}
                            nodePointerAreaPaint={(node, color, ctx) => {
                                if (!node || !node.x || !node.y ) {
                                    return;
                                }
                                ctx.fillStyle = color;
                                const size = relSize * node.value
                                // size && ctx.fillRect(node.x - node.txtBox[0] / 2, node.y - node.txtBox[1] / 2, ...node.txtBox);
                                size && ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size)
                            }}
                            onNodeClick={handleNodeZoom}
                            onNodeRightClick={(node,e)=> {
                                // graphRef.current?.pauseAnimation()
                                handleNodeRightClick(node, e)
                            }
                            }
                            onLinkClick={handleLinkZoom}
                            onNodeDragEnd={node => {
                                node.fx = node.x;
                                node.fy = node.y;
                            }}
                            // nodeVal={v => Math.max(Object.keys(v.neighbors).length, 5)}
                            nodeVal={n=>n.value}
                            cooldownTime={graphItem !== '' ? 1000 : 15000}
                            // cooldownTicks={100}
                            onEngineStop={engineStopCB}
                            // enablePointerInteraction={true}
                        />
                        <GraphControlPanel
                            makePredicates={makePredicates}
                            dates={dates.map(d=>new Date(d))}
                            toggleNodeLabels={toggleNodeLabels}
                            nodeLabels={nodeLabelsVisible}
                        />
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Toolbar/>
                    <GraphInfoPanel
                        // width={240}
                        name={graphPanelInfo?.name}
                        info={graphPanelInfo?.info}
                        entityType={graphPanelInfo?.entityType}
                        handleEntryAction={handleEntryAction}
                    />
                </Grid>
            </Grid>
        </Box>
        <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
            marginThreshold={0}
        >
            <MenuItem onClick={fetchEntries}>Search Related Nodes</MenuItem>
            {/*<MenuItem onClick={handleClose}>Copy</MenuItem>*/}
            {/*<MenuItem onClick={handleClose}>Print</MenuItem>*/}
            {/*<MenuItem onClick={handleClose}>Highlight</MenuItem>*/}
            {/*<MenuItem onClick={handleClose}>Email</MenuItem>*/}
        </Menu>
    </>);
};
export default GraphGui;