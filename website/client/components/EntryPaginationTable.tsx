import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useState, useMemo, useCallback } from 'react';
import {
    Entry,
    // EntryKey, EntryStringArrayKey, EntryObjKey, EntryBooleanKey,
    // EntryKeys, EntryStringArrayKeys, EntryObjKeys, EntryBooleanKeys
} from "new_types/api_types";
import Button from "@mui/material/Button";
import AddCircle from "@mui/icons-material/AddCircle";
import DownloadIcon from '@mui/icons-material/Download';
import {
    GridColDef,
    GridRowsProp,
    DataGrid,
    GridRowId,
    GridToolbar,
    // GridToolbarExport,
    GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import {
    colNames,
    complexFields,
    entryToRow,
    fieldNames,
    hiddenFields,
    IncludedField, splitFields
} from "../entryUtils";
import { Typography } from '@mui/material';

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

const ImportIcon = () => {
    return <DownloadIcon color={'secondary'}/>
}

const EntryPaginationTable = ({
    isAdminOrModerator,
    handleEntryAction,
    entries
}: EntryPaginationTable) => {

    // const router = useRouter();
    const [selectedRow, setSelectedRow] =
        useState<SelectedRowParams| null>(null);
    
    const entryMap = useMemo<{[key:string]: Entry} | undefined>(()=>{
        if (!entries.length) return {id: {}}
        return Object.fromEntries(entries.map(e=>[e._id, e]))
    }, [entries])
    
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
    
    const cols: GridColDef[] = useMemo(()=> (
        colNames.map(str => (complexFields.has(str) || splitFields.has(str)? {
            field: str,
            headerName: str,
            flex: flexOneFields.has(str) ? 1 : flexHalfFields.has(str) ? .2 : .5,
            disableExport: !splitFields.has(str)
        } :  {
            field: str,
            headerName: fieldNames[str as IncludedField],
            flex: flexOneFields.has(str) ? 1 : flexHalfFields.has(str) ? .2 : .5,
        }
    ))), [])
    
    const hiddenCols: GridColumnVisibilityModel = Object.fromEntries(
        [...hiddenFields.values(), ...splitFields.values()].map(n => [n, false])
    )
    
    const handleCellFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        const row = event.currentTarget.parentElement;
        const id = row!.dataset.id!;
        const field = event.currentTarget.dataset.field!;
        // console.log(id)
        setSelectedRow({ id, field });
    }, [setSelectedRow]);

    const handleACtionClick = useCallback((action: string) => {
        if (entryMap && selectedRow?.id){
            handleEntryAction(action, entryMap[selectedRow.id])
        }
        else{
            handleEntryAction(action, undefined)
        }
    },[entryMap, selectedRow, handleEntryAction])
    
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
                            <Typography fontWeight={"500"}>
                                View
                            </Typography>
                        </Button>
                        {isAdminOrModerator &&
                            (<>
                                <Button
                                    onClick={() => handleACtionClick("Create")}
                                    variant="contained"
                                    startIcon={<AddCircle sx={{color: "secondary.contrastText"}} />}
                                    hidden={!isAdminOrModerator}
                                >
                                    <Typography fontWeight={"500"} color="secondary.contrastText">
                                        Create
                                    </Typography>
                                </Button>
                    
                                <Button
                                    onClick={()=> handleACtionClick("Edit")}
                                    disabled={!selectedRow}
                                    hidden={!isAdminOrModerator}
                                    variant="contained"
                                    color={"warning"}
                                >
                                    <Typography fontWeight={"500"}>
                                        edit
                                    </Typography>
                                </Button>
                    
                                <Button
                                    onClick={()=> handleACtionClick("Delete")}
                                    disabled={!selectedRow}
                                    hidden={!isAdminOrModerator}
                                    variant="contained"
                                    color={"error"}
                                >
                                    <Typography fontWeight={"500"}>
                                        Delete
                                    </Typography>
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
                            Toolbar: GridToolbar,
                            // Toolbar:  GridToolbarExport,
                            ExportIcon: ImportIcon
                        }}
                        componentsProps={{
                            cell: { onFocus: handleCellFocus },
                            toolbar: {
                                csvOptions: {
                                // fields: [...visibleFields.values(), ...hiddenFields.values()]
                                    allColumns: true
                                },
                                
                            },
                        }}
                    />
            </Paper>
        </Box>
    );
};

export default EntryPaginationTable;

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
