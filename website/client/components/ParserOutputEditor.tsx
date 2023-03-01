import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ParserOutput } from "new_types/api_types";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Typography  from '@mui/material/Typography';
import {rowType} from './ParserEditorDialog';
import { moneyToString } from './EntryPaginationTable';

interface ParserOutputEditor {
    url: string;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    setErrorRows: Dispatch<SetStateAction<string>>;
    setSelectedRow: Dispatch<SetStateAction<rowType|null>>
    rows: GridRowsProp
    editRows: Dispatch<SetStateAction<GridRowsProp>>
}

type ParserOutputQueryResult = Array<ParserOutput>;
type ActualParserOutputQueryResult = Array<Array<ParserOutput>>;

interface S3ParserOutput {
    entries: ParserOutputQueryResult;
}

// For now we just add all the arrays together
const getData = async (url: string): Promise<S3ParserOutput> => {
    const res = await fetch(url);
    let qres = (JSON.parse(await res.text())) as ActualParserOutputQueryResult;
    // console.log("QRES")
    // console.log(qres)
    let arr: any;
    let entry: any;
    let dat = new Array<ParserOutput>();
    for (arr in qres) {
        arr = qres[arr]
        // console.log(arr)
        for (entry in arr) {
            dat.push(arr[entry]);
        }
    }

    let out: S3ParserOutput = {entries: dat};
    return out;
}

const ParserOutputEditor = (props: ParserOutputEditor) => {
    const {
        url,
        setIsLoading,
        setErrorRows,
        setSelectedRow,
        rows,
        editRows
    } = props;
    
    const {data, isLoading} =
    useQuery(
        ["entries", url],
        () => {
            // console.log("running request.") 
            let out =  getData(url)
            
            // Fix an error in the parser here for now
            out.then(
                (value: S3ParserOutput) => {
                    let error_rows = ""
                    let entry: any
                    for (entry in value.entries) {
                        if (value.entries[entry].item == "Currency" && value.entries[entry].errors == null) {
                            value.entries[entry].errors = ["Check Item"]
                        }
                        if (value.entries[entry].errors != null) {
                            error_rows += entry.toString() + ", "
                        }
                        else if ((value.entries[entry].currency_type == null) && (value.entries[entry].shillings != null)) {
                            // console.log(value.entries[entry])
                            value.entries[entry].currency_type = "Currency"
                        }
                    }
                    setErrorRows(error_rows);
                    return value;
                }
            )
            
            // console.log(out)
            return out
        },
    );

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (setIsLoading !== undefined) {
            setIsLoading(isLoading);
        }
    }, [isLoading, setIsLoading]);

    const [value, setValue] = useState('');

    useEffect(() => {
        if (editRows !== undefined) {
            // console.log(data?.entries);
            let n = 0;
            let thing: GridRowsProp = data?.entries.map((row) => {return {
                Errors: row?.errors,
                AccountName: row?.account_name,
                "Dr/Cr": row?.debit_or_credit,
                Amount: row?.amount,
                Item: (row?.item ?? ""),
                // AccountHolderID: row?.accountHolderID,
                Date: row?.folio_year,
                Owner: row?.store_owner,
                // Store: row?.meta?.store,
                // Comments: row?.meta?.comments,
                // Colony: row?.money?.colony,
                Quantity: row?.Quantity,
                Commodity: row?.Commodity,
                Money: moneyToString(row?.pounds, row?.shillings, row?.pennies, row?.farthings),
                CurrencyType: row?.currency_type,
                EntryID: row?.entry_id,
                // Ledger: row?.ledger?.folio_year,
                Reel: row?.reel,
                FolioPage: row?.folio_page,
                original: row,
                id: n++
            }}) || [];
            
            editRows(thing);
        }
    }, [data?.entries, editRows]);
    
    const columnNames: string[] = [
        "Errors",
        'Account Name',
        'Amount',
        'Item',
        // 'Account Holder ID',
        'Date',
        'Owner',
        // 'Store',
        // 'Comments',
        // 'Colony',
        'Dr/Cr',
        'Quantity',
        'Commodity',
        'Money',
        "Currency Type",
        'EntryID',
        // 'Ledger Year',
        'Reel',
        'FolioPage',
        "id"
    ];

    const handlePopoverClose = () => {
        setAnchorEl(null);
      };
    

    const mouseOverCell = (event: React.MouseEvent<HTMLElement>) => {
        const field = event.currentTarget.dataset.field!;
        const id = parseInt(event.currentTarget.parentElement!.dataset.id!);
        const row = rows[id];
        setValue(row[field]);
        setAnchorEl(event.currentTarget);
    }

    const handleRowSelect = (event: React.MouseEvent<HTMLElement>) => {
        let id = parseInt(event.currentTarget.dataset.id!)
        setSelectedRow(rows[id])
    }

    const open = Boolean(anchorEl);

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
                "Comments"
            ].includes(str) ? 1 
            : ([
                "Reel", 
                "EntryID", 
                "Quantity", 
                "Commodity", 
                "Colony", 
                "$ Pounds", 
                "$ Shilling", 
                "$ Pence", 
                "$ Farthings", 
                '£ Pounds',
                '£ Shilling',
                '£ Pence',
                '£ Farthings',
                "Amount",
                "Dr/Cr",
                "id"
            ].includes(str) ? 0.3 : 0.5)}
    });
    // console.log(data?.entries)
    return (
        <Box sx={{height: "73vh", flexDirection: "column", display: "flex", alignItems: "stretch"}}>
            <Paper sx={{height: '100%',width: '100%', overflow: 'hidden' }}>
            <DataGrid rows={rows} columns={columns} autoPageSize getRowId={(row) => row.id} 
                componentsProps={{
                    cell: {
                        onMouseEnter: mouseOverCell,
                        onMouseLeave: handlePopoverClose
                    },
                    row: {
                        onClick: handleRowSelect
                    }
                }}
            />
            <Popover
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
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{value}</Typography>
            </Popover>
            </Paper>
        </Box>
    );

}

export default ParserOutputEditor;