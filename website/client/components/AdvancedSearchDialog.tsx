import { useMemo } from "react";
import { Formik, Form } from 'formik';
import {advancedSearchSchema} from "../formikSchemas";
import {
    // SearchAction,
    useSearchDispatch
} from "@components/context/SearchContext";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
// import { useRouter } from "next/router";

export interface AdvancedSearchOptions {
    item: string,
    cat: string,
    subcat: string,
    amt: string,
    acc_name: string,
    person: string,
    co: string,
    year: string,
    page: string
}

interface EntryDialogProps {
    // setSearch: (search:SearchAction) => void
    setAdvancedOpen: (open:boolean) => void
    setFuzzy: (fuzzy:boolean) => void
    setAdvSubmitted: (submitted:boolean) => void
    open: boolean
    fuzzy: boolean
    toGraph: (query:string) => void
}

const AdvancedSearchDialog = ({ setAdvancedOpen, open, fuzzy, setFuzzy, toGraph, setAdvSubmitted}: EntryDialogProps) => {
    // console.log(dialogType, entry)
    // const [fuzzy, setFuzzy] = useState<boolean>(false)
    const initFormValues: Partial<AdvancedSearchOptions> = useMemo(()=>{
        return {}
    }, [])
    const setSearch = useSearchDispatch()
    const handleSubmit = async (search: Partial<AdvancedSearchOptions>) => {
        // console.log('adv set search')
        setAdvSubmitted(true)
        setSearch({
            type: fuzzy ? "FUZZY_ADVANCED" : "ADVANCED",
            payload: new URLSearchParams(Object.entries(search).map(e => e)).toString()
        })
    }
    
    // const toAdvGraph = (search: Partial<AdvancedSearchOptions>, fuzzy: boolean)  => {
    //     const path = `/entries/graphview/${makeReq(search, fuzzy)}`;
    //     router.push({
    //         pathname: path,
    //         query: {fuzzy:fuzzy, advanced:true}
    //     });
    // }
    
    const handleClose = () => {
        setAdvancedOpen(false);
    };
    
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'xl'}
        >
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogContent>
                <Formik
                    validateOnBlur
                    initialValues={initFormValues}
                    validationSchema={advancedSearchSchema}
                    onSubmit={(values) => {
                        console.log(values)
                        handleSubmit(values).then(handleClose)
                    }}
                >{({ 
                    values, 
                    touched, 
                    errors, 
                    handleChange, 
                    handleBlur, 
                    // isValid
                }) => (
                <Form noValidate>
                {/*<DialogContentText sx={{mt:3}}>Advanced Search</DialogContentText>*/}
                <Grid container spacing={1}>
                    {fields.map(k =>
                        <Grid item xs={4} key={k}>
                            <TextField
                                autoFocus
                                name={k}
                                margin="dense"
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
                                // defaultValue={values[k as keyof typeof values]}
                            />
                        </Grid>
                    )}
                </Grid>
                <DialogActions>
                    <Stack direction={'row'} spacing={2}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={fuzzy}
                                    onChange={e => setFuzzy(e.target.checked)}
                                />
                            }
                            // label={`Fuzzy: ${fuzzy ? "on" : "off"}`}
                            label={"Fuzzy"}
                            labelPlacement="start"
                            name={"fuzzy"}
                        />
                        <Divider flexItem orientation={"vertical"}/>
                        <Button
                            type={"submit"}
                            // onClick={()=>setFuzzy(false)}
                            variant={'contained'}
                            color={'success'}
                        >
                            Submit
                        </Button>
                        <Divider flexItem orientation={"vertical"}/>
                        <Button
                            onClick={()=>toGraph(new URLSearchParams(Object.entries(values).map(e => e)).toString())}
                            variant={"contained"}
                            color={'secondary'}
                        >
                            Graph View
                        </Button>
                        <Divider flexItem orientation={"vertical"}/>
                        <Button onClick={handleClose} color={'error'} variant={'contained'}> Cancel</Button>
                    </Stack>
                </DialogActions>
                </Form>
                )}</Formik>
            </DialogContent>
        </Dialog>
    )
}
export default AdvancedSearchDialog


const fieldNames = {
    // search: "Search",
    item: "Item",
    cat: "Category",
    subcat: "Subcategory",
    amt: "Amount",
    acc_name: "Account Name",
    person: "Person",
    co: "Store Owner",
    year: "Folio Year",
    page: "Folio Page"
}

const fields: (keyof typeof fieldNames)[] = [
    // "search",
    "item",
    "cat",
    "subcat",
    "amt",
    "acc_name",
    "person",
    "co",
    "year",
    "page"
]