import { NextPage } from 'next';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import { Roles } from 'config/constants.config';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import Paper from '@mui/material/Paper';
import { PaperStylesSecondary } from 'styles/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import TextField from '@mui/material/TextField';


const ManagePeoplePage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [successMessage, setSuccessMessage] = useState("");

    const combinePeople = async (name1: string, name2: string, newName: string) => {
        const combineUrl = `https://api.preprod.shoppingstories.org:443/combine_people/?person1_name=${name1}&person2_name=${name2}&new_name=${newName}`;
      
        if (name1 == "" || name2 == "" || newName == "")
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
            person1_name: name1,
            person2_name: name2,
            new_name: newName
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
                        Manage People
                    </Typography>
                </div>
                <Paper sx={{ p: '1rem' }}>
                <Formik
                    initialValues={{ name1: '', name2: '', name3: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        combinePeople(values.name1, values.name2, values.name3);
                        setSubmitting(false);
                    }}
                    >
                    {({ values, isSubmitting, handleChange }) => (
                        <Form>
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField
                            type="text"
                            name="name1"
                            label="Name one"
                            variant="outlined"
                            value={values.name1}
                            onChange={handleChange}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField
                            type="text"
                            name="name2"
                            label="Name two"
                            variant="outlined"
                            value={values.name2}
                            onChange={handleChange}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField
                            type="text"
                            name="name3"
                            label="Combined name"
                            variant="outlined"
                            value={values.name3}
                            onChange={handleChange}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ width: "16vw", marginBottom: "1vh"}}>
                            <Typography fontSize={"1.5vh"} color="secondary.contrastText">
                            Combine People
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

export default ManagePeoplePage;