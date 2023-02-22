import { useState, useMemo } from "react";
import { useRouter } from 'next/router';
import { useFormik, Formik, FieldArray, Form, getIn } from 'formik';
import {useEntry} from "@components/context/EntryContext";
import {entrySchema} from "../../client/formikSchemas";
import {
    Entry,
    EntryKey,
    ParserOutput,
    ParserOutputKeys,
    ParserOutputKey,
    // ParserStringKeys, ParserBooleanKeys, ParserStringArrayKeys, ParserNumberKeys,
    Currency, Ledger,
    TobaccoEntry, TobaccoEntryKey, TobaccoMarkKey, TobaccoMark
} from "new_types/api_types";
import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';


import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddCircle from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import Paper from '@mui/material/Paper';


import Stack from "@mui/material/Stack";
import { PaperStyles } from "../../styles/styles";
import FormGroup from "@mui/material/FormGroup";

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

const handleSubmit = async (newEntry: Partial<ParserOutput>, dType: string | undefined, id?: string) => {
    let saveUrl = `https://api.preprod.shoppingstories.org/${dType?.toLowerCase()}_entry`;
    console.log(saveUrl, newEntry)
    if (!dType) return
    let req = {}
    let reqBody = JSON.stringify(newEntry)
    console.log(reqBody)
    if (dType === "Edit"){
        if (!id) return
        req = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            // entry_id: newEntry.entry_id,
            body: reqBody
        }
        saveUrl = saveUrl + "?" + new URLSearchParams({entry_id: id}).toString()
    } else if (dType === "Create") {
        req = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            // many: false,
            body: reqBody
        }
    }
    console.log(saveUrl)
    // if (!newEntry.entry_id) {
    //     return
    // }
    const res = await fetch(saveUrl, req);
    
    const text = await res.text();
    if (res.status == 200) {
        let message = JSON.parse(text);
        console.log(message);
    }
    else {
        console.log("ERROR: " + text);
    }
}

const fieldNames = Object.fromEntries(
    ParserOutputKeys
        .filter(k=>!excludedFields.has(k))
        .map(k => [k as IncludedField, toDisplayCase(k as string)])
)

// interface EntryDialogProps {
//     dialogType?: string
//     entry?: Entry
//     setDialog: (dialog:string|undefined) => void
// }

