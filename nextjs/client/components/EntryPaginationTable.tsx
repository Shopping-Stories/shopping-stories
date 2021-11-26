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
    advanced: AdvancedSearch;
    isAdvancedSearch: boolean;
    onEditClick: any;
    onDeleteClick: any;
    setReQuery: Dispatch<SetStateAction<boolean>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    reQuery: boolean;
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    setRows: Dispatch<SetStateAction<Entry[]>>;
}

const EntryPaginationTable = (props: any) => {
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

    const [{ data, fetching }, executeQuery] = useQuery({
        query: queryDef,
        variables: isAdvancedSearch
            ? { options, advanced }
            : { options, search },
    });

    useEffect(() => {
        if (reQuery) {
            executeQuery({ requestPolicy: 'network-only' });
            setReQuery(false);
        }
    }, [reQuery]);

    useEffect(() => {
        if (setIsLoading !== undefined) {
            setIsLoading(fetching);
        }
    }, [fetching]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    const rows = data?.rows ?? [];
    const count = data?.count ?? 0;

    useEffect(() => {
        if (setRows !== undefined) {
            setRows(data?.rows);
        }
    }, [data?.rows]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setOptions((prevOpts: any) => ({
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
        setOptions((prevOpts: any) => ({
            ...prevOpts,
            limit: newRowsPerPage,
            skip: 0,
        }));
    };

    const columnNames = [
        'Account Holder First Name',
        'Account Holder Last Name',
        'Account Holder Prefix',
        'Account Holder Suffix',
        'Debt or Credit',
        'Location',
        'Account Holder Profession',
        'Account Holder Reference',
        'Account Holder ID',
        'Day',
        'Month',
        'Year',
        'Date',
        'EntryID (Meta)',
        'Ledger (Meta)',
        'Reel (Meta)',
        'FolioPage (Meta)',
        'Owner',
        'Store',
        'Year',
        'Comments',
        'Money.Colony',
        'Money.Quantity',
        'Money.Commodity',
        'Money.Currency.Pounds',
        'Money.Currency.Shilling',
        'Money.Currency.Pence',
        'Money.Sterling.Pounds',
        'Money.Sterling.Shilling',
        'Money.Sterling.Pence',
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
                        {fetching ? (
                            <TableRow>
                                <TableCell sx={{ columnSpan: 'all' }}>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        ) : null}
                        <TableRow>
                            <TableCell />
                            {isAdminOrModerator ? <TableCell /> : null}
                            {isAdmin ? <TableCell /> : null}
                            {columnNames.map((name: string, i: number) => (
                                <TableCell key={i}>{name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any) => (
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
            {fetching ? <LinearProgress /> : null}
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
