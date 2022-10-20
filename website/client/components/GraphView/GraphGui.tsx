import { ForceGraph2D } from 'react-force-graph';
import { useEffect, useState } from 'react';
// import { v4 as idv4 } from 'uuid';
import NodeListItem from '@components/GraphView/NodeListItem';
import { GraphInfo, MyGraphData, Vertex } from '../../../types/GraphTypes';
import Drawer from '@mui/material/Drawer';
import Header from '@components/Header';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
// import ListItemButton from '@mui/material/ListItemButton';

interface GraphGuiProps {
    gData: MyGraphData;
    gInfo: GraphInfo;
}

const drawerWidth = 240;
const GraphGui = ({ gData, gInfo }: GraphGuiProps): JSX.Element => {
    return (
        <>
            <Header />
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                open
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}></Box>
                <List
                    subheader={
                        <ListSubheader
                            component="div"
                            id="nested-list-subheader"
                        >
                            Nodes
                        </ListSubheader>
                    }
                >
                    {gData?.nodes
                        ?.filter((v) => !!gInfo[v.id])
                        .map((v: Vertex) => (
                            <NodeListItem id={v.id} key={v.id} v={v} />
                        ))}
                </List>
            </Drawer>
            <ForceGraph2D
                graphData={gData}
                // TODO: Figure out canvas interaction with next.js
                // nodeCanvasObject={(node, ctx) => {
                //     if (node.id && node.x && node.y) {
                //         const label = node.id.toString();
                //         ctx.fillText(label, node.x, node.y);
                //     }
                // }}
            />
        </>
    );
};

export default GraphGui;