const EntryPage = () => {
    const router = useRouter()
    const action = router.query.action as string
    const entry = useEntry()
    console.log(action, entry)
    // const [open, setOpen] = useState<boolean>(!!action)
    const initFormValues: Partial<ParserOutput> = useMemo(()=>{
        return {
            amount: entry?.amount,
            amount_is_combo: entry?.amount_is_combo,
            item: entry?.item,
            price: entry?.price,
            price_is_combo: entry?.price_is_combo,
            phrases: entry?.phrases,
            date: entry?.date,
            pounds: entry?.currency?.pounds ?? 0,
            shillings: entry?.currency?.shillings ?? 0,
            pennies: entry?.currency?.pennies ?? 0,
            pounds_ster: entry?.sterling?.pounds ?? 0,
            shillings_ster: entry?.sterling?.shillings ?? 0,
            pennies_ster: entry?.sterling?.pennies ?? 0,
            // farthings_ster:
            // farthings:
            Marginalia: entry?.Marginalia,
            currency_type: entry?.currency_type,
            currency_colony: entry?.currency_colony,
            currency_totaling_contextless: entry?.currency_totaling_contextless,
            commodity_totaling_contextless: entry?.commodity_totaling_contextless ,
            account_name: entry?.account_name,
            entry_id: entry?.ledger?.entry_id,
            reel: entry?.ledger?.reel ? Number(entry.ledger.reel) : 0,
            folio_page: entry?.ledger?.folio_page ? Number(entry.ledger.folio_page) : 0,
            folio_year: entry?.ledger?.folio_year,
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
            tobacco_entries: entry?.tobacco_entries,
        }
    }, [entry])
    
    // const handleClose = () => {
    //     setDialog(undefined);
    // };
    
    return (
        <ColorBackground>
            <Header />
            <Paper
                sx={{
                    // backgroundColor: 'var(--secondary-bg)',
                    ...PaperStyles,
                    // margin: '1rem',
                }}
            >
                <Formik
                    validateOnBlur
                    initialValues={initFormValues}
                    // validationSchema={entrySchema}
                    onSubmit={(values) => {
                        console.log(values)
                        handleSubmit(values, action, entry?._id)
                            // .then(p => console.log(p))
                    }}
                >{({
                       values,
                       touched,
                       errors,
                       handleChange,
                       handleBlur,
                       isValid
                   }) => (
                    <Form noValidate>
                        <FormLabel>Entry Info</FormLabel>
                        <Grid container spacing={1}>
                            {entryInfo.map(k=>(
                                <Grid item xs={3} key={k}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label={fieldNames[k]}
                                        fullWidth
                                        name={k}
                                        disabled={action === "View"}
                                        // sx={{m:1, width: '25ch'}}
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                            touched[k as keyof typeof values] &&
                                            !!errors[k as keyof typeof values]
                                        }
                                        // value={values[k as keyof typeof values]}
                                        defaultValue={values[k as keyof typeof values]}
                                        // defaultValue={entry ? entry[k as EntryKey] : ""}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <FormLabel sx={{mt:3}}>Ledger Info</FormLabel>
                        <Grid container spacing={1}>
                            {ledger.map(k=>(
                                <Grid item xs={3} key={k}>
                                    <TextField
                                        autoFocus
                                        name={k}
                                        margin="dense"
                                        disabled={
                                            action === "View"
                                            // || (k == "entry_id" && action === "Edit")
                                        }
                                        label={fieldNames[k]}
                                        fullWidth
                                        onBlur={handleBlur}
                                        error={
                                            touched[k as keyof typeof values] &&
                                            !!errors[k as keyof typeof values]
                                        }
                                        onChange={handleChange}
                                        variant="outlined"
                                        // value={values[k as keyof typeof values]}
                                        defaultValue={values[k as keyof typeof values]}
                                        // defaultValue={entry ? entry[k as EntryKey] : ""}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <FormGroup>
                        <FormLabel sx={{mt:3}}>Currency Info</FormLabel>
                        <Grid container spacing={1}>
                            {money.map(k=>(
                                <Grid item xs={3} key={k}>
                                    <TextField
                                        name={k}
                                        autoFocus
                                        margin="dense"
                                        disabled={
                                            action === "View"
                                            // || (k == "entry_id" && action === "Edit")
                                        }
                                        label={fieldNames[k]}
                                        fullWidth
                                        onBlur={handleBlur}
                                        error={
                                            touched[k as keyof typeof values] &&
                                            !!errors[k as keyof typeof values]
                                        }
                                        onChange={handleChange}
                                        variant="outlined"
                                        // value={values[k as keyof typeof values]}
                                        defaultValue={values[k as keyof typeof values]}
                                        // defaultValue={entry ? entry[k as EntryKey] : ""}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        </FormGroup>
                        <FormGroup>
                            {(!!values?.people?.length || action === "Create")  && <FormLabel>People</FormLabel>}
                        <FieldArray
                            name={"people"}
                            render={ (arrayHelpers)=> (
                            <>
                            <Box>
                            {action && action !== "View" &&
                              <Button
                                startIcon={<AddCircle />}
                                onClick={()=> arrayHelpers.push("")}
                              >
                                Add Person
                              </Button>
                            }
                            </Box>
                            <Grid container spacing={1}>
                                {values?.people?.map((person, k)=>(
                                <Grid item xs={3} key={k}>
                                    <FormGroup row>
                                    <InputLabel>Person</InputLabel>
                                    <OutlinedInput
                                        name={`people.${k}`}
                                        // autoFocus
                                        margin="dense"
                                        // disabled={action === "View"}
                                        label={"Person"}
                                        // fullWidth
                                        // variant="outlined"
                                        // value={person}
                                        onBlur={handleBlur}
                                        error={
                                            getIn(touched, person) &&
                                            !!getIn(errors, person)
                                        }
                                        onChange={handleChange}
                                        defaultValue={person}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={()=>arrayHelpers.remove(k)}
                                                    edge="end"
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    </FormGroup>
                                </Grid>))}
                            </Grid>
                        </>)}/>
                        </FormGroup>
                        <FormGroup>
                            {(!!values?.tobacco_entries?.length || action === "Create") && <FormLabel>Tobacco Entries</FormLabel>}
                        <FieldArray
                            name={"tobacco_entries"}
                            render={ (arrayHelpers)=> (<>
                            <Box>
                                {action !=="View" &&
                                  <Button
                                    startIcon={<AddCircle />}
                                    onClick={()=> arrayHelpers.push("")}
                                  >
                                    Add Entry
                                  </Button>
                                }
                            </Box>
                                {values?.tobacco_entries?.map((t, k)=>(
                                <Grid container spacing={1} key={k} alignItems={"center"}>
                                    <Grid item xs={12}>
                                        <FormGroup row>
                                        <TextField
                                            name={`tobacco_entries.${k}.number`}
                                            autoFocus
                                            margin="dense"
                                            // disabled={action === "View"}
                                            label={"number"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.number}
                                            onChange={handleChange}
                                            defaultValue={t.number}
                                        />
                                        <TextField
                                            name={`tobacco_entries.${k}.gross_weight`}
                                            autoFocus
                                            margin="dense"
                                            // disabled={action === "View"}
                                            label={"Gross Weight"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.gross_weight}
                                            onChange={handleChange}
                                            defaultValue={t.gross_weight}
                                        />
                                        <TextField
                                            name={`tobacco_entries.${k}.tare_weight`}
                                            autoFocus
                                            margin="dense"
                                            // disabled={action === "View"}
                                            label={"Tare Weight"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.tare_weight}
                                            onChange={handleChange}
                                            defaultValue={t.tare_weight}
                                        />
                                        <TextField
                                            name={`tobacco_entries.${k}.weight`}
                                            autoFocus
                                            margin="dense"
                                            // disabled={action === "View"}
                                            label={"Weight"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.weight}
                                            onChange={handleChange}
                                            defaultValue={t.weight}
                                        />
                                        <Button
                                            endIcon={<DeleteIcon/>}
                                            onClick={()=>arrayHelpers.remove(k)}
                                        >
                                        </Button>
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                        ))}</>)}/>
                        </FormGroup>
                        <FormGroup>
                            {(!!values?.tobacco_marks?.length || action === "Create") && <FormLabel>Tobacco Marks</FormLabel>}
                        <FieldArray
                            name={"tobacco_marks"}
                            render={ (arrayHelpers)=> (<>
                            <Box>
                                {action !=="View" &&
                                  <Button
                                    startIcon={<AddCircle />}
                                    onClick={()=> arrayHelpers.push("")}
                                  >
                                    Add Mark
                                  </Button>
                                }
                            </Box>
                            {values?.tobacco_marks?.map((t, k)=>(
                            <Grid container spacing={1} key={k} alignItems={"center"}>
                                <Grid item xs={12}>
                                    <FormGroup row>
                                        <TextField
                                            name={`tobacco_marks.${k}.mark_number`}
                                            autoFocus
                                            margin="dense"
                                            // disabled={action === "View"}
                                            label={"Mark Number"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.number}
                                            onChange={handleChange}
                                            defaultValue={t.mark_number}
                                        />
                                        <TextField
                                            name={`tobacco_marks.${k}.mark_text`}
                                            autoFocus
                                            margin="dense"
                                            // disabled={action === "View"}
                                            label={"Mark Text"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.gross_weight}
                                            onChange={handleChange}
                                            defaultValue={t.mark_text}
                                        />
                                        <Button
                                            endIcon={<DeleteIcon/>}
                                            onClick={()=>arrayHelpers.remove(k)}
                                        >
                                        </Button>
                                    </FormGroup>
                                </Grid>
                            </Grid>
                    ))}</>)}/>
                    </FormGroup>
                        <Grid container>
                        {action !== "View" && <Button type={"submit"}>Submit</Button>}
                        </Grid>
                    </Form>
                )}</Formik>
            </Paper>
        </ColorBackground>

    )
}

export default EntryPage

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