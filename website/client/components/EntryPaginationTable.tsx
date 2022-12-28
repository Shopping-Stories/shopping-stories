import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { AdvancedSearch, Entry, ItemEntry, OptionsType } from 'client/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from 'urql';

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
        setReQuery,
        setIsLoading,
        reQuery,
        setRows,
    } = props;
    const [page, setPage] = useState(0);
    page;
    const [rowsPerPage, setRowsPerPage] = useState(10);
    setRowsPerPage;
    const [options, setOptions] = useState<OptionsType>({
        limit: rowsPerPage,
        skip: null,
    });
    setOptions;

    interface EntryQueryResult {
        rows: (Entry & { id: string })[];
        count: number;
    }

    const [{ data, stale, fetching }, executeQuery] =
        useQuery<EntryQueryResult>({
            query: queryDef,
            variables: isAdvancedSearch
                ? { options, advanced, populate: false }
                : { options, search, populate: false },
            requestPolicy: 'cache-and-network',
        });

    console.log(data);

    useEffect(() => {
        if (reQuery) {
            executeQuery({ requestPolicy: 'network-only' });
            setReQuery(false);
        }
    }, [executeQuery, reQuery, setReQuery]);

    useEffect(() => {
        if (setIsLoading !== undefined) {
            setIsLoading(stale || fetching);
        }
    }, [stale, fetching, setIsLoading]);

    useEffect(() => {
        setPage(0);
    }, [search, advanced]);

    // const rows = data?.rows ?? [];

    
  
    useEffect(() => {
        function getRelevantItem(thing: ItemEntry[])
        {
            var which = 0;
            console.log("Hello!");
            for (var i = 0; i < thing.length; i++)
            {
                if (thing.at(i)?.itemsOrServices.at(0)?.item.includes(advanced?.itemEntry?.items.toLowerCase() || ""))
                {
                    which = i;
                }
            }
            return thing.at(which)?.itemsOrServices.at(0);
        }
        if (setRows !== undefined) {
            setRows(data?.rows || []);
            let thing: GridRowsProp = data?.rows.map((row) => {return {
                Purchaser: row?.accountHolder?.prefix + " " + row?.accountHolder?.accountFirstName + " " + row?.accountHolder?.accountLastName + " " + row?.accountHolder?.suffix,
                RelevantItem: getRelevantItem(row?.itemEntries || [])?.variants.join(" ") + " " + getRelevantItem(row?.itemEntries || [])?.item,
                AccountHolderID: row?.accountHolder?.accountHolderID,
                Date: row?.dateInfo?.fullDate?.split("T")[0],
                Owner: row?.meta?.owner,
                Store: row?.meta?.store,
                Comments: row?.meta?.comments,
                Colony: row?.money?.colony,
                Quantity: row?.money?.quantity,
                Commodity: row?.money?.commodity,
                CurrencyPounds: row?.money?.currency.pounds,
                CurrencyShilling: row?.money?.currency.shilling,
                CurrencyPence: row?.money?.currency.pence,
                SterlingPounds: row?.money?.sterling.pounds,
                SterlingShilling: row?.money?.sterling.shilling,
                SterlingPence: row?.money?.sterling.pence,
                EntryID: row?.meta?.entryID,
                Ledger: row?.meta?.ledger,
                Reel: row?.meta?.reel,
                FolioPage: row?.meta?.folioPage,
            }}) || [];
            
            
            editRows(thing);
        }
    }, [advanced?.itemEntry?.items, data?.rows, setRows]);

    // Avoid a layout jump when reaching the last page with empty rows.



    const columnNames: string[] = [
        'Purchaser',
        'Relevant Item',
        'Account Holder ID',
        'Date',
        'Owner',
        'Store',
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
        'EntryID',
        'Ledger',
        'Reel',
        'FolioPage',
    ];

    const [rows, editRows] = useState<GridRowsProp>([] as GridRowsProp);

    const columns: GridColDef[] = columnNames.map((str: string) : GridColDef => {return {field: str.split(" ").join(""), headerName: str, flex: ["Purchaser", "Relevant Item", "Owner", "Comments"].includes(str) ? 1 : (["Reel", "EntryID", "Quantity", "Commodity", "Colony"].includes(str) ? 0.35 : 0.5)}});
    return (
        <Box sx={{height: '50vh', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
        <Paper sx={{height: '100%',width: '100%', overflow: 'hidden' }}>
            {/* <TableContainer sx={{ minHeight: '80%' }}>
                <Table
                    sx={{ minWidth: '100vh' }}
                    stickyHeader
                    aria-label="custom pagination table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            {isAdminOrModerator ? <TableCell /> : null}
                            {isAdmin ? <TableCell /> : null}
                            <TableCell colSpan={5} align="center">
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
            /> */}
            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} getRowId={(row) => row.EntryID} disableSelectionOnClick/>
        </Paper>
        </Box>
    );
};

export default EntryPaginationTable;
