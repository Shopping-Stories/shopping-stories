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
import { Box } from "@mui/material";

interface MentionForm {
    old_mention: string,
    new_mention: string
}

const ManageMentions = () => {
    const { groups } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const initVals:MentionForm = useMemo(() => {
        return {
            old_mention: '',
            new_mention: ''
        }
    }, [])
    const queryClient = useQueryClient()
    
    const MentionSchema = Yup.object().shape({
        old_mention: Yup.string().required(),
        new_mention: Yup.string().required()
    })
    
    const replaceMentionMutation = useMutation({
        mutationFn: (mentionKey:[string, string]) => {
            const [prev, next] = mentionKey
            let saveUrl = `https://api.shoppingstories.org/find_and_replace_mention/?` + new URLSearchParams({ old_mention:prev, new_mentions:next }).toString();
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
    
    const replaceMention = useCallback((prev:string, next:string) => {
        console.log(prev, next)
        replaceMentionMutation.mutate([prev, next])
        // let saveUrl = `https://api.shoppingstories.org/edit_person/?` + new URLSearchParams({person_id: id}).toString();
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
    }, [replaceMentionMutation])
    
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
                        Manage Mentions
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
                                        Find and Replace Mentions
                                    </Typography>
                                    <Paper sx={{padding: "1vh"}}>
                                    <Box sx={{padding: "1vh"}}>
                                    <Formik
                                        initialValues={initVals}
                                        validationSchema={MentionSchema}
                                        onSubmit={(v)=>replaceMention(v.old_mention, v.new_mention)}
                                    >{({
                                           values,
                                           // errors,
                                           handleChange,
                                           handleBlur,
                                       }) => (
                                        <Form>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        name={'old_mention'}
                                                        label={'Old Mention'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={values.old_mention}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        name={'new_mention'}
                                                        label={'New Mention'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={values.new_mention}
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

export default ManageMentions