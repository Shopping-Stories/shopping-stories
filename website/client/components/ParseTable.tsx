import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Entry } from 'client/types';
import { Fragment } from 'react';
import ParsingResultTableRow from './ParsingResultTableRow';

interface ParseTableProps {
    entries: null | Entry[];
    onParseEdit?: (entry: Entry, index: number) => void;
}

const ParseTable = (props: ParseTableProps) => {
    const { entries, onParseEdit } = props;

    const columnNames = [
        'First Name',
        'Last Name',
        'Prefix',
        'Suffix',
        'Debt or Credit',
        'Location',
        'Profession',
        'Reference',
        // 'Account Holder ID',
        'Day',
        'Month',
        'Year',
        'Date',
        'EntryID',
        'Ledger',
        'Reel',
        'FolioPage',
        'Owner',
        'Store',
        'Year',
        'Comments',
        'Colony',
        'Quantity',
        'Commodity',
        'Currency Pounds',
        'Currency Shilling',
        'Currency Pence',
        'Sterling Pounds',
        'Sterling Shilling',
        'Sterling Pence',
    ];

    return (
        <Fragment>
            {entries && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ minHeight: '80%' }}>
                        <Table
                            sx={{ minWidth: '100vh' }}
                            stickyHeader
                            aria-label="custom pagination table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell colSpan={4} align="center">
                                        Account Holder Information
                                    </TableCell>
                                    <TableCell colSpan={4} align="center">
                                        Account Holder Information
                                    </TableCell>
                                    <TableCell colSpan={4} align="center">
                                        Date Information
                                    </TableCell>
                                    <TableCell colSpan={4} align="center">
                                        Meta Information
                                    </TableCell>
                                    <TableCell colSpan={4} align="center">
                                        Meta Information
                                    </TableCell>
                                    <TableCell colSpan={3} align="center">
                                        Money Information
                                    </TableCell>
                                    <TableCell colSpan={3} align="center">
                                        Money Information
                                    </TableCell>
                                    <TableCell colSpan={3} align="center">
                                        Money Information
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell>Index</TableCell>
                                    {columnNames.map(
                                        (name: string, i: number) => (
                                            <TableCell align="center" key={i}>
                                                {name}
                                            </TableCell>
                                        ),
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((row, i) => {
                                    return (
                                        <ParsingResultTableRow
                                            onParseEdit={onParseEdit}
                                            index={i + 1}
                                            row={row}
                                            key={i}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Fragment>
    );
};

export default ParseTable;
