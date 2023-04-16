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

interface EntriesForm {
    reel: number,
    folio_page: string,
    folio_year: string
}

const DeleteEntries = () => {
    const { groups } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const initVals:EntriesForm = useMemo(() => {
        return {
            reel: 0,
            folio_page: '',
            folio_year: '',
        }
    }, [])
    const queryClient = useQueryClient()
    
    const deleteSchema = Yup.object().shape({
        reel: Yup.number().min(1).required(),
        folio_page: Yup.string().required(),
        folio_year: Yup.string().required(),
    })
    
    const deleteEntriesMutation = useMutation({
        mutationFn: (itemKey:[number, string, string]) => {
            const [r, fp, fy] = itemKey
            let saveUrl = `https://api.preprod.shoppingstories.org/delete_entries_by_page/?` + new URLSearchParams({ reel:r.toString(), folio_page:fp, folio_year:fy }).toString();
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
    
    const deleteEntries = useCallback((reel: number, fp: string, fy: string) => {
        deleteEntriesMutation.mutate([reel, fp, fy])
        console.log(reel, fp, fy)
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
    }, [deleteEntriesMutation])
    
    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ width:'100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                            <Paper sx={{flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                                <Stack sx={{ borderBottom: 1, borderColor: 'divider', p: 1, }}>
                                    <Typography
                                        sx={{ textAlign: 'center' }}
                                        variant="h4"
                                    >
                                        Delete Entries
                                    </Typography>
                                    <Formik
                                        initialValues={initVals}
                                        validationSchema={deleteSchema}
                                        onSubmit={(v)=>deleteEntries(v.reel, v.folio_page, v.folio_year)}
                                    >{({
                                           values,
                                           // errors,
                                           handleChange,
                                           handleBlur,
                                       }) => (
                                        <Form>
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        name={'reel'}
                                                        label={'Reel'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={values.reel}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        name={'folio_page'}
                                                        label={'Folio Page'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={values.folio_page}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        name={'folio_year'}
                                                        label={'Folio Year'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={values.folio_year}
                                                    />
                                                    {/*<TextField*/}
                                                    {/*    fullWidth*/}
                                                    {/*    name={'subcategory'}*/}
                                                    {/*    label={'Subcategory'}*/}
                                                    {/*    onChange={handleChange}*/}
                                                    {/*    onBlur={handleBlur}*/}
                                                    {/*    defaultValue={values.name}*/}
                                                    {/*/>*/}
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

export default DeleteEntries