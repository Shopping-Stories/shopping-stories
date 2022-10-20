import { Vertex } from '../../../types/GraphTypes';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';

interface NodeListItemProps {
    // key: string;
    id: string;
    v: Vertex;
}

const NodeListItem = ({ v }: NodeListItemProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <Divider />
            <ListItem onClick={handleClick}>
                <ListItemText
                    primary={v.id}
                    primaryTypographyProps={{
                        style: {
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflow: 'auto',
                        },
                    }}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div"></List>
                </Collapse>
            </ListItem>
            <Divider />
        </>
    );
};

export default NodeListItem;
