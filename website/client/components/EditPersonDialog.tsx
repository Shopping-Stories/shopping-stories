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
import { Formik, Form } from 'formik';
import { useMemo } from "react";

interface EditPersonProps {
    open: boolean,
    setOpen: (open:boolean) => void
    handleSubmit: (id:string, name:string) => void
    person: string
    id: string
}

interface EditPersonForm {
    name:string,
    // relationships:string
}

const EditPersonDialog = ({open, setOpen, handleSubmit, person, id}: EditPersonProps) => {
    
    const initValues: EditPersonForm = useMemo(() => {
        let vals:EditPersonForm = {name: person}
        return vals
    }, [person])
    
    const submit = async (id:string, name:string) => {
        if (id === '' || name === '') return
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
                    onSubmit={(v) => submit(id, v.name).then(handleClose)}
                >
                    <Form noValidate>
                        <Grid container spacing={1} sx={{mt:1}}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name={'name'}
                                    label={'Name'}
                                />
                            </Grid>
                            {/*<Grid item xs={6}>*/}
                            {/*    <TextField*/}
                            {/*        fullWidth*/}
                            {/*        name={'person2'}*/}
                            {/*        label={'Person 2'}*/}
                            {/*    />*/}
                            {/*</Grid>*/}
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
                </Formik>
            </DialogContent>
        </Dialog>
    )
    
}

export default EditPersonDialog