import { Formik, Form } from 'formik';
import { useMemo } from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// import Stack from "@mui/material/Stack";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";
// import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
interface RelationState {
    open: boolean
    mutation: string
}
interface RelationShipProps {
    open: boolean,
    setOpen: (state:RelationState) => void
    handleSubmit: (p1:string, p2:string, mutation:string) => void
    person1?: string
    person2?: string
    id1?: string
    id2?: string
    mutation:string
}

interface RelationShipForm {
    person1:string,
    person2:string
}

const AddRelationshipDialog = ({open, setOpen, handleSubmit, person1, person2, mutation}: RelationShipProps) => {
    
    const initValues: RelationShipForm = useMemo(() => {
        let vals:RelationShipForm = {person1: '', person2: ''}
        if (person1) {
            vals.person1 = person1
        }
        if (person2){
            vals.person2 = person2
        }
        return vals
    }, [person2, person1])
    
    const submit = async (p1:string, p2:string) => {
        if (p1 === '' || p2 === '') return
        handleSubmit(p1,  p2, mutation)
    }
    
    const handleClose = () => {
        setOpen({open:false, mutation:"closed"})
    }
    
    return (
        <Dialog
            open={open}
        >
            <Grid container alignItems={'center'}>
                <Grid item xs={6}>
                    <DialogTitle>{mutation.charAt(0).toUpperCase() + mutation.slice(1)} Relationship</DialogTitle>
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
                        {/*</Stack>*/}
                    </DialogActions>
                </Grid>
            </Grid>
            <Divider/>
            <DialogContent>
                <Formik
                    initialValues={initValues}
                    onSubmit={(v) => submit(v.person1, v.person2).then(handleClose)}
                >
                <Form noValidate>
                    <Grid
                        container
                        mt={1}
                        spacing={1}
                        alignItems={'center'}
                    >
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name={'person1'}
                                label={'Person 1'}
                            />
                        </Grid>
                        {/*<Grid item xs={2}><CompareArrowsIcon/></Grid>*/}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name={'person2'}
                                label={'Person 2'}
                            />
                        </Grid>
                </Grid>
                </Form>
                </Formik>
            </DialogContent>
        </Dialog>
    )
    
}
export default AddRelationshipDialog