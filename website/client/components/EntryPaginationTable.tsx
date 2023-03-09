import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useState, useMemo, useCallback } from 'react';
import {
    Entry,
    EntryKey, EntryStringArrayKey, EntryObjKey, EntryBooleanKey,
    EntryKeys, EntryStringArrayKeys, EntryObjKeys, EntryBooleanKeys
} from "new_types/api_types";
import Button from "@mui/material/Button";
import AddCircle from "@mui/icons-material/AddCircle";
import {
    GridColDef,
    GridRowsProp,
    DataGrid,
    GridRowId,
    // GridToolbar,
    GridToolbarExport,
    GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";

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

    // const router = useRouter();
    const [selectedRow, setSelectedRow] =
        useState<SelectedRowParams| null>(null);
    
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
            return entryToRow(row)
            // if (!row) return {}
            // return {
            //     AccountName: row?.account_name,
            //     "Dr/Cr": row?.debit_or_credit,
            //     Amount: row?.amount,
            //     Item: toTitleCase((row?.item ?? "")),
            //     // AccountHolderID: row?.accountHolderID,
            //     Date: (row?.Day ?? "") + " " + (row?.month == undefined ? "" : months[parseInt(row?.month) - 1]) + " " + row?.date_year,
            //     Owner: row?.store_owner,
            //     // Comments: row?.meta?.comments,
            //     // Colony: row?.money?.colony,
            //     Store: row?.store,
            //     Quantity: row?.Quantity,
            //     Commodity: row?.Commodity,
            //     Currency: moneyToString(row?.currency?.pounds, row?.currency?.shillings, row?.currency?.pennies, row?.currency?.farthings),
            //     Sterling: moneyToString(row?.sterling?.pounds, row?.sterling?.shillings, row?.sterling?.pennies, row?.sterling?.farthings),
            //     // Ledger: row?.ledger?.folio_year,
            //     Page: row?.ledger?.folio_page,
            //     id: row?._id,
            //     // Hidden
            //     "Date Year": row?.date_year,
            //     Day: row.Day,
            //     Marginalia: row.Marginalia,
            //     Month: row.month,
            //     "Currency Type": row.currency_type,
            //     // Farthings: row.farthings
            //
            //
            // }
        }) || [];
    }, [entries])
    // console.log('rows',rows)
    // console.log('hidden cols', hiddenCols)
    // console.log(cols)
    // console.log(fieldNames)
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
                        rows={rows}
                        columns={cols}
                        // columns={columns}
                        initialState={{columns: {columnVisibilityModel: hiddenCols}}}
                        // columnVisibilityModel={hiddenCols}
                        autoPageSize
                        getRowId={(row) => row.id}
                        // isRowSelectable={(params) => params && isAdminOrModerator && editable}
                        // disableRowSelectionOnClick
                        // rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        components={{
                            // Toolbar: GridToolbar
                            Toolbar:  GridToolbarExport
                        }}
                        componentsProps={{
                            cell: { onFocus: handleCellFocus },
                            toolbar: {
                                csvOptions: {
                                // fields: [...visibleFields.values(), ...hiddenFields.values()]
                                allColumns: true
                            }}
                        }}
                    />
            </Paper>
        </Box>
    );
};

export default EntryPaginationTable;

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

const entryToRow = (entry: Entry) => {
    const nonComplex: Partial<Entry> = Object.fromEntries(Object.entries(entry)
        .filter(([k, v]) => !!v && (hiddenFields.has(k as HiddenField) || visibleFields.has(k as VisibleField)))
        .map(e => e))
    // console.log(nonComplex)
    const complex = [
        ['Item', toTitleCase((entry?.item ?? ""))],
        ['Currency', moneyToString(entry?.currency?.pounds, entry?.currency?.shillings, entry?.currency?.pennies, entry?.currency?.farthings)],
        ['Sterling', moneyToString(entry?.sterling?.pounds, entry?.sterling?.shillings, entry?.sterling?.pennies, entry?.sterling?.farthings)],
        ['Date', (entry?.Day ?? "") + " " + (entry?.month == undefined ? "" : months[parseInt(entry?.month) - 1]) + " " + entry?.date_year],
        ['Page', entry?.ledger?.folio_page],
        ['id', entry._id]
    ]
    return {...Object.fromEntries(complex), ...nonComplex }// Object.fromEntries(complex)
}

type ExcludedField = Extract<EntryKey, EntryStringArrayKey | EntryObjKey | EntryBooleanKey>
type VisibleField = Extract<EntryKey,
    'account_name'| 'amount'| 'Quantity'| 'item'| 'Commodity' | 'store'| 'store_owner'
    >
type HiddenField = Exclude<EntryKey, VisibleField | ExcludedField>
type IncludedField = Extract<EntryKey, VisibleField | HiddenField>
type FieldNames = {
    [k in IncludedField]: string;
};

const excludedFields = new Set<ExcludedField>([
    ...EntryBooleanKeys.values(),
    ...EntryStringArrayKeys.values(),
    ...EntryObjKeys.values()
] as ExcludedField[])

const visibleFields = new Set<VisibleField>([
    'account_name', 'amount', 'Quantity', 'item', 'Commodity', 'store', 'store_owner',
]);

const hiddenFields = new Set<HiddenField>(EntryKeys
    .filter(k => !excludedFields.has(k as ExcludedField) && !visibleFields.has(k as VisibleField)
) as HiddenField[])

const fieldNames: FieldNames = Object.fromEntries(EntryKeys
    .filter(k=>!excludedFields.has(k as ExcludedField))
    .map(k => [k as EntryKey, k !== 'debit_or_credit' ? toDisplayCase(k as string) : 'Dr/Cr'])
) as FieldNames

const complexFields = new Set<string>(['Currency', 'Sterling', 'Date', 'Page'])

const hiddenCols: GridColumnVisibilityModel = Object.fromEntries(
    [...hiddenFields.values()].map(n => [n, false])
)

const flexOneFields = new Set<string>([
    "Account Name",
    "Relevant Item",
    "Item",
    "Store Owner",
    "Store"
    // "Purchaser",
    // "Comments",
])

const flexHalfFields = new Set<string>([
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
])

const colNames: string[] = [...complexFields.values(), ...hiddenFields.values(), ...visibleFields.values()]

const cols: GridColDef[] = colNames.map(str => (
    complexFields.has(str) ? {
        field: str,
        headerName: str,
        flex: flexOneFields.has(str) ? 1 : flexHalfFields.has(str) ? .2 : .5,
        disableExport: true
    } :  {
        field: str,
        headerName: fieldNames[str as IncludedField],
        flex: flexOneFields.has(str) ? 1 : flexHalfFields.has(str) ? .2 : .5,
    }
))

// const columnNames: string[] = [
//     'Account Name',
//     'Amount',
//     'Item',
//     'Date',
//     "Store",
//     'Dr/Cr',
//     'Quantity',
//     'Commodity',
//     'Currency',
//     'Sterling',
//     'Owner',
//     'Page',
// ];
//
// const columns: GridColDef[] = columnNames.map((str: string) : GridColDef => ({
//     field: str.split(" ").join(""),
//     headerName: str,
//     // editable: isAdminOrModerator,
//     flex: flexOneFields.has(str) ? 1 : flexHalfFields.has(str) ? .2 : .5
// }));
