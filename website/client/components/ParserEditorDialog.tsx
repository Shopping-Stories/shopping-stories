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
import { ParserOutput, ParserOutputKey, ParserStringKeys, ParserStringArrayKeys, ParserNumberKeys, tmStrToTMs, TobaccoMark, tmToStr, parseStringArray, TobaccoEntry } from 'new_types/api_types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import TobaccoFields from './TobaccoFields';

interface ParserEditorDialog {
    row: rowType | null,
    setRow: Dispatch<rowType|null>,
    setClose: () => void,
    onDuplicate: Dispatch<rowType>
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
type rowTypeKey = keyof rowType

const origKeys = ["errors", "error_context", "context", "text_as_parsed", "original_entry", "store", "debit_or_credit", "account_name", "amount", "amount_is_combo", "item", "price", "type", "liber_book",  "price_is_combo", "phrases", "date", "pounds_ster", "shillings_ster", "pennies_ster", "farthings_ster", "pounds", "shillings", "pennies", "farthings", "currency_type", "currency_colony", "currency_totaling_contextless", "commodity_totaling_contextless", "tobacco_location", "tobacco_entries", "tobacco_marks", "tobacco_amount_off",  "Marginalia", "store_owner", "reel", "folio_reference", "folio_year", "folio_page", "entry_id", "Date Year", "_Month", "Day", "Quantity", "Commodity", "people", "mentions"] as Array<ParserOutputKey>;

// const rowTypeKeys = ["Errors", "Account Name", "Dr/Cr", "Amount", "Item", "Date", "Owner", "Quantity", "Commodity", "Pounds", "Shilling", "Pence", "Farthings", "Currency Type", "EntryID", "Reel", "FolioPage", "original", "id"] as Array<rowTypeKey>
const oldKeyNewKeyMap: Record<string, string> = {"errors": "Errors", "account_name": "Account Name", "debit_or_credit": "Dr/Cr", "amount": "Amount", "item": "Item", "folio_year": "Date", "store_owner": "Owner", "Quantity": "Quantity", "Commodity": "Commodity", "currency_type": "Currency Type", "entry_id": "EntryID", "reel": "Reel", "folio_page": "FolioPage" }
const splitPlaces = new Set<origKey>(["original_entry", "price", "date", "farthings_ster", "currency_colony", "tobacco_amount_off", "entry_id", "Day", "Commodity", "error_context"] as Array<origKey>)
const oldCurrNewCurrMap: Record<string, string> = {"pounds": "Pounds", "pounds_ster": "Pounds", "shillings": "Shilling", "shillings_ster": "Shilling", "pennies": "Pence", "pennies_ster": "Pence", "farthings": "Farthings", "farthings_ster": "Farthings"}
const currency_keys = new Set<origKey>(["pounds_ster", "pounds", "shillings_ster", "shillings", "pennies", "pennies_ster", "farthings", "farthings_ster"])
const noDisplay = new Set<origKey>(["context", "liber_book", "amount_is_combo", "phrases", "price_is_combo", "commodity_totaling_contextless", "currency_totaling_contextless"] as Array<origKey>)
const notEditable = new Set<origKey>(["error_context", "type", "tobacco_entries"] as Array<origKey>)
const longDisplay = new Set<origKey>(["text_as_parsed", "original_entry", "people", "mentions", "error_context", "errors"] as Array<origKey>)
const errorKeys = ["errors", "error_context"] as Array<origKey>
const titles = ["Entry Text", "Entry Info", "Extra Entry Info (Typically null values)", "Money (Sterling)", "Money (Currency)", "Tobacco", "Ledger Info", "Date Info", "Commodity Info", "Other nouns found in entry, separated by semicolons (e.g. Alexander; Johnson)"]

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
        setClose,
        onDuplicate
    } = props

    const nrow = React.useMemo(() => JSON.parse(JSON.stringify(row)), [row])
    
    let [tobEntries, setTobEntries] = React.useState([{}] as Array<TobaccoEntry>)

    const deleteRow = () => {
        setRow(null)
    }
    
    const [justSet, setJustSet] = React.useState(false);

    const intHandleClose = () => {
        setRow(nrow!)
        setMiniOpen(false)
    }

    const [miniOpen, setMiniOpen] = React.useState(false);

    const handleMiniOpen = () => {
        // console.log(tobEntries)
        setMiniOpen(true);
    };
  
    const handleMiniClose = () => {
        setMiniOpen(false);
    };

    const strNotNull = (value: string|undefined) => {
        return (value != undefined) && (value != "")
    }

    const notNull = (tobEntry: TobaccoEntry) => {
        return strNotNull(tobEntry.weight) || strNotNull(tobEntry.gross_weight) 
    }

    const handleMiniSave = () => {
        // console.log(tobEntries)
        if (tobEntries != undefined && tobEntries.length > 0 && (notNull(tobEntries[0]))) {
            if (nrow != undefined && nrow != null) {
                nrow!.original!["tobacco_entries"] = tobEntries
            }
            else {
            }
        }
        else {
            delete nrow!.original!["tobacco_entries"]
        }
        setJustSet(false);
        setMiniOpen(false);
    };


    const getFormsFromRow = (row?: rowType) => {
        if (row == null || row == undefined || row?.original == null || row?.original == undefined) {
            return null
        }
        
        let out: Array<JSX.Element> = [] as (JSX.Element)[]
        let errorNotPresent: boolean = ((row?.original!["errors"] == null) && (row?.original!["error_context"] == null))
        let splitTimes: number = 0
        let mtop = "1vh"
        let mtop2 = "1.3vh"

        if (!justSet) {
            if (row?.original!.tobacco_entries != undefined && row?.original!.tobacco_entries!.length != 0) {
                tobEntries = row?.original!.tobacco_entries!
            }
            else {
                tobEntries = [{}]
            }
        }

        const onRowValueChange = (key: origKey, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
            // Handles editing strings
            if (ParserStringKeys.has(key)) {
                // console.log("String key");
                (row.original![key] as unknown as string) = event.target.value
                if (Object.keys(oldKeyNewKeyMap).includes(key as string)) {
                    (row[oldKeyNewKeyMap[key] as rowTypeKey] as string) = event.target.value
                }
            }
            // Handles editing numbers
            else if (ParserNumberKeys.has(key)) {
                // console.log("Number key detected");
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
                // console.log("Deleting null key detected");
                if (key == "errors") {
                    delete row.original!["error_context"]
                }
                delete row[oldKeyNewKeyMap[key] as rowTypeKey]
                delete row.original![key]
                // console.log(row)
            }
            else if (ParserStringArrayKeys.has(key)) {
                // console.log("String array")
                try {
                    let strArr = parseStringArray(event.target.value);
                    (row[oldKeyNewKeyMap[key] as rowTypeKey] as unknown as Array<String>) = strArr
                }
                catch {
                    console.log("Bad format!")
                }
            }
            else if (key == "tobacco_marks") {
                console.log("Tobacco Marks")
                try {
                    let newTMs: string = event.target.value
                    let tmArr = tmStrToTMs(newTMs);
                    (row.original![key] as unknown as Array<TobaccoMark>) = tmArr
                }
                catch {
                    console.log("Bad format!")
                }
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
            else if (origKeys[a] == "tobacco_marks") {
                if (row.original!.tobacco_marks == undefined) {
                    row.original!.tobacco_marks = [];
                }
                out.push(
                    <TextField
                        label={origKeys[a]}
                        defaultValue={tmToStr(row?.original![origKeys[a]] as unknown as Array<TobaccoMark>)}
                        key={origKeys[a]}
                        onChange={(event) => onRowValueChange(origKeys[a], event)}
                        sx={{ padding: "0.3vh", marginTop: mtop, width: "10vw" }}
                    />
                )
            }
            else if (origKeys[a] == "tobacco_entries") {
                out.push(
                    <Button
                    key={origKeys[a]}
                    onClick={() => {
                        if (row?.original![origKeys[a]] == undefined) {

                        }
                        else {
                            setTobEntries(row?.original![origKeys[a]] as unknown as Array<TobaccoEntry>)
                        }
                        handleMiniOpen()
                        
                    }}
                    sx={{ padding: "0.3vh", marginTop: mtop2, height: "57px", width: "10vw", border: "2px solid", color: "#8f8f8f"}}
                    variant="outlined"
                    >
                        <Typography fontFamily={["Arial"]} sx={{color: "white"}}>Edit tobacco entries</Typography>
                        
                    </Button>
                )
            }
            else if (ParserStringArrayKeys.has(origKeys[a]) && origKeys[a] != "errors") {
                out.push(
                    <TextField
                        label={origKeys[a]}
                        defaultValue={row?.original![origKeys[a]] != undefined ? (row?.original![origKeys[a]] as unknown as Array<String>).join("; ") : ""}
                        key={origKeys[a]}
                        onChange={(event) => onRowValueChange(origKeys[a], event)}
                        sx={{ padding: "0.3vh", marginTop: mtop, width: "10vw" }}
                    />
                )
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
                                key={origKeys[a]}
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
                out.push(<div key={origKeys[a] + "div"} />)
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
            onClose={() => {
                setClose()
                setTobEntries([{}])
            }}
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
                    <Button color="inherit" onClick={() => onDuplicate(nrow!)}>Duplicate</Button>
                    <Button autoFocus color="inherit" onClick={intHandleClose}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <div>
                <Dialog open={miniOpen} onClose={handleMiniClose} fullWidth maxWidth={"lg"}>
                    <DialogTitle align='center'>Tobacco Marks</DialogTitle>
                    <DialogContent>
                    <DialogContentText align='center'>
                        This allows you to edit, add, and delete tobacco entries.
                    </DialogContentText>
                    <Box textAlign="center">
                        <Button sx={{margin: "0.5vh"}} variant='contained' onClick={() => {
                        setTobEntries(tobEntries.concat([{}]))
                        }}>
                            Add Tobacco Entry
                        </Button>
                    </Box>
                    {
                        tobEntries.map((value, index) => {
                            return (
                            <TobaccoFields key={index + (value.number ?? "")} tobacco_weight={value.weight} note_id={value.number} tare_weight={value.tare_weight} gross_weight={value.gross_weight} onEdit={
                                (entry) => {
                                    if (entry == null) {
                                        let newTobEntries: Array<TobaccoEntry> = tobEntries.filter((_v, i) => (i != index))
                                        if (newTobEntries.length == 0) {
                                            newTobEntries = [{}]
                                        }
                                        setJustSet(true)
                                        setTobEntries(newTobEntries)
                                    }
                                    else {
                                        // console.log(entry)
                                        let newTobEntries: Array<TobaccoEntry> = []
                                        tobEntries.forEach((v, i) => {
                                          if (i == index) {
                                            newTobEntries.push(entry)
                                          }
                                          else {
                                            newTobEntries.push(v)
                                          }
                                        })
                                        if (newTobEntries.length == 0) {
                                            newTobEntries = [{}]
                                        }
                                        // console.log(newTobEntries)
                                        setJustSet(true)
                                        setTobEntries(newTobEntries)
                                    }
                                }
                            }></TobaccoFields>)
                        })
                    }
                    </DialogContent>
                    <DialogActions>
                    <Button variant='contained' onClick={handleMiniClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleMiniSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Box sx={{ margin: "1vh", marginTop: "0vh" }}>
                {getFormsFromRow(nrow)}
            </Box>
        </Dialog>
    )
}


export default ParserEditorDialog
