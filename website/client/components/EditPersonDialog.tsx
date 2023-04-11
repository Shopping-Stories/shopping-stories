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
import { Formik, Form, FieldArray, getIn } from "formik";
import { useMemo } from "react";
import { PersonObject } from "../entryUtils";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import AddCircle from "@mui/icons-material/AddCircle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface EditPersonProps {
    open: boolean,
    setOpen: (open:boolean) => void
    handleSubmit: (id:string, name:string) => void
    person?: PersonObject
    relations: {[key:string] : PersonObject}
    id: string
}

interface EditPersonForm {
    name:string,
    related?:string[]
}

const EditPersonDialog = ({open, setOpen, handleSubmit, person, id, relations}: EditPersonProps) => {
    // console.log(relations)
    const initValues: EditPersonForm = useMemo(() => {
        if (!(person && person.name && person._id))
            return {name: ''}
        let vals: EditPersonForm = {
            name: person.name,
        }
        if (person.related.every(r=>!!relations[r])){
            vals.related = person.related
        }
        return vals
    }, [relations, person])
    
    // const relMap = useMemo(() => {
    //     if (person?.related)
    //         return Object.fromEntries(person.related.map(r => [relations[r].name, r]))
    //     return {}
    // }, [])
    
    const submit = async (id:string, name:string, relations?:string[]) => {
        if (id === '' || name === '') return
        // for (let r in relations){
        //
        // }
        console.log(relations)
        handleSubmit(id, name)
    }
    
    const handleClose = () => {
        setOpen(false)
    }
    
    return (
        <Dialog
            open={open}
        >
            <DialogTitle>Edit Person</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initValues}
                    onSubmit={(v) => submit(id, v.name, v.related).then(handleClose)}
                >{({
                       values,
                       touched,
                       errors,
                       handleChange,
                       handleBlur,
                   }) => (
                    <Form noValidate>
                        <Grid container spacing={1} sx={{mt:1}}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name={'name'}
                                    label={'Name'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue={values.name}
                                />
                            </Grid>
                            <br/>
                            <FormGroup>
                                {(!!values?.related?.length)  &&
                                  <FormLabel sx={{mt:3}}>
                                    <Divider flexItem sx={{mt:1, mb:2}}>Related Persons</Divider>
                                  </FormLabel>
                                }
                                <FieldArray
                                    name="related"
                                    render={ (arrayHelpers)=> (
                                        <>
                                            {/*<Box>*/}
                                            {/*  <Button*/}
                                            {/*    startIcon={<AddCircle />}*/}
                                            {/*    onClick={()=> arrayHelpers.push("")}*/}
                                            {/*  >*/}
                                            {/*    Add Person*/}
                                            {/*  </Button>*/}
                                            {/*</Box>*/}
                                            <Grid container spacing={1}>
                                                {/*<FormControl>*/}
                                                {/*    <FormGroup row>*/}
                                                {relations && values?.related?.map((person, k)=>(
                                                    <Grid item xs={12} key={k}>
                                                                {/*<InputLabel>{relations[person]?.name}</InputLabel>*/}
                                                                <OutlinedInput
                                                                    name={`related.${k}`}
                                                                    // autoFocus
                                                                    margin="dense"
                                                                    // label={relations[person]?.name}
                                                                    fullWidth={true}
                                                                    // variant="outlined"
                                                                    // value={person}
                                                                    // placeholder={relations[person]?.name}
                                                                    disabled
                                                                    onBlur={handleBlur}
                                                                    error={
                                                                        getIn(touched, person) &&
                                                                        !!getIn(errors, person)
                                                                    }
                                                                    onChange={handleChange}
                                                                    defaultValue={relations[person]?.name}
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
                                                    </Grid>))}
                                                        {/*    </FormGroup>*/}
                                                        {/*</FormControl>*/}
                                            </Grid>
                                        </>)}/>
                            </FormGroup>
                            <Grid item xs={12}>
                                <DialogActions>
                                    {/*<Stack direction={'row'} spacing={2}>*/}
                                    <Button
                                        type={"submit"}
                                        variant={'contained'}
                                        color={'success'}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        variant={'contained'}
                                        color={'error'}
                                        onClick={()=>setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    {/*</Stack>*/}
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </Form>
                )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
    
}

export default EditPersonDialog