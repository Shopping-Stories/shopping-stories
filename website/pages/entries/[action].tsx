import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/router';
import { Formik, FieldArray, Field, Form, getIn } from 'formik';
import { useMutation, useQueryClient} from "@tanstack/react-query";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddCircle from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
// import CloseIcon from '@mui/icons-material/Close';
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
import Tooltip from "@mui/material/Tooltip";

import { Roles } from "../../config/constants.config";
import { entryInfoFields, itemInfoFields, ledgerFields, moneyFields, parsedFieldNames, storeInfoFields, months, moneyToLongString } from "../../client/entryUtils";
import {useEntry} from "@components/context/EntryContext";
import {
    ParserOutput,
    // ParserStringKeys, ParserBooleanKeys, ParserStringArrayKeys, ParserNumberKeys,
} from "new_types/api_types";
import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
// import { entrySchema } from "../../client/formikSchemas";

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
    const queryClient = useQueryClient()
    const [confirm, setConfirm] = useState<boolean>(false)
    console.log(action, entry)
    // const [open, setOpen] = useState<boolean>(!!action)
    const notCreate = action !== 'Create'
    const initFormValues: Partial<ParserOutput> = useMemo(()=>{
        return {
            // Unique to Simple View
            text_as_parsed: notCreate ? entry?.text_as_parsed ?? '' : '',
            original_entry: notCreate ? entry?.original_entry ?? '' : '',
            currency_colony: notCreate ? entry?.currency_colony ?? '' : '',
            
            // Account Info
            debit_or_credit: notCreate ? entry?.debit_or_credit ?? '' : '',
            account_name: notCreate ? entry?.account_name ?? '' : '',
            "_Month": notCreate ? entry?.month ?? '' : '',
            Day: notCreate ? entry?.Day ?? '' : '',
            "Date Year": notCreate ? entry?.date_year ?? '' : '',
            
            // Item Info
            item: notCreate ? entry?.item ?? '' : '',
            amount: notCreate ? entry?.amount ?? '' : '',
            price: notCreate ? entry?.price ?? '' : '',
            
            // Store Info
            store: notCreate ? entry?.store ?? '' : '',
            store_owner: notCreate ? entry?.store_owner ?? '' : '',
            Marginalia: notCreate ? entry?.Marginalia ?? '' : '',
            
            // Currency Info
            Quantity: notCreate ? entry?.Quantity ?? '' : '',
            Commodity: notCreate ? entry?.Commodity ?? '' : '',
            currency_type: notCreate ? entry?.currency_type ?? '' : '',
            pounds: notCreate ? entry?.currency?.pounds ?? 0 : 0,
            shillings: notCreate ? entry?.currency?.shillings ?? 0 : 0,
            pennies: notCreate ? entry?.currency?.pennies ?? 0 : 0,
            pounds_ster: notCreate ? entry?.sterling?.pounds ?? 0 : 0,
            shillings_ster: notCreate ? entry?.sterling?.shillings ?? 0 : 0,
            pennies_ster: notCreate ? entry?.sterling?.pennies ?? 0 : 0,
            farthings_ster: notCreate ? entry?.sterling?.farthings ?? 0 : 0,
            farthings: notCreate ? entry?.currency?.farthings ?? 0 : 0,
            
            // ledger Info
            folio_page: notCreate ? entry?.ledger?.folio_page ? entry.ledger.folio_page : '' : '',
            entry_id: notCreate ? entry?.ledger?.entry_id ?? '' : '',
            folio_year: notCreate ? entry?.ledger?.folio_year ?? '' : '',
            folio_reference: notCreate ? entry?.folio_reference ?? '' : '',
            reel: notCreate ? entry?.ledger?.reel ? Number(entry.ledger.reel) : 0 : 0,
            
            // People Field
            people: notCreate ? entry?.people ?? [] : [],
            
            // Mention Field
            mentions: notCreate ? entry?.mentions ?? [] : [],
            
            // Tobacco Fields
            tobacco_marks: notCreate ? entry?.tobacco_marks ?? [] : [],
            tobacco_entries: notCreate ? entry?.tobacco_entries ?? [] : [],
            tobacco_location: notCreate ? entry?.tobacco_location ?? '' : '',
            tobacco_amount_off: notCreate ? entry?.tobacco_amount_off ?? '' : '',

            // Unused/Parser Format Fields
            //
            // liber_book: entry?.liber_book,
            // type: entry?.type,
            // date: entry?.date,
            // context: entry?.context,
            // amount_is_combo: entry?.amount_is_combo,
            // price_is_combo: entry?.price_is_combo,
            // phrases: entry?.phrases,
            // currency_totaling_contextless: entry?.currency_totaling_contextless,
            // commodity_totaling_contextless: entry?.commodity_totaling_contextless,
        }
    }, [notCreate, entry])
    
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
                // entry_id: newentry.ledger.entry_id,
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
        // if (!newentry.ledger.entry_id) {
        //     return
        // }
        const res = await fetch(saveUrl, req);
        
        const text = await res.text();
        if (res.status == 200) {
            let message = JSON.parse(text);
            console.log(message);
            // router.push('/entries')
            router.back()
            // handleActionChange("View");
        }
        else {
            console.log("ERROR: " + text);
            alert("Error occured when submitting: " + text);
        }
    }
    
    const mutationDelete = useMutation({
        mutationFn: (id: string) => {
            // const id = payload._id
            // if (!id) return
            let saveUrl = `https://api.preprod.shoppingstories.org/delete_entry/?` + new URLSearchParams({entry_id: id}).toString();
            let req = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
            return fetch(saveUrl, req).then(() => router.back())
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    const handleDelete = () => {
        const id = entry?._id
        if (!id) return
        mutationDelete.mutate(id)
        setConfirm(false)
    }
    
    const handleActionChange = (newAction: string) => {
        const path = `/entries/${newAction}`;
        setAdvancedView(true);
        router.replace(path)//, undefined,  { shallow: true });
    }

    const handleEditToggle = () => {
        if (action == "Edit") {
            handleActionChange("View")
        }
        else if (action == "View") {
            handleActionChange("Edit")
        }
    }
    useEffect(() => {
        if (action !== 'Create' && !entry._id){
            router.back()
        }
    }, [entry, action, router])
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
                {!advancedView && entry !== undefined ?
                // The following page is used when someone just clicks the view button from the entry table
                // There is no way to return to this page because it is not set up to update correctly when an entry is updated, this could be done but would be somewhat nontrivial
                <Box display={"flex"} flexDirection="column">
                    <Box sx={{...PaperStyles, margin: "1vh", marginBottom: 0}}>
                        <Stack display={'flex'}>
                            <Typography variant={'h5'} sx={{alignSelf: 'center'}}>View Entry</Typography>
                        </Stack>
                        <Button
                            variant={'contained'}
                            onClick={()=>router.back()}
                            sx={{marginTop: "1vh", marginBottom: "1vh"}}
                            color={'secondary'}
                        >
                            <Typography variant="h6" sx={{color: "secondary.contrastText"}} fontSize={"1.2vh"}>Back to Search</Typography>
                        </Button>
                        <Button variant="contained" onClick={() => {setAdvancedView(true)}} sx={{marginTop: "1vh", marginBottom: "1vh"}}><Typography variant="h6" sx={{color: "secondary.contrastText"}} fontSize={"1.2vh"}>Advanced View</Typography></Button>
                    </Box>
                    <Box sx={{...PaperStyles, marginTop: 0}}>
                        <Typography variant="h6">Account Info</Typography>
                        <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                            {entry.account_name != undefined ?
                                <Box width={boxWidth}>
                                    <Typography>Account Name: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.account_name}</Typography>
                                </Box> : []
                            }
                            {entry["date_year"] != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Date: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{(entry?.month !== undefined ? entry.month !== "" ? months[parseInt(entry.month) - 1] + " " : "" : "")}{entry.Day != undefined ? entry.Day + " " : ""}{entry["date_year"]}</Typography>
                                </Box> : []
                            }
                            {(( entry?.currency?.pounds !== undefined) || (entry?.sterling?.pounds !== undefined)) ?
                                <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Currency Transacted: </Typography>
                                    {(entry.currency_type ?? "Currency") === "Both" && entry.currency && entry.sterling
                                        ?
                                        <div>
                                            <Typography sx={{marginLeft: tabSize}}>{moneyToLongString(entry.currency.pounds, entry.currency.shillings, entry.currency.pennies, entry.currency.farthings)}, {(entry.currency_colony ?? "Unknown") != "Unknown" ? entry.currency_colony + " " : ""}Currency</Typography>
                                            <Typography sx={{marginLeft: tabSize}}>{moneyToLongString(entry.sterling.pounds, entry.sterling.shillings, entry.sterling.pennies, entry.sterling.farthings)}, Sterling</Typography>
                                        </div>
                                        :
                                        <Typography sx={{marginLeft: tabSize}}>
                                            {(entry.sterling && (entry.currency_type ?? "Currency") === "Sterling") ? moneyToLongString(entry.sterling.pounds, entry.sterling.shillings, entry.sterling.pennies, entry.sterling.farthings) + ', ' : ''}
                                            {entry.currency ? moneyToLongString(entry.currency.pounds, entry.currency.shillings, entry.currency.pennies, entry.currency.farthings) + ', ' : ''}
                                            {(entry.currency_colony ?? "Unknown") !== "Unknown" ? " " + entry.currency_colony + " " : " "}{entry.currency_type ?? "Currency"}
                                        </Typography>
                                    }
                                    
                                </Box> : []
                            }
                            {entry.debit_or_credit != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Debit or Credit Record: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.debit_or_credit}</Typography>
                                </Box> : []
                            }
                        </Paper>

                        <Typography variant="h6" sx={{marginTop: "4vh"}}>Item Info</Typography>
                        <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                            {entry.text_as_parsed != undefined ?
                                <Box width={boxWidth}>
                                    <Typography>Partial Entry: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.text_as_parsed}</Typography>
                                </Box> : []
                            }
                            {entry.item != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Item: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.amount != undefined ? entry.amount + " " : ""}{entry.item}</Typography>
                                </Box> : []
                            }
                            {entry.price != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Price: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.price}</Typography>
                                </Box> : []
                            }
                            {entry.Commodity != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Commodity: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.Quantity != undefined ? entry.Quantity + " (pounds) " : ""}{entry.Commodity}</Typography>
                                </Box> : []
                            }
                            {entry.original_entry != undefined ?
                                <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Complete Entry: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.original_entry}</Typography>
                                </Box> : []
                            }
                            {entry.Final != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Comments: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.Final}</Typography>
                                </Box> : []
                            }
                            {entry.final != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Comments: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.final}</Typography>
                                </Box> : []
                            }
                        </Paper>
                        
                        {((entry.tobacco_entries != undefined) && (entry.tobacco_entries.length > 0)) || ((entry.tobacco_marks != undefined) && (entry.tobacco_marks.length > 0)) || (entry.tobacco_location != undefined) || (entry.tobacco_amount_off != undefined) ?
                        <div>
                            <Typography variant="h6" sx={{marginTop: "4vh"}}>Tobacco Information</Typography>
                            <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                                {entry.tobacco_amount_off != undefined ?
                                    <Box width={boxWidth}>
                                        <Typography>Tobacco Off: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{entry.tobacco_amount_off}</Typography>
                                    </Box> : []
                                }
                                {entry.tobacco_location != undefined ?
                                    <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Tobacco Location: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{entry.tobacco_location}</Typography>
                                    </Box> : []
                                }
                                {(entry.tobacco_entries != undefined) && (entry.tobacco_entries.length > 0) ?
                                    <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Tobacco Entries: </Typography>
                                        <div>
                                            {entry.tobacco_entries.map((value, index) => {
                                                return <Typography sx={{marginLeft: tabSize}} key={((value.number ?? "asdikjsaiofjd") + "tenum" + index + (value.weight ?? "gjfsdo"))}>N {value.number ?? "No Note Number"}: {((value.gross_weight == undefined) && (value.tare_weight == undefined)) ? (value.weight ?? "No Final") + " Weight Tobacco" : (value.gross_weight + " - " + value.tare_weight + " = " + (value.weight ?? "No Final") + " Weight Tobacco")}</Typography>
                                            })}
                                        </div>
                                    </Box> : []
                                }
                                {(entry.tobacco_marks != undefined) && (entry.tobacco_marks.length > 0) ?
                                    <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Tobacco Marks: </Typography>
                                        <div>
                                            {entry.tobacco_marks.map((value, index) => {
                                                return <Typography key={(value.mark_text ?? "asdas") + (value.mark_number ?? "sdasdafsd") + index} sx={{marginLeft: tabSize}}>{value.mark_text ?? "No Mark Text"}: {value.mark_number ?? "No Mark Number"}</Typography>
                                            })}
                                        </div>
                                    </Box> : []
                                }
                            </Paper>
                        </div>
                        : []
                        }

                        {((entry.people != undefined) && (entry.people.length > 0)) || ((entry.mentions != undefined) && (entry.mentions.length > 0)) || (entry.folio_reference != undefined) ?
                        <div>
                            <Typography variant="h6" sx={{marginTop: "4vh"}}>Relationship Information</Typography>
                            <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                                {entry.folio_reference != undefined ?
                                    <Box width={boxWidth}>
                                        <Typography>Folio Referenced: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>Page {entry.folio_reference}</Typography>
                                    </Box> : []
                                }
                                {(entry.people != undefined) && (entry.people.length > 0) ?
                                    <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>People: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{entry.people.join("; ")}</Typography>
                                    </Box> : []
                                }
                                {(entry.mentions != undefined) && (entry.mentions.length > 0) ?
                                    <Box width={box2xWidth} sx={{marginLeft: boxMargin}}>
                                        <Typography>Mentioned: </Typography>
                                        <Typography sx={{marginLeft: tabSize}}>{entry.mentions.join("; ")}</Typography>
                                    </Box> : []
                                }
                            </Paper>
                        </div>
                        : []
                        }
                        
                        <Typography variant="h6" sx={{marginTop: "4vh"}}>Store Info</Typography>
                        <Paper sx={{backgroundColor: "secondary.light", padding: "1vh", display: "flex", flexDirection: "row"}}>
                            {entry.store != undefined ?
                                <Box width={boxWidth}>
                                    <Typography>Store: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.store} ({entry.Marginalia ?? ""})</Typography>
                                </Box> : []
                            }
                            {entry.store_owner != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Owner: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>{entry.store_owner}</Typography>
                                </Box> : []
                            }
                            {entry?.ledger?.folio_page != undefined ?
                                <Box width={boxWidth} sx={{marginLeft: boxMargin}}>
                                    <Typography>Ledger Info: </Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Page {entry.ledger.folio_page}</Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Entry {entry.ledger.entry_id}</Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Year {entry.ledger.folio_year}</Typography>
                                    <Typography sx={{marginLeft: tabSize}}>Citation {entry.ledger.reel}</Typography>
                                    {/*<Typography sx={{marginLeft: tabSize}}>Folio Reference {entry.folio_reference}</Typography>*/}
                                </Box> : []
                            }
                        </Paper>

                    </Box>
                </Box>

                :
                // The following page is used when the advanced view button is clicked or edit/create is clicked from the entry view page
                <Formik
                    enableReinitialize
                    validateOnBlur
                    initialValues={initFormValues}
                    // validationSchema={entrySchema}
                    onSubmit={(values) => {
                        // console.log(values)
                        handleSubmit(values, action, entry?._id)//.then(p => console.log(p))
                    }}
                >{({
                       values,
                       touched,
                       errors,
                       handleChange,
                       handleBlur,
                        // initialValues,
                        // setValues
                        resetForm
                   }) => (
                    <Form noValidate>
                        {/*{<></> && console.log(Object.entries(values).filter(e=>e[1] === null))}*/}
                        <Stack>
                        <Typography variant={'h5'} gutterBottom sx={{alignSelf: 'center'}}>Advanced {action} Entry</Typography>
                        </Stack>
                        <Button
                            variant={'contained'}
                            onClick={()=>router.back()}
                            sx={{marginTop: "1vh", marginBottom: "1vh"}}
                            color={'secondary'}
                        >
                            <Typography variant="h6" sx={{color: "secondary.contrastText"}} fontSize={"1.2vh"}>Back to Search</Typography>
                        </Button>
                        {notCreate &&
                          <Button
                            sx={{ color: "secondary.contrastText", alignSelf: 'start' }}
                            variant={'contained'}
                            onClick={() => setAdvancedView(false)}
                          >
                            <Typography variant="h6" sx={{color: "secondary.contrastText"}} fontSize={"1.2vh"}>SImple View</Typography>
                          </Button>
                        }
                        <FormGroup>
                            <FormLabel>
                                <Divider flexItem sx={{mt:1, mb:1}}>Account Info</Divider>
                            </FormLabel>
                            
                            <Grid container spacing={1}>
                                {entryInfoFields.map(k=>(
                                    <Grid item xs={3} key={k}>
                                        <Field as={TextField}
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
                                        <Field as={TextField}
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
                                <Grid item xs={4} key={k}>
                                    <Field
                                        as={TextField}
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
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={4} key={"farthings"}>
                                    <Field
                                        as={TextField}
                                        name={"farthings"}
                                        autoFocus
                                        margin="dense"
                                        disabled={disabled}
                                        label={"Penny 12ths"}
                                        fullWidth
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="outlined"
                                        // value={values["farthings" as keyof typeof values]}
                                        defaultValue={values["farthings" as keyof typeof values]}
                                    />
                            </Grid>
                            <Grid item xs={4} key={"farthings_ster"}>
                                <Field
                                    as={TextField}
                                    name={"farthings_ster"}
                                    autoFocus
                                    margin="dense"
                                    disabled={disabled}
                                    label={"Penny 12ths Sterling"}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    // value={values["farthings_ster" as keyof typeof values]}
                                    defaultValue={values["farthings_ster" as keyof typeof values]}
                                />
                            </Grid>
                        </Grid>
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <FormLabel>
                                <Divider flexItem sx={{mt:1, mb:1}}>Store Info</Divider>
                            </FormLabel>
        
                            <Grid container spacing={1}>
                                {storeInfoFields.map(k=>(
                                    <Grid item xs={3} key={k}>
                                        <Field
                                            as={TextField}
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
                                        //    value={values[k as keyof typeof values]}
                                           defaultValue={values[k as keyof typeof values]}
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
                                        <Field
                                            as={TextField}
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
                                        //    value={values[k as keyof typeof values]}
                                           defaultValue={values[k as keyof typeof values]}
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
                                    <Field as={OutlinedInput}
                                        name={`people.${k}`}
                                        // autoFocus
                                        margin="dense"
                                        disabled={disabled}
                                        label={"Person"}
                                        // fullWidth
                                        // variant="outlined"
                                        value={person}
                                        onBlur={handleBlur}
                                        error={
                                            getIn(touched, person) &&
                                            !!getIn(errors, person)
                                        }
                                        onChange={handleChange}
                                        //defaultValue={person}
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
                                    <Field as={OutlinedInput}
                                        name={`mentions.${k}`}
                                        // autoFocus
                                        margin="dense"
                                        disabled={disabled}
                                        label={"Mentioned"}
                                        // fullWidth
                                        // variant="outlined"
                                        value={person}
                                        onBlur={handleBlur}
                                        error={
                                            getIn(touched, person) &&
                                            !!getIn(errors, person)
                                        }
                                        onChange={handleChange}
                                        //defaultValue={person}
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
                                        <Field as={TextField}
                                            name={`tobacco_entries.${k}.number`}
                                            autoFocus
                                            margin="dense"
                                            disabled={disabled}
                                            label={"number"}
                                            // fullWidth
                                            // variant="outlined"
                                            value={t.number}
                                            onChange={handleChange}
                                            //defaultValue={t.number}
                                        />
                                        <Field as={TextField}
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
                                        <Field as={TextField}
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
                                        <Field as={TextField}
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
                                        <Field as={TextField}
                                            name={`tobacco_marks.${k}.mark_number`}
                                            autoFocus
                                            margin="dense"
                                            disabled={disabled}
                                            label={"Mark Number"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.mark_number}
                                            onChange={handleChange}
                                            defaultValue={t.mark_number}
                                        />
                                        <Field as={TextField}
                                            name={`tobacco_marks.${k}.mark_text`}
                                            autoFocus
                                            margin="dense"
                                            disabled={disabled}
                                            label={"Mark Text"}
                                            // fullWidth
                                            // variant="outlined"
                                            // value={t.mark_text}
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
                        {isAdminOrModerator &&
                        <Grid container>
                            {/*<Stack direction={'row'}>*/}
                            <Grid item xs={11}>
                                  <Stack direction={'row'} justifyContent={'start'}>
                                      {action === 'View' &&
                                        <Button
                                          onClick={()=>handleEditToggle()}
                                          variant={"contained"}
                                          color={"warning"}
                                        >
                                          Edit
                                        </Button>
                                      }
                                      {!disabled && action === 'Edit' &&
                                          <Button
                                            sx={{color: "secondary.contrastText", alignSelf: 'start'}}
                                            // sx={{ml:1}}
                                            onClick={()=>{handleActionChange('View')
                                                // console.log(initialValues)
                                                // setValues(initialValues)
                                            }}
                                            variant={"contained"}
                                            // color={'warning'}
                                              // type={'reset'}
                                          >
                                            View
                                          </Button>
                                      }
                                      {!disabled && action !== 'View' &&
                                        <Button
                                          sx={{ml:1}}
                                          type={"submit"}
                                          variant={"contained"}
                                          color={'success'}
                                        >
                                          Save
                                        </Button>
                                      }
                                      {!disabled && action === 'Edit' &&
                                        <Tooltip title={"Click to reset changes"}>
                                        <Button
                                          sx={{ml:1}}
                                          onClick={()=>{resetForm()
                                              // console.log(initialValues)
                                              // setValues(initialValues)
                                          }}
                                          variant={"contained"}
                                          color={'warning'}
                                          // type={'reset'}
                                        >
                                          Reset
                                        </Button>
                                        </Tooltip>
                                      }
                                      {action !== 'Create' && !confirm &&
                                        <Button
                                          sx={{ml:1}}
                                          onClick={()=>setConfirm(true)}
                                          variant={"contained"}
                                          color={'error'}
                                        >
                                          Delete
                                        </Button>
                                      }
                                      {action !== 'Create' && confirm &&
                                        <Button
                                          sx={{ml:1}}
                                          onClick={handleDelete}
                                          variant={"contained"}
                                          color={'error'}
                                        >
                                          Confirm ?
                                        </Button>
                                      }
                                      {/*<Box alignSelf={'end'} flex={'inherit'}>*/}
                                      {/*</Box>*/}
                                  </Stack>
                            </Grid>
                            <Grid item xs={1}>
                                {action !== 'View' &&
                                  <Button
                                    variant={'outlined'}
                                    // sx={{mr:2}}
                                      // startIcon={<CloseIcon/>}
                                    onClick={()=>router.back()}
                                  >
                                    Cancel
                                  </Button>
                                }
                            </Grid>
                        </Grid>
                        }
                    </Form>
                )}
                </Formik>
                }
            </Paper>
        </ColorBackground>

    )
}

export default EntryPage
