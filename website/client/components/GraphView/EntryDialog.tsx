import { useState, useMemo } from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useFormik, Formik, FieldArray, Form } from 'formik';
import Box from "@mui/material/Box";
import {
    Entry,
    EntryKey,
    ParserOutput,
    ParserOutputKeys,
    ParserOutputKey,
    // ParserStringKeys, ParserBooleanKeys, ParserStringArrayKeys, ParserNumberKeys,
    Currency, Ledger,
    TobaccoEntry, TobaccoEntryKey, TobaccoMarkKey
} from "new_types/api_types";
import { EntryScalarInfo } from "@components/GraphView/util";

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
    "mentions"
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
    "error_context",
    "type",
    "liber_book",
    "phrases",
    "mentions"
] as Array<ExcludedField>

const excludedFields = new Set<ParserOutputKey>(noDisplay)

const toDisplayCase = (k:string) => {
    return k.replace(/(_|^)([^_]?)/g, function(_, prep, letter) {
        return (prep && ' ') + letter.toUpperCase();
    });
}

const fieldNames = Object.fromEntries(
    ParserOutputKeys
        .filter(k=>!excludedFields.has(k))
        .map(k => [k as IncludedField, toDisplayCase(k as string)])
)

interface EntryDialogProps {
    dialogType?: string
    entry?: Entry
    setDialog: (dialog:string|undefined) => void
}

