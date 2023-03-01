import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { AdvancedSearch, OptionsType } from 'client/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Entry } from "new_types/api_types";

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

interface EntryQueryResult {
    entries: (Entry)[];
}

export function getFarthInsert(farthings: number|undefined) {
    let farthInsert = "";
    if (farthings != undefined && farthings != 0) {
        farthInsert = "." + (farthings/12).toString().replace("0.", "");
    }
    return farthInsert;
}

export function moneyToString(pounds: number|undefined, shillings: number|undefined, pence: number|undefined, farthings: number|undefined) {
    if (pence == undefined) {
        pence = 0;
    }
    if (pounds == undefined || pounds == 0) {
        if (shillings == undefined || shillings == 0) {
            return pence + getFarthInsert(farthings) + "d";
        }
        else {
            return shillings + "/" + pence + getFarthInsert(farthings);
        }
    }
    else {
        return "£" + pounds + "/" + shillings + "/" + pence + getFarthInsert(farthings);
    }
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const doSearch = async (search: string): Promise<EntryQueryResult> => {
    const res = await fetch("https://api.preprod.shoppingstories.org/search/" + search);
    // console.log(await res.text());
    console.log(res);
    let toret: EntryQueryResult = JSON.parse(await res.text());
    return toret;
  };

const EntryPaginationTable = (props: EntryPaginationTable) => {
    const {
        // queryDef,
        search,
        advanced,
        setReQuery,
        setIsLoading,
        reQuery,
        setRows,
    } = props;

    const [rowsPerPage, setRowsPerPage] = useState(10);
    setRowsPerPage;
    
    const [setOptions] = useState<OptionsType>({
        limit: rowsPerPage,
        skip: null,
    });
    setOptions;

    
    const {data, refetch, isLoading} =
        useQuery(
            ["entries", search],
            () => doSearch(search),
        );

    // console.log(data);

    useEffect(() => {
        if (reQuery) {
            refetch();
            setReQuery(false);
        }
    }, [refetch, reQuery, setReQuery]);

    useEffect(() => {
        if (setIsLoading !== undefined) {
            setIsLoading(isLoading);
        }
    }, [isLoading, setIsLoading]);


    // const rows = data?.rows ?? [];

    function toTitleCase(str: string) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
  
    useEffect(() => {
        if (setRows !== undefined) {
            setRows(data?.entries || []);
            // console.log(data?.entries);
            let thing: GridRowsProp = data?.entries.map((row) => {return {
                AccountName: row?.account_name,
                "Dr/Cr": row?.debit_or_credit,
                Amount: row?.amount,
                Item: toTitleCase((row?.item ?? "")),
                // AccountHolderID: row?.accountHolderID,
                Date: (row?.Day ?? "") + " " + (row?.month == undefined ? "" : months[parseInt(row?.month) - 1]) + " " + row?.date_year,
                Owner: row?.store_owner,
                // Store: row?.meta?.store,
                // Comments: row?.meta?.comments,
                // Colony: row?.money?.colony,
                Store: row?.store,
                Quantity: row?.Quantity,
                Commodity: row?.Commodity,
                Currency: moneyToString(row?.currency?.pounds, row?.currency?.shillings, row?.currency?.pennies, row?.currency?.farthings),
                Sterling: moneyToString(row?.sterling?.pounds, row?.sterling?.shillings, row?.sterling?.pennies, row?.sterling?.farthings),
                // Ledger: row?.ledger?.folio_year,
                Page: row?.ledger?.folio_page,
                id: row?._id,
            }}) || [];
            
            
            editRows(thing);
        }
    }, [advanced?.itemEntry?.items, data?.entries, setRows]);

    // Avoid a layout jump when reaching the last page with empty rows.



    const columnNames: string[] = [
        'Account Name',
        'Amount',
        'Item',
        // 'Account Holder ID',
        'Date',
        // 'Store',
        // 'Comments',
        // 'Colony',
        "Store",
        'Dr/Cr',
        'Quantity',
        'Commodity',
        'Currency',
        'Sterling',
        // 'Ledger Year',
        'Owner',
        'Page',
    ];

    const [rows, editRows] = useState<GridRowsProp>([] as GridRowsProp);

    const columns: GridColDef[] = columnNames.map((str: string) : GridColDef => {
        return {
            field: str.split(" ").join(""), 
            headerName: str, 
            flex: [
                "Purchaser",
                "Account Name", 
                "Relevant Item", 
                "Item",
                "Owner", 
                "Comments",
                "Store"
            ].includes(str) ? 1 
            : ([
                "Reel", 
                "EntryID", 
                "Quantity", 
                "Commodity",
                "Page",
                "Colony", 
                "$ Pounds", 
                "$ Shilling", 
                "$ Pence", 
                "$ Farthings", 
                '£ Pounds',
                '£ Shilling',
                '£ Pence',
                '£ Farthings',
                "Dr/Cr"
            ].includes(str) ? 0.2 : 0.5)}
    });
    return (
        <Box sx={{height: '60vh', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
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
            <DataGrid rows={rows ?? []} columns={columns} autoPageSize getRowId={(row) => row.id} disableSelectionOnClick/>
        </Paper>
        </Box>
    );
};

export default EntryPaginationTable;
