import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { AdvancedSearch, OptionsType } from 'client/types';
import { Dispatch, SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Entry, ParserOutput } from "new_types/api_types";
import {useEntryDispatch} from "@components/context/EntryContext";
import { useRouter } from 'next/router';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import AddCircle from "@mui/icons-material/AddCircle";
import {
    GridColDef,
    GridRowsProp,
    DataGrid,
    GridRowId, useGridApiRef
} from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
// import EntryDialog from "@components/GraphView/EntryDialog";
import Toolbar from "@mui/material/Toolbar";

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

const columns: GridColDef[] = columnNames.map((str: string) : GridColDef => {
    return {
        field: str.split(" ").join(""),
        headerName: str,
        // editable: isAdminOrModerator,
        flex: [
            "Purchaser",
            "Account Name",
            "Relevant Item",
            "Item",
            "Owner",
            "Comments",
            "Store"
        ].includes(str) ? 1 : ([
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

export function getFarthInsert(farthings: number|undefined) {
    let farthInsert = "";
    if (farthings != undefined && farthings != 0) {
        farthInsert = "." + (farthings/4).toString().replace("0.", "");
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

function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

interface SelectedRowParams {
    id: GridRowId;
    field?: string;
}

interface EntryPaginationTable {
    // queryDef: string;
    // search: string;
    // advanced: AdvancedSearch | null;
    // isAdvancedSearch: boolean;
    // setReQuery: Dispatch<SetStateAction<boolean>>;
    // setIsLoading: Dispatch<SetStateAction<boolean>>;
    // reQuery: boolean;
    // setRows: Dispatch<SetStateAction<Entry[]>>;
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    handleEntryAction: (action: string, payload: Entry | undefined) => void
    entries: Entry[]
}

const EntryPaginationTable = (props: EntryPaginationTable) => {
    const {
        // queryDef,
        // search,
        advanced,
        setReQuery,
        setIsLoading,
        reQuery,
        setRows,
        isAdminOrModerator,
        handleEntryAction,
        entries
    } = props;

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter();
    const [selectedRow, setSelectedRow] =
        useState<SelectedRowParams| null>(null);
    // const [selectedRow, setSelectedRow] = useState()
    const [dialog, setDialog] = useState<string | undefined>(undefined)
    // const [open, setOpen] = useState<boolean>(!!dialogType)
    const handleClose = () => {
        setDialog(undefined);
    };
    
    const dispatch = useEntryDispatch()
    
    const gridRef = useGridApiRef()
    // setRowsPerPage;
    
    // const [setOptions] = useState<OptionsType>({
    //     limit: rowsPerPage,
    //     skip: null,
    // });
    // setOptions;
    
    // const {data, refetch, isLoading} = useQuery({
    //     queryKey: ["entries", search],
    //     queryFn: () => doSearch(search),
    // });

    // console.log(data);

    // useEffect(() => {
    //     if (reQuery) {
    //         refetch();
    //         setReQuery(false);
    //     }
    // }, [refetch, reQuery, setReQuery]);
    //
    // useEffect(() => {
    //     if (setIsLoading !== undefined) {
    //         setIsLoading(isLoading);
    //     }
    // }, [isLoading, setIsLoading]);

    // const rows = data?.rows ?? [];
    
    // const [editable, setEditable] = useState<boolean>(false)
    
    const handleCellFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        const row = event.currentTarget.parentElement;
        const id = row!.dataset.id!;
        const field = event.currentTarget.dataset.field!;
        // console.log(id)
        setSelectedRow({ id, field });
    }, [setSelectedRow]);
    
    const entryMap = useMemo<{[key:string]: Entry} | undefined>(()=>{
        if (!entries.length) return {id: {}}
        return Object.fromEntries(entries.map(e=>[e._id, e]))
    }, [entries])
    
    const handleACtionClick = useCallback((action: string) => {
        if (entryMap && selectedRow?.id){
            handleEntryAction(action, entryMap[selectedRow.id])
        }
        else{
            handleEntryAction(action, undefined)
        }
    },[entryMap, selectedRow])
    
    // console.log("entryMap", entryMap)
    const rows = useMemo<GridRowsProp>(()=>{
        return entries.map((row) => {
            return {
                AccountName: row?.account_name,
                "Dr/Cr": row?.debit_or_credit,
                Amount: row?.amount,
                Item: toTitleCase((row?.item ?? "")),
                // AccountHolderID: row?.accountHolderID,
                Date: (row?.Day ?? "") + " " + (row?.month == undefined ? "" : months[parseInt(row?.month) - 1]) + " " + row?.date_year,
                Owner: row?.store_owner,
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
            }
        }) || [];
    }, [entries])
    
    // useEffect(() => {
    //     if (setRows !== undefined) {
    //         setRows(data?.entries || []);
    //         // console.log(data?.entries);
    //         let thing: GridRowsProp = data?.entries.map((row) => {return {
    //             AccountName: row?.account_name,
    //             "Dr/Cr": row?.debit_or_credit,
    //             Amount: row?.amount,
    //             Item: toTitleCase((row?.item ?? "")),
    //             // AccountHolderID: row?.accountHolderID,
    //             Date: (row?.Day ?? "") + " " + (row?.month == undefined ? "" : months[parseInt(row?.month) - 1]) + " " + row?.date_year,
    //             Owner: row?.store_owner,
    //             // Store: row?.meta?.store,
    //             // Comments: row?.meta?.comments,
    //             // Colony: row?.money?.colony,
    //             Store: row?.store,
    //             Quantity: row?.Quantity,
    //             Commodity: row?.Commodity,
    //             Currency: moneyToString(row?.currency?.pounds, row?.currency?.shillings, row?.currency?.pennies, row?.currency?.farthings),
    //             Sterling: moneyToString(row?.sterling?.pounds, row?.sterling?.shillings, row?.sterling?.pennies, row?.sterling?.farthings),
    //             // Ledger: row?.ledger?.folio_year,
    //             Page: row?.ledger?.folio_page,
    //             id: row?._id,
    //         }}) || [];
    //
    //         editRows(thing);
    //     }
    // }, [advanced?.itemEntry?.items, data?.entries, setRows]);

    // Avoid a layout jump when reaching the last page with empty rows.

    // const [rows, editRows] = useState<GridRowsProp>([] as GridRowsProp);
    
    // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    // const [value, setValue] = useState('');
    
    // const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    //     const field = event.currentTarget.dataset.field!;
    //     const id = event.currentTarget.parentElement!.dataset.id!;
    //     const row = rows.find((r) => r.id === id)!;
    //     setValue(row[field]);
    //     setAnchorEl(event.currentTarget);
    // };
    
    // const handlePopoverClose = () => {
    //     setAnchorEl(null);
    // };
    
    // const open = Boolean(anchorEl);
    
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
                {/*<EditToolbar isAdminOrModerator={isAdminOrModerator} selection={!!selectedRow} setAction={handleEntryAction}/>*/}
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        p: 1,
                    }}
                >
                    {/*<Toolbar>*/}
                    <Stack spacing={1} direction={"row"}>
                        <Button
                            onClick={()=> handleACtionClick("View")}
                            variant="contained"
                            disabled={!selectedRow}
                            color={"secondary"}
                        >
                            View
                        </Button>
                        {isAdminOrModerator &&
                            (<>
                                <Button
                                    onClick={() => handleACtionClick("Create")}
                                    variant="contained"
                                    startIcon={<AddCircle />}
                                    hidden={!isAdminOrModerator}
                                    // onclick={()=> setDialog("create")}
                                >
                                    Create
                                </Button>
                    
                                <Button
                                    onClick={()=> handleACtionClick("Edit")}
                                    // onMouseDown={handleMouseDown}
                                    disabled={!selectedRow}
                                    hidden={!isAdminOrModerator}
                                    variant="contained"
                                    color={"warning"}
                                >
                                    edit
                                </Button>
                    
                                <Button
                                    onClick={()=> handleACtionClick("Delete")}
                                    // onMouseDown={handleMouseDown}
                                    disabled={!selectedRow}
                                    hidden={!isAdminOrModerator}
                                    variant="contained"
                                    color={"error"}
                                >
                                    Delete
                                </Button>
                            </>)
                        }
                    </Stack>
                    {/*</Toolbar>*/}
                </Box>
                <DataGrid
                    editMode={'row'}
                    rows={rows ?? []}
                    columns={columns}
                    autoPageSize
                    getRowId={(row) => row.id}
                    // isRowSelectable={(params) => params && isAdminOrModerator && editable}
                    // components={{ Toolbar: EditToolbar }}
                    // disableRowSelectionOnClick
                    componentsProps={{
                        // toolbar: {
                        //     isAdminOrModerator: isAdminOrModerator,
                        //     // editable: isAdminOrModerator && editable,
                        //     // setEditable: setEditable,
                        //     setDialog: setDialog,
                        //     selection: !!selectedRow
                        // },
                        cell: {
                            onFocus: handleCellFocus
                    //         onMouseEnter: handlePopoverOpen,
                    //         onMouseLeave: handlePopoverClose,
                        },
                    }}
                />
            </Paper>
            {/*<Popover
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                // disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{`${value}`}</Typography>
            </Popover>
            */}
            {/*<EntryDialog*/}
            {/*    entry={dialog !== "Create" && selectedRow && entryMap ? entryMap[selectedRow.id] : {}}*/}
            {/*    dialogType={dialog}*/}
            {/*    setDialog={setDialog}*/}
            {/*/>*/}
        </Box>
    );
};

export default EntryPaginationTable;

interface EditToolbarProps {
    // editable: boolean
    // setEditable: (value: boolean) => void;
    isAdminOrModerator: boolean
    selection: boolean
    setAction: (dialog:string) => void
    // cellModesModel: GridCellModesModel;
    // setCellModesModel: (value: GridCellModesModel) => void;
    // cellMode: 'view' | 'edit';
}

const EditToolbar = (props: EditToolbarProps) => {
    
    const { isAdminOrModerator, selection, setAction } = props;
    
    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                p: 1,
            }}
        >
            {/*<Toolbar>*/}
            <Stack spacing={1} direction={"row"}>
                <Button
                    onClick={()=> setAction("View")}
                    variant="contained"
                    disabled={!selection}
                    color={"secondary"}
                >
                    View
                </Button>
                {isAdminOrModerator &&
                    (<>
                        <Button
                            onClick={() => setAction("Create")}
                            variant="contained"
                            startIcon={<AddCircle />}
                            hidden={!isAdminOrModerator}
                              // onclick={()=> setDialog("create")}
                        >
                            Create
                        </Button>
                        
                        <Button
                            onClick={()=> setAction("Edit")}
                            // onMouseDown={handleMouseDown}
                            disabled={!selection}
                            hidden={!isAdminOrModerator}
                            variant="contained"
                            color={"warning"}
                        >
                            edit
                        </Button>
                        
                        <Button
                            // onClick={()=> setDialog("edit")}
                            // onMouseDown={handleMouseDown}
                            disabled={!selection}
                            hidden={!isAdminOrModerator}
                            variant="contained"
                            color={"error"}
                        >
                            Delete
                        </Button>
                    </>)
                }
            </Stack>
            {/*</Toolbar>*/}
        </Box>
    );
}