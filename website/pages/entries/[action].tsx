import { useMemo, useState } from "react";
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
import { entryInfoFields, itemInfoFields, ledgerFields, moneyFields, parsedFieldNames, storeInfoFields, months, moneyToLongString } from "../../client/entryUtils";

const EntryPage = () => {
    const router = useRouter()
    const action = router.query.action as string
    const entry = useEntry()
    const [advancedView, setAdvancedView] = useState(action != "View");
    const { groups } = useAuth();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const disabled = action === "View" || !isAdminOrModerator
    // console.log(action, entry)
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
        // console.log(saveUrl, newEntry)
        if (!dType) return
        let req = {}
        let reqBody = JSON.stringify(newEntry)
        // console.log(reqBody)
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
        // console.log(saveUrl)
        // if (!newEntry.entry_id) {
        //     return
        // }
        const res = await fetch(saveUrl, req);
        
        const text = await res.text();
        if (res.status == 200) {
            handleActionChange("View");
            // let message = JSON.parse(text);
            // console.log(message);
        }
        else {
            console.log("ERROR: " + text);
            alert("Error occured when submitting: " + text);
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
        setAdvancedView(true);
        router.push(path);
    }

    const handleEditToggle = () => {
        if (action == "Edit") {
            handleActionChange("View")
        }
        else if (action == "View") {
            handleActionChange("Edit")
        }
    }
    
    // const handleClose = () => {
    //     setDialog(undefined);
    // };
    
    const boxWidth = "12vw"
    const box2xWidth = "24vw"
    const boxMargin = "2vw"
    const tabSize = "1vw"

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

                
                {!advancedView ? 
                // The following page is used when someone just clicks the view button from the entry table
                // There is no way to return to this page because it is not set up to update correctly when an entry is updated, this could be done but would be somewhat nontrivial
                <Box display={"flex"} flexDirection="column">
                    <Box sx={{...PaperStyles, margin: "1vh", marginBottom: 0}}>
                        <Typography variant={'h6'}>View Entry</Typography>
                        <Button variant="contained" onClick={() => {setAdvancedView(true)}} sx={{marginTop: "1vh", marginBottom: "1vh"}}><Typography variant="h6" sx={{color: "secondary.contrastText"}} fontSize={"1.2vh"}>Advanced View</Typography></Button>
                    </Box>
                    <Box sx={{...PaperStyles, marginTop: 0}}>
                        <Typography variant="h6">Store Info</Typography>
                        <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                            {initFormValues.store != undefined ? 
                                <Box width={boxWidth}>
                                    <Typography>Store: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.store} ({initFormValues.Marginalia ?? ""})</Typography>
                                </Box> : []
                            }
                            {initFormValues.store_owner != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Owner: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.store_owner}</Typography>
                                </Box> : []
                            }
                        </Paper>
                        
                        <Typography variant="h6" sx={{marginTop: "4vh"}}>Entry Info</Typography>
                        <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                            {initFormValues.account_name != undefined ? 
                                <Box width={boxWidth}>
                                    <Typography>Account Name: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.account_name}</Typography>
                                </Box> : []
                            }
                            {initFormValues["Date Year"] != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Date: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues._Month != undefined ? months[parseInt(initFormValues._Month!) - 1] + " " : ""}{initFormValues.Day != undefined ? initFormValues.Day + " " : ""}{initFormValues["Date Year"]}</Typography>
                                </Box> : []
                            }
                            {((initFormValues.pounds != undefined) || (initFormValues.pounds_ster != undefined)) ? 
                                <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Currency Transacted: </Typography>
                                    {
                                        (initFormValues.currency_type ?? "Currency") == "Both" ?
                                        <div>
                                            <Typography sx={{marginLeft: tabSize}}>{moneyToLongString(initFormValues.pounds, initFormValues.shillings, initFormValues.pennies, initFormValues.farthings)}, {(initFormValues.currency_colony ?? "Unknown") != "Unknown" ? initFormValues.currency_colony + " " : ""}Currency</Typography>
                                            <Typography sx={{marginLeft: tabSize}}>{moneyToLongString(initFormValues.pounds_ster, initFormValues.shillings_ster, initFormValues.pennies_ster, initFormValues.farthings_ster)}, Sterling</Typography>
                                        </div>
                                        :
                                        <Typography sx={{marginLeft: tabSize}}>{(initFormValues.currency_type ?? "Currency") == "Sterling" ? moneyToLongString(initFormValues.pounds_ster, initFormValues.shillings_ster, initFormValues.pennies_ster, initFormValues.farthings_ster) : moneyToLongString(initFormValues.pounds, initFormValues.shillings, initFormValues.pennies, initFormValues.farthings)}, {(initFormValues.currency_colony ?? "Unknown") != "Unknown" ? initFormValues.currency_colony + " " : ""}{initFormValues.currency_type ?? "Currency"}</Typography>
                                    }
                                    
                                </Box> : []
                            }
                            {initFormValues.debit_or_credit != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Debit or Credit Record: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.debit_or_credit}</Typography>
                                </Box> : []
                            }
                            {initFormValues.folio_page != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Ledger Info: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Reel {initFormValues.reel}</Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Year {initFormValues.folio_year}</Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Page {initFormValues.folio_page}</Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Entry {initFormValues.entry_id}</Typography>
                                </Box> : []
                            }
                        </Paper>

                        <Typography variant="h6" sx={{marginTop: "4vh"}}>Item Info</Typography>
                        <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                            {initFormValues.text_as_parsed != undefined ? 
                                <Box width={boxWidth}>
                                    <Typography>Partial Entry: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.text_as_parsed}</Typography>
                                </Box> : []
                            }
                            {initFormValues.item != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Item: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.amount != undefined ? initFormValues.amount + " " : ""}{initFormValues.item}</Typography>
                                </Box> : []
                            }
                            {initFormValues.price != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Price: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.price}</Typography>
                                </Box> : []
                            }
                            {initFormValues.Commodity != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Commodity: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.Quantity != undefined ? initFormValues.Quantity + " (pounds) " : ""}{initFormValues.Commodity}</Typography>
                                </Box> : []
                            }
                            {initFormValues.original_entry != undefined ? 
                                <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Complete Entry: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.original_entry}</Typography>
                                </Box> : []
                            }
                            {initFormValues.final != undefined ? 
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Comments: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{initFormValues.final}</Typography>
                                </Box> : []
                            }
                        </Paper>
                        
                        {((initFormValues.tobacco_entries != undefined) && (initFormValues.tobacco_entries.length > 0)) || ((initFormValues.tobacco_marks != undefined) && (initFormValues.tobacco_marks.length > 0)) || (initFormValues.tobacco_location != undefined) || (initFormValues.tobacco_amount_off != undefined) ? 
                        <div>
                            <Typography variant="h6" sx={{marginTop: "4vh"}}>Tobacco Information</Typography>
                            <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                                {initFormValues.tobacco_amount_off != undefined ? 
                                    <Box width={boxWidth}>
                                        <Typography>Tobacco Off: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{initFormValues.tobacco_amount_off}</Typography>
                                    </Box> : []
                                }
                                {initFormValues.tobacco_location != undefined ? 
                                    <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Tobacco Location: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{initFormValues.tobacco_location}</Typography>
                                    </Box> : []
                                }
                                {(initFormValues.tobacco_entries != undefined) && (initFormValues.tobacco_entries.length > 0) ? 
                                    <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Tobacco Entries: </Typography>
                                        <div>
                                            {initFormValues.tobacco_entries.map((value, index) => {
                                                return <Typography sx={{marginLeft: tabSize}} key={((value.number ?? "asdikjsaiofjd") + "tenum" + index + (value.weight ?? "gjfsdo"))}>N {value.number ?? "No Note Number"}: {((value.gross_weight == undefined) && (value.tare_weight == undefined)) ? (value.weight ?? "No Final") + " Weight Tobacco" : (value.gross_weight + " - " + value.tare_weight + " = " + (value.weight ?? "No Final") + " Weight Tobacco")}</Typography>
                                            })}
                                        </div>
                                    </Box> : []
                                }
                                {(initFormValues.tobacco_marks != undefined) && (initFormValues.tobacco_marks.length > 0) ? 
                                    <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Tobacco Marks: </Typography>
                                        <div>
                                            {initFormValues.tobacco_marks.map((value, index) => {
                                                return <Typography key={(value.mark_text ?? "asdas") + (value.mark_number ?? "sdasdafsd") + index} sx={{marginLeft: tabSize}}>{value.mark_text ?? "No Mark Text"}: {value.mark_number ?? "No Mark Number"}</Typography>
                                            })}
                                        </div>
                                    </Box> : []
                                }
                            </Paper>
                        </div>
                        : []
                        }

                        {((initFormValues.people != undefined) && (initFormValues.people.length > 0)) || ((initFormValues.mentions != undefined) && (initFormValues.mentions.length > 0)) || (initFormValues.folio_reference != undefined) ? 
                        <div>
                            <Typography variant="h6" sx={{marginTop: "4vh"}}>Relationship Information</Typography>
                            <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                                {initFormValues.folio_reference != undefined ? 
                                    <Box width={boxWidth}>
                                        <Typography>Folio Referenced: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>Page {initFormValues.folio_reference}</Typography>
                                    </Box> : []
                                }
                                {(initFormValues.people != undefined) && (initFormValues.people.length > 0) ? 
                                    <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>People: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{initFormValues.people.join("; ")}</Typography>
                                    </Box> : []
                                }
                                {(initFormValues.mentions != undefined) && (initFormValues.mentions.length > 0) ? 
                                    <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Mentioned: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{initFormValues.mentions.join("; ")}</Typography>
                                    </Box> : []
                                }
                            </Paper>
                        </div>
                        : []
                        }

                    </Box>
                </Box>

                : 
                // The following page is used when the advanced view button is clicked or edit/create is clicked from the entry view page
                <Formik
                    validateOnBlur
                    initialValues={action !== 'Create' ? initFormValues : {}}
                    // validationSchema={entrySchema}
                    onSubmit={(values) => {
                        // console.log(values)
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
                                <Divider flexItem sx={{mt:1, mb:1}}>Store Info</Divider>
                            </FormLabel>
                                
                            <Grid container spacing={1}>
                                {storeInfoFields.map(k=>(
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
                        <br/>
                        <FormGroup>
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
                        <br/>
                        <FormGroup>
                            <FormLabel>
                                <Divider flexItem sx={{mt:1, mb:1}}>Item Info</Divider>
                            </FormLabel>
                                
                            <Grid container spacing={1}>
                                {itemInfoFields.map(k=>(
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
                        <br/>
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
                        <br/>
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
                        <br/>
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
                        <br/>
                        <FormGroup>
                        {(!!values?.mentions?.length || action !== "View")  &&
                          <FormLabel sx={{mt:3}}>
                            <Divider flexItem sx={{mt:1, mb:1}}>Mentioned</Divider>
                          </FormLabel>
                        }
                        <FieldArray
                            name="mentions"
                            render={ (arrayHelpers)=> (
                            <>
                            <Box>
                            {!disabled &&
                              <Button
                                startIcon={<AddCircle />}
                                onClick={()=> arrayHelpers.push("")}
                              >
                                Add Mentioned
                              </Button>
                            }
                            </Box>
                            <Grid container spacing={1}>
                                {values?.mentions?.map((person, k)=>(
                                <Grid item xs={3} key={k}>
                                    <FormControl>
                                    <FormGroup row>
                                    <InputLabel>Mentioned</InputLabel>
                                    <OutlinedInput
                                        name={`mentions.${k}`}
                                        // autoFocus
                                        margin="dense"
                                        disabled={disabled}
                                        label={"Mentioned"}
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
                        <br/>
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
                        <br/>
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
                    <br/>
                        <Divider sx={{mt:2, mb:2}}/>
                        <Grid container>
                            <Stack direction={'row'}>
                                {isAdminOrModerator &&
                                  <>
                                    <Button
                                      onClick={()=>handleEditToggle()}
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
                )}
                </Formik>
                }
            </Paper>
        </ColorBackground>

    )
}

export default EntryPage
