import { NextPage } from 'next';
import useAuth, {
    // isInGroup
} from '@hooks/useAuth.hook';
import { Roles } from 'config/constants.config';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import Paper from '@mui/material/Paper';
import { PaperStylesSecondary } from 'styles/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, {
    useState,
    // useEffect
} from "react";
import { Formik, Form,
    // Field,
    // ErrorMessage
} from 'formik';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';


const ManageItemsPage: NextPage = () => {
    const {
        groups,
        // loading
    } = useAuth('/', [Roles.Admin]);
    // const isAdmin = isInGroup(Roles.Admin, groups);
    // const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [successMessage, setSuccessMessage] = useState("");

    const combineItems = async (item1: string, item2: string, newItem: string) => {
        const combineUrl = `https://api.shoppingstories.org:443/combine_items/?primary_item=${encodeURIComponent(item1)}&secondary_item=${encodeURIComponent(item2)}&new_item_name=${encodeURIComponent(newItem)}`;
      
        if (item1 == "" || item2 == "" || newItem == "")
        {
            setSuccessMessage("Field(s) cannot be empty.");
            return;
        }
        
        const res = await fetch(combineUrl, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            primary_item: item1,
            secondary_item: item2,
            new_item_name: newItem
          })
        });
      
        const text = await res.json();
        // if (res.status == 200)
        //     setSuccessMessage("200");
        // else
        setSuccessMessage(text.message);
      }
      
      

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                <div>
                    <Typography
                        sx={{ textAlign: 'center' }}
                        variant="h4"
                    >
                        Combine Items
                    </Typography>
                </div>
                <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ width:'100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                <Paper sx={{ p: '1rem', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                <Formik
                    initialValues={{ item1: '', item2: '', newItem: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        combineItems(values.item1, values.item2, values.newItem);
                        setSubmitting(false);
                    }}
                    >
                    {({ values, isSubmitting, handleChange }) => (
                        <Form>
                            <Grid container>
                                <Grid item xs={6}>
                                <TextField
                                fullWidth
                                type="text"
                                name="item1"
                                label="Primary item"
                                variant="outlined"
                                value={values.item1}
                                onChange={handleChange}
                                />
                                </Grid>
                                <Grid item xs={6}>
                                <TextField
                                fullWidth
                                type="text"
                                name="item2"
                                label="Secondary item"
                                variant="outlined"
                                value={values.item2}
                                onChange={handleChange}
                                />
                                </Grid>
                                
                            </Grid>
                            <Grid container sx={{paddingTop: "0.5vh"}}>
                            <Grid item xs={6}>
                                <TextField
                                fullWidth
                                type="text"
                                name="newItem"
                                label="Combined item"
                                variant="outlined"
                                value={values.newItem}
                                onChange={handleChange}
                                />
                            </Grid>
                            </Grid>
                        <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ width: "16vw", marginTop: "1vh"}}>
                            <Typography fontSize={"1.5vh"} color="secondary.contrastText">
                            Combine Items
                            </Typography>
                        </Button>
                        </Form>
                    )}
                    </Formik>

                    {successMessage && <p>{successMessage}</p>}
                {/* <form>
                    <TextField id="name_one" label="Name one" variant="outlined" />
                    <TextField id="name_two" label="Name two" variant="outlined" />
                    <TextField id="name_three" label="Name three" variant="outlined" />
                    <Button variant="contained" sx={{ width: "16vw", marginBottom: "1vh"}} component="label" hidden={!isAdminOrModerator}>
                        <Typography fontSize={"1.5vh"} color="secondary.contrastText">
                            Combine People
                        </Typography>
                    </Button>
                </form> */}
                </Paper>
                </Grid>
                </Grid>
                {/* <p>Person 1 name:</p>
                <p>Person 2 name:</p>
                <p>New name:</p>
                {isAdminOrModerator && 
                    (<>
                    <Button variant="contained" sx={{ width: "16vw", marginBottom: "1vh"}} component="label" hidden={!isAdminOrModerator}>
                        <Typography fontSize={"1.5vh"} color="secondary.contrastText">
                            Combine People
                        </Typography>
                    </Button>
                    </>)
                    } */}
                </Paper>
            </DashboardPageSkeleton>
        </ColorBackground>
    );
};

export default ManageItemsPage;