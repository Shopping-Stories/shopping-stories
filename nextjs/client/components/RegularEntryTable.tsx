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
import { RegularEntry } from 'client/types';
import { Fragment, useState } from 'react';
import { ItemsMentionedTable } from './ItemEntrySubTables';
import TobaccoMarksSubTable from './TobaccoMarksSubTable';

const RegularEntryTable = (props: { regularEntry: RegularEntry }) => {
    const { regularEntry } = props;

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Regular Entry
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Entry</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <RegularEntryRow regularEntry={regularEntry} />
                </TableBody>
            </Table>
        </Box>
    );
};

const RegularEntryRow = ({ regularEntry }: { regularEntry: RegularEntry }) => {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
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
                <TableCell>
                    {regularEntry?.entry ? regularEntry.entry : ''}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={4}
                >
                    <Collapse in={open} timeout="auto">
                        {regularEntry && (
                            <Fragment>
                                {regularEntry.tobaccoMarks &&
                                regularEntry.tobaccoMarks.length > 0 ? (
                                    <TobaccoMarksSubTable
                                        tobaccoMarks={
                                            regularEntry?.tobaccoMarks
                                        }
                                    />
                                ) : null}
                                {regularEntry.itemsMentioned &&
                                regularEntry.itemsMentioned.length > 0 ? (
                                    <ItemsMentionedTable
                                        itemsMentioned={
                                            regularEntry?.itemsMentioned
                                        }
                                    />
                                ) : null}
                            </Fragment>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};

export default RegularEntryTable;
