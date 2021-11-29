import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { AdvancedSearch, Entry, OptionsType } from 'client/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import ParsingResultTableRow from './ParsingResultTableRow';
import TablePaginationActions from './TablePaginationActions';

interface EntryPaginationTable {
    queryDef: string;
    search: string;
    advanced: AdvancedSearch | null;
    isAdvancedSearch: boolean;
    onEditClick: (row: Entry) => void;
    onDeleteClick: (row: Entry) => void;
    setReQuery: Dispatch<SetStateAction<boolean>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    reQuery: boolean;
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    setRows: Dispatch<SetStateAction<Entry[]>>;
}

const EntryPaginationTable = (props: EntryPaginationTable) => {
    const {
        queryDef,
        search,
        advanced,
        isAdvancedSearch,
        onEditClick,
        onDeleteClick,
        setReQuery,
        setIsLoading,
        reQuery,
        isAdmin,
        isAdminOrModerator,
        setRows,
    } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [options, setOptions] = useState<OptionsType>({
        limit: rowsPerPage,
        skip: null,
    });

    interface EntryQueryResult {
        rows: (Entry & { id: string })[];
        count: number;
    }

    const [{ data, stale }, executeQuery] = useQuery<EntryQueryResult>({
        query: queryDef,
        variables: isAdvancedSearch
            ? { options, advanced, populate: false }
            : { options, search, populate: false },
        requestPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (reQuery) {
            executeQuery({ requestPolicy: 'network-only' });
            setReQuery(false);
        }
    }, [reQuery]);

    useEffect(() => {
        if (setIsLoading !== undefined) {
            setIsLoading(stale);
        }
    }, [stale]);

    useEffect(() => {
        setPage(0);
    }, [search, advanced]);

    const rows = data?.rows ?? [];
    const count = data?.count ?? 0;

    useEffect(() => {
        if (setRows !== undefined) {
            setRows(data?.rows || []);
        }
    }, [data?.rows]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setOptions((prevOpts) => ({
            ...prevOpts,
            limit: rowsPerPage,
            skip: newPage * rowsPerPage,
        }));
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setOptions((prevOpts) => ({
            ...prevOpts,
            limit: newRowsPerPage,
            skip: 0,
        }));
    };

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
                            {isAdminOrModerator ? <TableCell /> : null}
                            {isAdmin ? <TableCell /> : null}
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
                            {isAdminOrModerator ? <TableCell /> : null}
                            {isAdmin ? <TableCell /> : null}
                            {columnNames.map((name: string, i: number) => (
                                <TableCell align="center" key={i}>
                                    {name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <ParsingResultTableRow
                                onDeleteClick={onDeleteClick}
                                onEditClick={onEditClick}
                                key={row.id}
                                row={row}
                                isAdmin={isAdmin}
                                isAdminOrModerator={isAdminOrModerator}
                            />
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {stale ? <LinearProgress /> : null}
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                }}
                component="div"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
        </Paper>
    );
};

export default EntryPaginationTable;
