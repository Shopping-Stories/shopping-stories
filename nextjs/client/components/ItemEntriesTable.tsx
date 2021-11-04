import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {
    ItemsMentionedTable,
    ItemsOrServicesTable,
} from './ItemEntrySubTables';

const ItemEntriesTable = (props: any) => {
    const { itemEntries } = props;

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Item Entries
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableCell />
                    <TableCell>PerOrder</TableCell>
                    <TableCell>Percentage</TableCell>
                </TableHead>
                <TableBody>
                    {itemEntries.map((entry: any, i: number) => (
                        <ItemEntryRow itemEntry={entry} key={i} />
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const ItemEntryRow = ({ itemEntry }: any) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell>{itemEntry?.perOrder}</TableCell>
                <TableCell>{itemEntry?.percentage}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto">
                        {!!itemEntry && (
                            <>
                                <ItemsOrServicesTable
                                    itemsOrServices={itemEntry?.itemsOrServices}
                                />
                                <ItemsMentionedTable
                                    itemsMentioned={itemEntry?.itemsMentioned}
                                />
                            </>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ItemEntriesTable;