const EntryDialog = ({dialogType, entry, setDialog}: EntryDialogProps) => {
    console.log(dialogType, entry)
    const [open, setOpen] = useState<boolean>(!!dialogType)
    
    const initFormValues: Partial<ParserOutput> = useMemo(()=>{
        return {
            amount: entry?.amount,
            amount_is_combo: entry?.amount_is_combo,
            item: entry?.item,
            price: entry?.price,
            price_is_combo: entry?.price_is_combo,
            phrases: entry?.phrases,
            date: entry?.date,
            pounds: entry?.currency?.pounds,
            shillings: entry?.currency?.shillings,
            pennies: entry?.currency?.pennies,
            pounds_ster: entry?.sterling?.pounds,
            shillings_ster: entry?.sterling?.shillings,
            pennies_ster: entry?.sterling?.pennies,
            // farthings_ster:
            // farthings:
            Marginalia: entry?.Marginalia,
            currency_type: entry?.currency_type,
            currency_colony: entry?.currency_colony,
            currency_totaling_contextless: entry?.currency_totaling_contextless,
            commodity_totaling_contextless: entry?.commodity_totaling_contextless ,
            account_name: entry?.account_name,
            entry_id: entry?.ledger?.entry_id,
            reel: entry?.ledger?.reel,
            folio_year: entry?.ledger?.folio_year,
            folio_page: entry?.ledger?.folio_page,
            store: entry?.store,
            store_owner: entry?.store_owner,
            "Date Year": entry?.date_year,
            "_Month": entry?.month,
            Day: entry?.Day,
            debit_or_credit: entry?.debit_or_credit,
            context: entry?.context,
            Quantity: entry?.Quantity,
            Commodity: entry?.Commodity,
            people: entry?.people,
            type: entry?.type,
            liber_book: entry?.liber_book,
            mentions: entry?.mentions,
            folio_reference: entry?.folio_reference,
            text_as_parsed: entry?.text_as_parsed,
            original_entry: entry?.original_entry,
            tobacco_location: entry?.tobacco_location,
            tobacco_amount_off: entry?.tobacco_amount_off,
            tobacco_marks: entry?.tobacco_marks,
            tobacco_entries: entry?.tobacco_entries
        }
    }, [entry])
    
    const handleClose = () => {
        setDialog(undefined);
    };
    
    return (
        <Dialog
            open={!!dialogType}
            onClose={handleClose}
            maxWidth={'xl'}
        >
            <DialogTitle>{dialogType} Entry</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initFormValues}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                >{({ 
                    values, 
                    touched, 
                    errors, 
                    handleChange, 
                    handleBlur, 
                    isValid 
                }) => (
                <Form>
                <DialogContentText>Entry Info</DialogContentText>
                <Grid container spacing={1}>
                    {entryInfo.map(k=>(
                        <Grid item xs={3} key={k}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="k"
                                label={fieldNames[k]}
                                fullWidth
                                disabled={dialogType === "View"}
                                // sx={{m:1, width: '25ch'}}
                                variant="outlined"
                                value={values[k as keyof typeof values]}
                                defaultValue={entry ? entry[k as EntryKey] : ""}
                            />
                        </Grid>
                    ))}
                </Grid>
                <DialogContentText sx={{mt:3}}>Ledger Info</DialogContentText>
                <Grid container spacing={1}>
                    {ledger.map(k=>(
                        <Grid item xs={3} key={k}>
                            <TextField
                                autoFocus
                                margin="dense"
                                disabled={dialogType === "View" || (k == "entry_id" && dialogType === "Edit") }
                                label={fieldNames[k]}
                                fullWidth
                                variant="outlined"
                                value={values[k as keyof typeof values]}
                                defaultValue={entry ? entry[k as EntryKey] : ""}
                            />
                        </Grid>
                    ))}
                </Grid>
                <DialogContentText sx={{mt:3}}>Currency Info</DialogContentText>
                <Grid container spacing={1}>
                    {money.map(k=>(
                        <Grid item xs={3} key={k}>
                            <TextField
                                autoFocus
                                margin="dense"
                                disabled={dialogType === "View" || (k == "entry_id" && dialogType === "Edit") }
                                label={fieldNames[k]}
                                fullWidth
                                variant="outlined"
                                value={values[k as keyof typeof values]}
                                defaultValue={entry ? entry[k as EntryKey] : ""}
                            />
                        </Grid>
                    ))}
                </Grid>
                <DialogContentText sx={{mt:3}}>Tobacco Marks</DialogContentText>
                <Grid container spacing={1}>
                    {money.map(k=>(
                        <Grid item xs={3} key={k}>
                            <TextField
                                autoFocus
                                margin="dense"
                                disabled={dialogType === "View" || (k == "entry_id" && dialogType === "Edit") }
                                label={fieldNames[k]}
                                fullWidth
                                variant="outlined"
                                value={values[k as keyof typeof values]}
                                defaultValue={entry ? entry[k as EntryKey] : ""}
                            />
                        </Grid>
                    ))}
                </Grid>
                <DialogContentText sx={{mt:3}}>Tobacco Entries</DialogContentText>
                <Grid container spacing={1}>
                    {money.map(k=>(
                        <Grid item xs={3} key={k}>
                            <TextField
                                autoFocus
                                margin="dense"
                                disabled={dialogType === "View" || (k == "entry_id" && dialogType === "Edit") }
                                label={fieldNames[k]}
                                fullWidth
                                variant="outlined"
                                value={values[k as keyof typeof values]}
                                defaultValue={entry ? entry[k as EntryKey] : ""}
                            />
                        </Grid>
                    ))}
                </Grid>
                <DialogContentText sx={{mt:3}}>People</DialogContentText>
                <Grid container spacing={1}>
                    {money.map(k=>(
                        <Grid item xs={3} key={k}>
                            <TextField
                                autoFocus
                                margin="dense"
                                disabled={dialogType === "View" || (k == "entry_id" && dialogType === "Edit") }
                                label={fieldNames[k]}
                                fullWidth
                                variant="outlined"
                                value={values[k as keyof typeof values]}
                                defaultValue={entry ? entry[k as EntryKey] : ""}
                            />
                        </Grid>
                    ))}
                </Grid>
                </Form>
                )}</Formik>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EntryDialog

const money = [
    "currency_type",
    "pounds_ster",
    "shillings_ster",
    "pennies_ster",
    "pounds",
    "shillings",
    "pennies",
    // "farthings_ster",
    // "farthings",
]

const tobacco = [
    "tobacco_location",
    // "tobacco_marks",
    // "tobacco_entries"
]

const tobaccoEntry = [
    "number",
    "gross_weight",
    "tare_weight",
    "weight",
]

const tobaccoMark = [
    "mark_number",
    "mark_text"
]

const ledger = [
    "entry_id",
    "reel",
    "folio_reference",
    "folio_year",
    "folio_page",
]

const entryInfo = [
    "store",
    "store_owner",
    "debit_or_credit",
    "account_name",
    // "amount_is_combo",
    "item",
    "amount",
    "price",
    "Quantity",
    "Commodity",
    // "text_as_parsed",
    // "original_entry",
    "Marginalia",
    "Day",
    "_Month",
    "Date Year",
    "date",
    // "people",
]