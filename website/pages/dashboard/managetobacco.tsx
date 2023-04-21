import ColorBackground from "@components/ColorBackground";
import Header from "@components/Header";
import DashboardPageSkeleton from "@components/DashboardPageSkeleton";
import Paper from "@mui/material/Paper";
import { PaperStylesSecondary } from "../../styles/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Form, Formik } from "formik";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@hooks/useAuth.hook";
import { Roles } from "../../config/constants.config";
import * as Yup from 'yup'
import Divider from "@mui/material/Divider";
import { Box } from "@mui/material";

interface TobaccoForm {
    old_mark_number: string,
    new_mark_number: string,
    old_mark_text: string,
    new_mark_text: string
}

const ManageTobacco = () => {
    const { groups } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const initVals:TobaccoForm = useMemo(() => {
        return {
            old_mark_number: '',
            new_mark_number: '',
            old_mark_text: '',
            new_mark_text: ''
        }
    }, [])
    const queryClient = useQueryClient()
    
    const tobaccoSchema = Yup.object().shape({
        old_mark_number: Yup.string().required(),
        new_mark_number: Yup.string().required(),
        old_mark_text: Yup.string().required(),
        new_mark_text: Yup.string().required()
    })
    
    const editTobaccoMutation = useMutation({
        mutationFn: (tobaccoKey:[string, string, string, string]) => {
            const [omn, nmn, omt, nmt] = tobaccoKey
            let saveUrl = `https://api.preprod.shoppingstories.org/edit_tobacco_marks/?` + new URLSearchParams({
                old_mark_number: omn,
                old_mark_text: omt,
                new_mark_number: nmn,
                new_mark_text: nmt
            }).toString();
            // let reqBody = JSON.stringify({ item: item })
            // let req = {
            //     method: "POST",
            //     headers: {
            //         "Accept": "application/json",
            //         "Content-Type": "application/json"
            //     },
            //     body: reqBody
            // }
            return fetch(saveUrl).then(p => {
                console.log(p)
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    
    const editTobacco = useCallback((omn:string, nmn:string, omt:string, nmt:string) => {
        console.log(omn, nmn, omt, nmt)
        editTobaccoMutation.mutate([omn, nmn, omt, nmt])
        // let saveUrl = `https://api.preprod.shoppingstories.org/edit_person/?` + new URLSearchParams({person_id: id}).toString();
        // let reqBody = JSON.stringify({name: name})
        // let req = {
        //     method: "POST",
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json"
        //     },
        //     body: reqBody
        // }
        // fetch(saveUrl, req)//.then(p => {console.log(p)})
    }, [editTobaccoMutation])
    
    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <Typography
                        sx={{ textAlign: 'center', marginBottom: "1.5vh"}}
                        variant="h4"
                        mb={2}
                    >
                        Manage Tobacco Marks
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ width:'100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                            <Paper sx={{flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                                <Stack sx={{ borderBottom: 1, borderColor: 'divider', p: 1, }}>
                                    <Typography
                                        sx={{ textAlign: 'center' }}
                                        variant="h5"
                                        mb={2}
                                    >
                                        Find and Replace Tobacco Marks
                                    </Typography>
                                    <Paper sx={{padding: "1vh"}}>
                                        <Box sx={{padding: "1vh"}}>
                                        <Formik
                                            initialValues={initVals}
                                            validationSchema={tobaccoSchema}
                                            onSubmit={(v)=>editTobacco(v.old_mark_number, v.new_mark_number, v.old_mark_text, v.new_mark_text)}
                                        >{({
                                            values,
                                            // errors,
                                            handleChange,
                                            handleBlur,
                                        }) => (
                                            <Form>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}><Divider flexItem>Mark Number</Divider></Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            name={'old_mark_number'}
                                                            label={'Old Mark Number'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            defaultValue={values.old_mark_number}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            name={'new_mark_number'}
                                                            label={'New Mark Number'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            defaultValue={values.new_mark_number}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} mt={2}><Divider flexItem>Mark Text</Divider></Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            name={'old_mark_text'}
                                                            label={'Old Mark Text'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            defaultValue={values.old_mark_text}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            name={'new_mark_text'}
                                                            label={'New Mark Text'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            defaultValue={values.new_mark_text}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} mt={2}>
                                                        <Button
                                                            type={"submit"}
                                                            variant={'contained'}
                                                            color={'success'}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Form>
                                        )}
                                        </Formik>
                                        </Box>
                                    </Paper>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </DashboardPageSkeleton>
            
            {/* Edit Dialog */}
            
            <Grid item xs={12}>
                <DialogActions>
                    {/*<Stack direction={'row'} spacing={2}>*/}
                    {/*</Stack>*/}
                </DialogActions>
            </Grid>
        </ColorBackground>
    )
}

export default ManageTobacco