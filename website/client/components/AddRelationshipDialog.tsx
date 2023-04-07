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

interface RelationShipProps {
    open: boolean,
    setOpen: (open:boolean) => void
    handleSubmit: (p1:string, p2:string) => void
    person1?: string
    person2?: string
    id1?: string
    id2?: string
}

interface RelationShipForm {
    person1:string,
    person2:string
}

const AddRelationshipDialog = ({open, setOpen, handleSubmit, person1, person2}: RelationShipProps) => {
    
    const initValues: RelationShipForm = useMemo(() => {
        let vals:RelationShipForm = {person1: '', person2: ''}
        if (person1) {
            vals.person1 = person1
        }
        if (person2){
            vals.person2 = person2
        }
        return vals
    }, [person2, person2])
    
    const submit = async (p1:string, p2:string) => {
        if (p1 === '' || p2 === '') return
        handleSubmit(p1,  p2)
    }
    
    const handleClose = () => {
        setOpen(false)
    }
    
    return (
        <Dialog
            open={open}
        >
            <DialogTitle>New Relationship</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initValues}
                    onSubmit={(v) => submit(v.person1, v.person2).then(handleClose)}
                >
                <Form noValidate>
                    <Grid container spacing={1} sx={{mt:1}}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name={'person1'}
                                label={'Person 1'}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name={'person2'}
                                label={'Person 2'}
                            />
                        </Grid>
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
export default AddRelationshipDialog