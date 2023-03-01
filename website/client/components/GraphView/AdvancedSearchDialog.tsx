import { useState, useMemo } from "react";
import { useFormik, Formik, FieldArray, Form, getIn } from 'formik';
import {advancedSearchSchema} from "../../formikSchemas";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
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
import Stack from "@mui/material/Stack";

interface AdvancedSearchOptions {
    // search: string,
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
    setSearch: (search:string) => void
    setAdvanced: (open:boolean) => void
    open: boolean
    // fuzzy: boolean
}

const AdvancedSearchDialog = ({setSearch, setAdvanced, open}: EntryDialogProps) => {
    // console.log(dialogType, entry)
    const [fuzzy, setFuzzy] = useState<boolean>(false)
    
    const initFormValues: Partial<AdvancedSearchOptions> = useMemo(()=>{
        return {}
    }, [])
    
    const handleSubmit = async (search: Partial<AdvancedSearchOptions>, fuzzy: boolean) => {
        let req = "https://api.preprod.shoppingstories.org/itemsearch"
        let query = new URLSearchParams(Object.entries(search).map(e=>e)).toString()
        
        if (fuzzy){
            req += "-fuzzy/?" + query
        } else {
            req += "/?" + query
        }
        console.log(req)
        setSearch(req)
    }
    
    const handleClose = () => {
        setAdvanced(false);
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
                        handleSubmit(values, fuzzy).then(handleClose)
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
                <DialogContentText sx={{mt:3}}>Advanced Search</DialogContentText>
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
                    <ButtonGroup color={'primary'} variant={'contained'}>
                        <Button
                            type={"submit"}
                            onClick={()=>setFuzzy(false)}
                        >
                            Advanced Search
                        </Button>
                        <Button
                            type={"submit"}
                            onClick={()=>setFuzzy(true)}
                        >
                            Fuzzy Advanced Search
                        </Button>
                    </ButtonGroup>
                    <Button onClick={handleClose} color={'error'} variant={'contained'}> Cancel</Button>
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