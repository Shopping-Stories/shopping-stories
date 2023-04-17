import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Formik, Form, FieldArray, getIn } from "formik";
import { useMemo } from "react";
import { PersonObject } from "../entryUtils";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";
// import Box from "@mui/material/Box";
// import AddCircle from "@mui/icons-material/AddCircle";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";

interface EditModalState {
    open:boolean
    mode:string
}

interface EditPersonProps {
    open: boolean,
    setOpen: (state:EditModalState) => void
    handleSubmit: (id:string, name:string) => void
    person?: PersonObject
    relations: {[key:string] : PersonObject}
    mode:string
    id: string
}

interface EditPersonForm {
    name:string,
    related?:string[]
}

const EditPersonDialog = ({open, setOpen, handleSubmit, person, id, relations, mode}: EditPersonProps) => {
    // console.log(relations)
    const initValues: EditPersonForm = useMemo(() => {
        if (!(person && person.name && person._id))
            return {name: ''}
        let vals: EditPersonForm = {
            name: person.name,
        }
        if (person.related && person.related.every(r=>!!relations[r])){
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
        setOpen({open:false, mode:'closed'})
    }
    
    if (mode === 'edit') return (
        <Dialog
            open={open}
        >
            <Grid container alignItems={'center'} mt={1}>
                <Grid item xs={6}>
                    <DialogTitle>Edit Person</DialogTitle>
                </Grid>
                <Grid item xs={6}>
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
                            onClick={()=>handleClose()}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Grid>
                {/*<Grid item xs={12}><Divider /></Grid>*/}
            </Grid>
            <Divider />
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
                        <Grid container spacing={1}>
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
                            <Grid item xs={12}>
                                <br/>
                                {false && (!!values?.related?.length)  &&
                                <FormGroup>
                                  <FormLabel sx={{mt:0}}>
                                    <Divider flexItem sx={{mt:0, mb:3}}>Related Persons</Divider>
                                  </FormLabel>
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
                              }
                            </Grid>
                        </Grid>
                    </Form>
                )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
    else return (
            <Dialog
                open={open}
            >
                <Grid container alignItems={'center'} mt={1}>
                    <Grid item xs={6}>
                        <DialogTitle>View Relationships</DialogTitle>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogActions>
                            <Button
                                variant={'contained'}
                                color={'error'}
                                onClick={()=>handleClose()}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider/></Grid>
                <DialogContent>
                    <Grid item xs={12} container spacing={1}>
                        {/*<FormControl>*/}
                        {/*    <FormGroup row>*/}
                        {relations && Object.entries(relations).map((p, i)=>(
                            <Grid item xs={12} key={p[0]}>
                                <Typography>{`${i+1}.\t${p[1].name}`}</Typography>
                            </Grid>))}
                        {/*    </FormGroup>*/}
                        {/*</FormControl>*/}
                    </Grid>
                </DialogContent>
            </Dialog>
        )
}

export default EditPersonDialog