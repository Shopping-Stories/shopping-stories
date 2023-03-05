import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { AdvancedSearch, OptionsType } from 'client/types';
import { Dispatch, SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Entry, ParserOutput, ParserOutputKey, ParserOutputKeys } from "new_types/api_types";
import {useEntryDispatch} from "@components/context/EntryContext";
import { useRouter } from 'next/router';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import AddCircle from "@mui/icons-material/AddCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    GridColDef,
    GridRowsProp,
    DataGrid,
    GridRowId,
    useGridApiRef,
    GridCsvExportOptions,
    GridToolbarExport,
    GridToolbarContainer,
    useGridApiContext,
    GridColumnVisibilityModel
} from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
// import EntryDialog from "@components/GraphView/EntryDialog";
import Toolbar from "@mui/material/Toolbar";

interface SelectedRowParams {
    id: GridRowId;
    field?: string;
}

interface EntryPaginationTable {
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    handleEntryAction: (action: string, payload: Entry | undefined) => void
    entries: Entry[]
}

const EntryPaginationTable = ({
    isAdminOrModerator,
    handleEntryAction,
    entries
}: EntryPaginationTable) => {


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
    },[entryMap, selectedRow, handleEntryAction])
    
    // console.log("entryMap", entryMap)
    const rows = useMemo<GridRowsProp>(()=>{
        return entries.map((row) => {
            // return {
            //     amount: row?.amount,
            //     item: row?.item,
            //     price: row?.price,
            //     date: (row?.Day ?? "") + " " + (row?.month == undefined ? "" : months[parseInt(row?.month) - 1]) + " " + row?.date_year,
            //     pounds: row?.currency?.pounds ?? 0,
            //     shillings: row?.currency?.shillings ?? 0,
            //     pennies: row?.currency?.pennies ?? 0,
            //     pounds_ster: row?.sterling?.pounds ?? 0,
            //     shillings_ster: row?.sterling?.shillings ?? 0,
            //     pennies_ster: row?.sterling?.pennies ?? 0,
            //     account_name: row?.account_name,
            //     reel: row?.ledger?.reel ? Number(row.ledger.reel) : 0,
            //     folio_page: row?.ledger?.folio_page ? Number(row.ledger.folio_page) : 0,
            //     folio_year: row?.ledger?.folio_year,
            //     store: row?.store,
            //     store_owner: row?.store_owner,
            //     debit_or_credit: row?.debit_or_credit,
            //     Quantity: row?.Quantity,
            //     Commodity: row?.Commodity,
            //     id: row?._id,
            // }
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
    console.log(cols)
    console.log(hiddenCols)
    return (
        <Box sx={{height:"80vh", width:'100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
            <Paper sx={{height: '100%',width: '100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                <Stack sx={{ borderBottom: 1, borderColor: 'divider', p: 1, }}>
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
                                >
                                    Create
                                </Button>
                    
                                <Button
                                    onClick={()=> handleACtionClick("Edit")}
                                    disabled={!selectedRow}
                                    hidden={!isAdminOrModerator}
                                    variant="contained"
                                    color={"warning"}
                                >
                                    edit
                                </Button>
                    
                                <Button
                                    onClick={()=> handleACtionClick("Delete")}
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
                </Stack>
                    <DataGrid
                        editMode={'row'}
                        rows={rows ?? []}
                        columns={columns}
                        // columns={cols}
                        // columnVisibilityModel={hiddenCols}
                        autoPageSize
                        getRowId={(row) => row.id}
                        // isRowSelectable={(params) => params && isAdminOrModerator && editable}
                        // disableRowSelectionOnClick
                        // rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        components={{Toolbar: ExportToolBar}}
                        componentsProps={{
                            cell: { onFocus: handleCellFocus },
                            toolbar: {csvOptions: {allColumns: true}}
                        }}
                    />
            </Paper>
        </Box>
    );
};

export default EntryPaginationTable;

const ExportToolBar = () => {
    // const gridRef = useGridApiContext()
    // const handleExport = (options: GridCsvExportOptions) => gridRef.current.exportDataAsCsv(options)
    return (
        <GridToolbarContainer>
            <GridToolbarExport>
            </GridToolbarExport>
        </GridToolbarContainer>
    )
}

function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const toDisplayCase = (k:string) => {
    return k.replace(/(_|^)([^_]?)/g, function(_, prep, letter) {
        return (prep && ' ') + letter.toUpperCase();
    });
}
type ExcludedField = keyof Pick<ParserOutput,
    "amount_is_combo"|
    "price_is_combo"|
    "commodity_totaling_contextless"|
    "currency_totaling_contextless"|
    "errors"|
    "error_context"|
    "context"|
    "type"|
    "liber_book"|
    "phrases"|
    "mentions"|
    "amount_is_combo" |
    "price_is_combo" |
    "phrases" |
    "entry_id" |
    "farthings_ster" |
    "farthings" |
    "Marginalia" |
    "currency_type" |
    "currency_colony" |
    "currency_totaling_contextless" |
    "commodity_totaling_contextless" |
    "Date Year" |
    "_Month" |
    "Day" |
    "context" |
    "people" |
    "type" |
    "liber_book" |
    "mentions" |
    "folio_reference" |
    "text_as_parsed" |
    "original_entry" |
    "tobacco_location" |
    "tobacco_amount_off" |
    "tobacco_marks" |
    "tobacco_entries" 
    >
type IncludedField = keyof Omit<ParserOutputKey, ExcludedField>

const noDisplay = [
    "amount_is_combo",
    "price_is_combo",
    "commodity_totaling_contextless",
    "currency_totaling_contextless",
    "errors",
    "error_context",
    "context",
    "type",
    "liber_book",
    "phrases",
    "mentions",
    "amount_is_combo" ,
    "price_is_combo" ,
    "phrases" ,
    "entry_id" ,
    "farthings_ster" ,
    "farthings" ,
    "Marginalia" ,
    "currency_type" ,
    "currency_colony" ,
    "currency_totaling_contextless" ,
    "commodity_totaling_contextless" ,
    "Date Year" ,
    "_Month" ,
    "Day" ,
    "context" ,
    "people" ,
    "type" ,
    "liber_book" ,
    "mentions" ,
    "folio_reference" ,
    "text_as_parsed" ,
    "original_entry" ,
    "tobacco_location" ,
    "tobacco_amount_off" ,
    "tobacco_marks" ,
    "tobacco_entries"
] as Array<ExcludedField>

const excludedFields = new Set<ParserOutputKey>(noDisplay)

const fieldNames = Object.fromEntries(
    ParserOutputKeys
        .filter(k=>!excludedFields.has(k))
        .map(k => [k as IncludedField, toDisplayCase(k as string)])
)

const cols: GridColDef[] = Object.entries(fieldNames).map(([f, n]) => ({
    field: f,
    headerName: n,
})) //+ [{field: }]

const hiddenCols: GridColumnVisibilityModel = Object.fromEntries(noDisplay.map(n => [n, false]))

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
