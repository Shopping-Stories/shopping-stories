import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { Dispatch } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { ParserOutput, ParserOutputKey, ParserOutputKeys, ParserStringKeys, ParserNumberKeys } from 'new_types/api_types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface ParserEditorDialog {
    row: rowType | null,
    setRow: Dispatch<rowType|null>,
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

// const rowTypeKeys = ["Errors", "Account Name", "Dr/Cr", "Amount", "Item", "Date", "Owner", "Quantity", "Commodity", "Pounds", "Shilling", "Pence", "Farthings", "Currency Type", "EntryID", "Reel", "FolioPage", "original", "id"] as Array<rowTypeKey>
const oldKeyNewKeyMap: Record<string, string> = {"errors": "Errors", "account_name": "Account Name", "debit_or_credit": "Dr/Cr", "amount": "Amount", "item": "Item", "folio_year": "Date", "store_owner": "Owner", "Quantity": "Quantity", "Commodity": "Commodity", "currency_type": "Currency Type", "entry_id": "EntryID", "reel": "Reel", "folio_page": "FolioPage" }
const splitPlaces = new Set<origKey>(["original_entry", "price", "date", "farthings_ster", "currency_colony", "tobacco_amount_off", "entry_id", "Day", "Commodity", "error_context"] as Array<origKey>)
const oldCurrNewCurrMap: Record<string, string> = {"pounds": "Pounds", "pounds_ster": "Pounds", "shillings": "Shilling", "shillings_ster": "Shilling", "pennies": "Pence", "pennies_ster": "Pence", "farthings": "Farthings", "farthings_ster": "Farthings"}
const currency_keys = new Set<origKey>(["pounds_ster", "pounds", "shillings_ster", "shillings", "pennies", "pennies_ster", "farthings", "farthings_ster"])
const noDisplay = new Set<origKey>(["context", "liber_book", "amount_is_combo", "price_is_combo", "commodity_totaling_contextless", "currency_totaling_contextless"] as Array<origKey>)
const notEditable = new Set<origKey>(["error_context", "type", "phrases", "mentions", "tobacco_entries", "tobacco_marks"] as Array<origKey>)
const longDisplay = new Set<origKey>(["text_as_parsed", "original_entry", "people", "mentions", "error_context", "errors"] as Array<origKey>)
const errorKeys = ["errors", "error_context"] as Array<origKey>
const titles = ["Entry Text", "Entry Info", "Extra Entry Info (Typically null values)", "Money (Sterling)", "Money (Currency)", "Tobacco", "Ledger Info", "Date Info", "Commodity Info", "Other nouns found in entry"]

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const ParserEditorDialog = (props: ParserEditorDialog) => {
    const {
        row,
        setRow,
        setClose
    } = props

    const nrow = JSON.parse(JSON.stringify(row));
    

    const deleteRow = () => {
        setRow(null);
    }
    

    const intHandleClose = () => {
        setRow(nrow!)
    }

    const getFormsFromRow = (row?: rowType) => {
        if (row == null || row == undefined || row?.original == null || row?.original == undefined) {
            return null
        }
        
        let out: Array<JSX.Element> = [] as (JSX.Element)[]
        let errorNotPresent: boolean = ((row?.original!["errors"] == null) && (row?.original!["error_context"] == null))
        let splitTimes: number = 0
        let mtop = "1vh"
    
        const onRowValueChange = (key: origKey, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
            // Handles editing strings
            if (ParserStringKeys.has(key)) {
                console.log("String key");
                (row.original![key] as unknown as string) = event.target.value
                if (Object.keys(oldKeyNewKeyMap).includes(key as string)) {
                    (row[oldKeyNewKeyMap[key] as rowTypeKey] as string) = event.target.value
                }
            }
            // Handles editing numbers
            else if (ParserNumberKeys.has(key)) {
                console.log("Number key detected");
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
            // Handles setting the old value to null
            else if ((event.target.value == null) || (event.target.value == "")) {
                console.log("Deleting null key detected");
                if (key == "errors") {
                    delete row.original!["error_context"]
                }
                delete row[oldKeyNewKeyMap[key] as rowTypeKey]
                delete row.original![key]
                console.log(row)
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
                if (origKeys[a] == "type" as origKey) {
                    out.push(
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={row?.original![origKeys[a]] ?? ""}
                                label="Type"
                                onChange={(event) => {onRowValueChange(origKeys[a], event)}}
                                sx={{ padding: "0vh", marginTop: "1.3vh", width: "10vw" }}
                            >
                                <MenuItem value={"Cash"}>Cash</MenuItem>
                                <MenuItem value={"Liber"}>Liber</MenuItem>
                                <MenuItem value={"Ender"}>Ender</MenuItem>
                            </Select>
                        </FormControl>
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
                out.push(<Typography sx={{ marginTop: "2vh", marginLeft: "0.2vw", marginBottom: "0.2vh" }} key={splitTimes}>{titles[splitTimes++]}</Typography>)
            }
        }
    
        return out
    }

    // console.log("Dialog")
    // console.log(nrow)
    // console.log(nrow?.Amount)
    getFormsFromRow(nrow!)

    return (
        <Dialog
            fullScreen
            open={nrow != null}
            onClose={setClose}
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
                    <IconButton color="inherit" aria-label="delete" onClick={(_event) => {deleteRow()}}>
                        <Delete/>
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Editing Row
                    </Typography>
                    <Button autoFocus color="inherit" onClick={intHandleClose}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ margin: "1vh", marginTop: "0vh" }}>
                {getFormsFromRow(nrow)}
            </Box>
        </Dialog>
    )
}


export default ParserEditorDialog
