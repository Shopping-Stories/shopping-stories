import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { DataGrid, GridColDef, GridRow } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { ParserOutput, ParserOutputKey, ParserOutputKeys, ParserStringKeys, ParserNumberKeys } from 'new_types/api_types';

interface ParserEditorDialog {
    row: rowType | null,
    setRow: Dispatch<rowType>,
    setClose: () => void
}

export interface rowType {
    "Errors"?: string,
    'Account Name'?: string,
    'Dr/Cr'?: string,
    'Amount'?: string,
    'Item'?: string,
    // 'Account Holder ID',
    'Date'?: string,
    'Owner'?: string,
    // 'Store',
    // 'Comments',
    // 'Colony',
    'Quantity'?: string,
    'Commodity'?: string,
    'Pounds'?: number,
    'Shilling'?: number,
    'Pence'?: number,
    'Farthings'?: number,
    "Currency Type"?: string,
    'EntryID'?: string,
    // 'Ledger Year',
    'Reel'?: number,
    'FolioPage'?: number
    original?: ParserOutput
    id?: number
}

type origKey = ParserOutputKey
const origKeys = ParserOutputKeys
type rowTypeKey = keyof rowType

const rowTypeKeys = ["Errors", "Account Name", "Dr/Cr", "Amount", "Item", "Date", "Owner", "Quantity", "Commodity", "Pounds", "Shilling", "Pence", "Farthings", "Currency Type", "EntryID", "Reel", "FolioPage", "original", "id"] as Array<rowTypeKey>
const oldKeyNewKeyMap: Record<string, string> = {"errors": "Errors", "account_name": "Account Name", "debit_or_credit": "Dr/Cr", "amount": "Amount", "item": "Item", "folio_year": "Date", "store_owner": "Owner", "Quantity": "Quantity", "Commodity": "Commodity", "currency_type": "Currency Type", "entry_id": "EntryID", "reel": "Reel", "folio_page": "FolioPage" }
const splitPlaces = new Set<origKey>(["context", "price", "date", "farthings_ster", "currency_type", "entry_id", "Day", "Commodity", "error_context"] as Array<origKey>)
const oldCurrNewCurrMap: Record<string, string> = {"pounds": "Pounds", "pounds_ster": "Pounds", "shillings": "Shilling", "shillings_ster": "Shilling", "pennies": "Pence", "pennies_ster": "Pence", "farthings": "Farthings", "farthings_ster": "Farthings"}
const currency_keys = new Set<origKey>(["pounds_ster", "pounds", "shillings_ster", "shillings", "pennies", "pennies_ster", "farthings", "farthings_ster"])
const noDisplay = new Set<origKey>(["amount_is_combo", "price_is_combo", "commodity_totaling_contextless", "currency_totaling_contextless"] as Array<origKey>)
const notEditable = new Set<origKey>(["context", "error_context", "type", "liber_book", "phrases", "mentions"] as Array<origKey>)
const longDisplay = new Set<origKey>(["people", "mentions", "error_context", "errors"] as Array<origKey>)
const errorKeys = ["errors", "error_context"] as Array<origKey>
const titles = ["Entry Text", "Entry Info", "Extra Entry Info (Typically null values)", "Money (Sterling)", "Money (Currency)", "Ledger Info", "Date Info", "Commodity Info", "Other nouns found in entry"]

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const getFormsFromRow = (row?: rowType) => {
    if (row == null || row == undefined || row?.original == null || row?.original == undefined) {
        return null
    }
    let out: Array<JSX.Element> = [] as (JSX.Element)[]
    let errorNotPresent: boolean = ((row?.original!["errors"] == null) && (row?.original!["error_context"] == null))
    let splitTimes: number = 0
    let mtop = "1vh"

    const onRowValueChange = (key: origKey, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (ParserStringKeys.has(key)) {
            (row.original![key] as unknown as string) = event.target.value
            if (Object.keys(oldKeyNewKeyMap).includes(key as string)) {
                (row[oldKeyNewKeyMap[key] as rowTypeKey] as string) = event.target.value
            }
        }
        else if (ParserNumberKeys.has(key)) {
            let val = parseInt(event.target.value);
            (row.original![key] as unknown as number) = val
            if (Object.keys(oldKeyNewKeyMap).includes(key as string)) {
                (row[oldKeyNewKeyMap[key] as rowTypeKey] as number) = val
            }
            else if (currency_keys.has(key)) {
                if (((row.original!.pounds_ster != null) && (row.original!.pounds != null)) || ((row.original!.shillings_ster != null) && (row.original!.shillings != null)) || ((row.original!.pennies_ster != null) && (row.original!.pennies != null)) || ((row.original!.farthings_ster != null) && (row.original!.farthings != null))) {
                    if (key.includes("ster")) {

                    }
                    else {
                        (row[oldCurrNewCurrMap[key] as rowTypeKey] as number) = val
                    }
                }
                else {
                    (row[oldCurrNewCurrMap[key] as rowTypeKey] as number) = val
                }
            }
        }
        else if ((event.target.value == null) || (event.target.value == "")) {
            delete row[oldKeyNewKeyMap[key] as rowTypeKey]
        }
        else {
            console.log("Editing " + key + " is currently unsupported")
        }
    }

    if (!errorNotPresent) {
        out.push(<Typography sx={{ marginTop: "1vh", marginLeft: "0.2vw" }} key={-1}>Error Info</Typography>)
    }

    for (let a in origKeys) {
        if (errorKeys.includes(origKeys[a]) && errorNotPresent) {

        }
        else if (notEditable.has(origKeys[a])) {
            if (origKeys[a] == "context" as origKey) {
                out.push(
                    <TextField
                        label={origKeys[a]}
                        value={(row?.original![origKeys[a]] as unknown as string[][]).map((value) => value[0]).join(" ")}
                        onChange={() => { }}
                        key={origKeys[a]}
                        sx={{ padding: "0.3vh", marginTop: mtop, width: "30vw" }}
                    />
                )
            }
            else {
                if (longDisplay.has(origKeys[a])) {
                    out.push(
                        <TextField
                            label={origKeys[a]}
                            value={row?.original![origKeys[a]] ?? ""}
                            onChange={() => { }}
                            key={origKeys[a]}
                            sx={{ padding: "0.3vh", marginTop: mtop, width: "20vw" }}
                        />
                    )
                }
                else {
                    out.push(
                        <TextField
                            label={origKeys[a]}
                            value={row?.original![origKeys[a]] ?? ""}
                            onChange={() => { }}
                            key={origKeys[a]}
                            sx={{ padding: "0.3vh", marginTop: mtop, width: "10vw" }}
                        />
                    )
                }

            }
        }
        else if (!noDisplay.has(origKeys[a])) {
            if (longDisplay.has(origKeys[a])) {
                out.push(
                    <TextField
                        label={origKeys[a]}
                        defaultValue={row?.original![origKeys[a]]}
                        key={origKeys[a]}
                        onChange={(event) => onRowValueChange(origKeys[a], event)}
                        sx={{ padding: "0.3vh", marginTop: mtop, width: "20vw" }}
                    />
                )
            }
            else {
                out.push(
                    <TextField
                        label={origKeys[a]}
                        defaultValue={row?.original![origKeys[a]]}
                        key={origKeys[a]}
                        onChange={(event) => onRowValueChange(origKeys[a], event)}
                        sx={{ padding: "0.3vh", marginTop: mtop, width: "10vw" }}
                    />
                )
            }
        }

        if (splitPlaces.has(origKeys[a])) {
            out.push(<div />)
            out.push(<Typography sx={{ marginTop: "2vh", marginLeft: "0.2vw" }} key={splitTimes}>{titles[splitTimes++]}</Typography>)
        }
    }

    return out
}


const ParserEditorDialog = (props: ParserEditorDialog) => {
    const {
        row,
        setRow,
        setClose
    } = props
    const nrow = JSON.parse(JSON.stringify(row))

    const intHandleClose = () => {
        setRow(nrow!)
    }

    // console.log("Dialog")
    // console.log(nrow)
    // console.log(nrow?.Amount)
    getFormsFromRow(nrow!)

    return (
        <Dialog
            fullScreen
            open={nrow != null}
            onClose={intHandleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={setClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Editing Row
                    </Typography>
                    <Button autoFocus color="inherit" onClick={intHandleClose}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            {/* App goes here */}
            <Box sx={{ margin: "1vh", marginTop: "0vh" }}>
                {getFormsFromRow(nrow)}
            </Box>
        </Dialog>
    )
}


export default ParserEditorDialog
