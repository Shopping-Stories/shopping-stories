import { NodeListItemProps, EdgeListItemProps, NodeListProps } from "@components/GraphView/GraphGui";
import { useState, memo  } from "react";
import NodeIcon from '@components/GraphView/NodeIcon';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Toolbar from "@mui/material/Toolbar";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

const EdgeListItem = ({ edge, handleClickZoom, focusOn, focusOff }: EdgeListItemProps) => {
    const {info, id} = edge
    return (
            <ListItemButton>
                <ListItemIcon sx={{ pl: 2 }}>
                    <NodeIcon
                        t={`${info ? info.__typename : id}`}
                    />
                </ListItemIcon>
                <ListItemText
                    onMouseEnter={()=>focusOn(edge.id)}
                    onMouseLeave={()=>focusOff("")}
                    onClick={() => handleClickZoom(edge)}
                    secondary={`${id}`}
                    secondaryTypographyProps={{
                        style: {
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            // overflow: 'auto'
                            maxWidth: '100%',
                        },
                    }}
                />
            </ListItemButton>
    );
};

const ListItem = ({ node, handleClickZoom, focusOn, focusOff }: NodeListItemProps) => {
    const {id, neighbors, info} = node
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(!open);
    
    return (
        <>
                <ListItemButton>
                    <ListItemIcon>
                        <NodeIcon t={`${info ? info.__typename : ''}`} />
                    </ListItemIcon>
                    <ListItemText
                        onMouseEnter={()=>focusOn(node.id)}
                        onMouseLeave={()=>focusOff("")}
                        onClick={()=>handleClickZoom(node)}
                        primary={id}
                        primaryTypographyProps={{
                            style: {
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                // overflow: 'auto',
                                maxWidth: '100%',
                            },
                        }}
                    />
                    {neighbors &&
                        (open ? (
                            <ExpandLess onClick={handleClickOpen} />
                        ) : (
                            <ExpandMore onClick={handleClickOpen} />
                        ))}
                </ListItemButton>
            {/*</Tooltip>*/}
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                orientation={'vertical'}
            >
                <List component="nav" disablePadding>
                    {neighbors && Object.entries(neighbors)
                        .filter((entry) => !!entry[1])
                        .map(([key, edge]) => (
                            <EdgeListItem
                                key={key}
                                edge={edge}
                                handleClickZoom={handleClickZoom}
                                focusOn={focusOn}
                                focusOff={focusOff}
                            />
                        ))}
                </List>
            </Collapse>
            <Divider/>
        </>
    );
};

const NodeList = ({ gData, handleClickZoom, focusOn, focusOff}: NodeListProps): JSX.Element => {
    console.log("nodelist render");
    return (
        <>
            <Toolbar>
                <SubdirectoryArrowRightIcon />
                <ListItemText primary="Nodes" secondary="Edges" />
            </Toolbar>
            <Divider />
            <List>
                {gData.nodes.filter(node => !!node).map(node =>
                    <ListItem
                        handleClickZoom={handleClickZoom}
                        key={node.id}
                        node={node}
                        focusOn={focusOn}
                        focusOff={focusOff}
                    />
                )}
            </List>
        </>
    );
};

export default memo(NodeList);
