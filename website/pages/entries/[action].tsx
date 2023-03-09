import { useMemo } from "react";
import { useRouter } from 'next/router';
import { Formik, FieldArray, Form, getIn } from 'formik';
import {useEntry} from "@components/context/EntryContext";
import {
    ParserOutput,
    // ParserStringKeys, ParserBooleanKeys, ParserStringArrayKeys, ParserNumberKeys,
} from "new_types/api_types";
import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';

import TextField from '@mui/material/TextField';
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
import Typography from '@mui/material/Typography';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';


import Stack from "@mui/material/Stack";
import { PaperStyles } from "../../styles/styles";
import FormGroup from "@mui/material/FormGroup";
import Divider from "@mui/material/Divider";
import { Roles } from "../../config/constants.config";
import { entryInfoFields, ledgerFields, moneyFields, parsedFieldNames } from "../../client/entryUtils";

const EntryPage = () => {
    const router = useRouter()
    const action = router.query.action as string
    const entry = useEntry()
    const { groups } = useAuth();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const disabled = action === "View" || !isAdminOrModerator
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
    
    const handleDelete = () => {
        // const id = entry?._id
        // if (!id) return
        // let saveUrl = `https://api.preprod.shoppingstories.org/delete_entry/?` + new URLSearchParams({entry_id: id}).toString();
        // let req = {
        //     method: "POST",
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json"
        //     }
        // }
        // fetch(saveUrl, req).then(p => {
        //     console.log(p)
        // })
        router.push('/entries/');
    }
    
    const handleActionChange = (newAction: string) => {
        const path = `/entries/${newAction}`;
        router.push(path);
    }
    
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
                    initialValues={action !== 'Create' ? initFormValues : {}}
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
                   }) => (
                    <Form noValidate>
                        <FormGroup>
                        <Typography variant={'h6'} gutterBottom>{action} Entry</Typography>
                            <FormLabel>
                                <Divider flexItem sx={{mt:1, mb:1}}>Entry Info</Divider>
                            </FormLabel>
                            
                        <Grid container spacing={1}>
                            {entryInfoFields.map(k=>(
                                <Grid item xs={3} key={k}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label={parsedFieldNames[k]}
                                        fullWidth
                                        name={k}
                                        disabled={disabled}
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
                        </FormGroup>
                        <FormGroup>
                        <FormLabel sx={{mt:3}}>
                            <Divider flexItem sx={{mt:1, mb:1}}>Ledger Info</Divider>
                        </FormLabel>
                        <Grid container spacing={1}>
                            {ledgerFields.map(k=>(
                                <Grid item xs={3} key={k}>
                                    <TextField
                                        autoFocus
                                        name={k}
                                        margin="dense"
                                        disabled={disabled}
                                        label={parsedFieldNames[k]}
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
                        <FormLabel sx={{mt:3}}>
                            <Divider flexItem sx={{mt:1, mb:1}}>Currency Info</Divider>
                        </FormLabel>
                        <Grid container spacing={1}>
                            {moneyFields.map(k=>(
                                <Grid item xs={3} key={k}>
                                    <TextField
                                        name={k}
                                        autoFocus
                                        margin="dense"
                                        disabled={disabled}
                                        label={parsedFieldNames[k]}
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
                        {(!!values?.people?.length || action !== "View")  &&
                          <FormLabel sx={{mt:3}}>
                            <Divider flexItem sx={{mt:1, mb:1}}>People</Divider>
                          </FormLabel>
                        }
                        <FieldArray
                            name="people"
                            render={ (arrayHelpers)=> (
                            <>
                            <Box>
                            {!disabled &&
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
                                    <FormControl>
                                    <FormGroup row>
                                    <InputLabel>Person</InputLabel>
                                    <OutlinedInput
                                        name={`people.${k}`}
                                        // autoFocus
                                        margin="dense"
                                        disabled={disabled}
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
                                                { !disabled &&
                                                  <IconButton
                                                    onClick={()=>arrayHelpers.remove(k)}
                                                    edge="end"
                                                  >
                                                    <DeleteIcon/>
                                                  </IconButton>
                                                }
                                            </InputAdornment>
                                        }
                                    />
                                    </FormGroup>
                                    </FormControl>
                                </Grid>))}
                            </Grid>
                        </>)}/>
                        </FormGroup>
                        <FormGroup>
                        {(!!values?.tobacco_entries?.length || action !== "View") &&
                          <FormLabel sx={{mt:3}}>
                            <Divider flexItem sx={{mt:1, mb:1}}>Tobacco Entries</Divider>
                          </FormLabel>
                        }
                        <FieldArray
                            name={"tobacco_entries"}
                            render={ (arrayHelpers)=> (<>
                            <Box>
                                {!disabled &&
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
                                        <Stack direction={'row'}>
                                        {/*<FormGroup row>*/}
                                        <TextField
                                            name={`tobacco_entries.${k}.number`}
                                            autoFocus
                                            margin="dense"
                                            disabled={disabled}
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
                                            disabled={disabled}
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
                                            disabled={disabled}
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
                                            disabled={disabled}
                                            label={"Weight"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.weight}
                                            onChange={handleChange}
                                            defaultValue={t.weight}
                                        />
                                        { !disabled &&
                                            <IconButton
                                                onClick={()=>arrayHelpers.remove(k)}
                                                edge="end"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        }
                                        {/*<Button*/}
                                        {/*    // variant={'contained'}*/}
                                        {/*    endIcon={<DeleteIcon/>}*/}
                                        {/*    onClick={()=>arrayHelpers.remove(k)}*/}
                                        {/*>*/}
                                        {/*    Delete*/}
                                        {/*</Button>*/}
                                        {/*</FormGroup>*/}
                                        </Stack>
                                    </Grid>
                                </Grid>
                        ))}</>)}/>
                        </FormGroup>
                        <FormGroup>
                        {(!!values?.tobacco_marks?.length || action !== "View") &&
                          <FormLabel sx={{mt:3}}>
                            <Divider flexItem sx={{mt:1, mb:1}}>Tobacco Marks</Divider>
                          </FormLabel>
                        }
                        <FieldArray
                            name={"tobacco_marks"}
                            render={ (arrayHelpers)=> (<>
                            <Box>
                                {!disabled &&
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
                                            disabled={disabled}
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
                                            disabled={disabled}
                                            label={"Mark Text"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.gross_weight}
                                            onChange={handleChange}
                                            defaultValue={t.mark_text}
                                        />
                                        { !disabled &&
                                          <IconButton
                                            onClick={()=>arrayHelpers.remove(k)}
                                            edge="end"
                                          >
                                            <DeleteIcon/>
                                          </IconButton>
                                        }
                                        {/*<Button*/}
                                        {/*    endIcon={<DeleteIcon/>}*/}
                                        {/*    onClick={()=>arrayHelpers.remove(k)}*/}
                                        {/*>*/}
                                        {/*</Button>*/}
                                    </FormGroup>
                                </Grid>
                            </Grid>
                    ))}</>)}/>
                    </FormGroup>
                        <Divider sx={{mt:2, mb:2}}/>
                        <Grid container>
                            <Stack direction={'row'}>
                                {isAdminOrModerator &&
                                  <>
                                    <Button
                                      onClick={()=>handleActionChange('Edit')}
                                      variant={"contained"}
                                      color={"warning"}
                                    >
                                      Edit
                                    </Button>
                                    {/*<Button*/}
                                    {/*  sx={{ml:1}}*/}
                                    {/*  onClick={()=>handleActionChange('Create')}*/}
                                    {/*  startIcon={<AddCircle />}*/}
                                    {/*  variant={"contained"}*/}
                                    {/*>*/}
                                    {/*  Create*/}
                                    {/*</Button>*/}
                                    <Button
                                      sx={{ml:1}}
                                      onClick={handleDelete}
                                      variant={"contained"}
                                      color={'error'}
                                    >
                                      Delete
                                    </Button>
                                  </>
                                }
                                {!disabled &&
                                  <Button
                                    sx={{ml:1}}
                                    type={"submit"}
                                    variant={"contained"}
                                    color={'success'}
                                  >
                                    Submit
                                  </Button>
                                }
                                
                            </Stack>
                        </Grid>
                    </Form>
                )}</Formik>
            </Paper>
        </ColorBackground>

    )
}

export default EntryPage
