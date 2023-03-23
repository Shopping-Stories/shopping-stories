import ImageBackground from '@components/ImageBackground';
import Header from '@components/Header';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import useAuth from '@hooks/useAuth.hook';
import Stack from "@mui/material/Stack";
import MuiNextLink from "@components/MuiNextLink";
import { LinkColor } from "../styles/styles";
import Divider from "@mui/material/Divider";
// import SignInPage from './auth/signin';
// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";

const homeFont = {
    fontWeight: 'regular',
    // outline: 'white',
    // outlineColor: 'white',
    // outlineWidth: 'medium',
    // underlineAlways: true,
    // underlineThickness: '3px',
    // fontFamily: 'Merriweather',
    // backgroundColor: `var(--secondary-bg)`,
    // borderRadius: '5px'
}

const Home: NextPage = () => {
    const { isLoggedIn } = useAuth();
    return (
        <ImageBackground>
            <Head>
                <title>Shopping Stories</title>
                <meta name="description" content="Revealing Colonial History" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                margin="auto"
            >
                <Grid
                    item
                    md={4}
                    sm={8}
                    xs={10}
                    // component={Paper}
                    // sx={{}}
                >
                    <Paper
                        variant={'outlined'}
                        sx={{
                            backgroundColor: `var(--secondary-bg-translucent)`,
                            margin: '3rem',
                            padding: '1rem',
                            borderRadius: '20px'
                        }}
                    >
                    <Typography
                        align="center"
                        variant="h2"
                        component="div"
                        sx={{ fontFamily: 'Merriweather' }}
                    >
                        Welcome to
                    </Typography>
                    <Typography
                        align="center"
                        variant="h1"
                        component="div"
                        sx={{
                            fontWeight: 'regular',
                            fontFamily: 'Merriweather',
                        }}
                    >
                        Shopping Stories
                    </Typography>
                    <Divider sx={{mt:1, mb:1, border:.5, borderColor:'black'}}/>
                    {
                        !isLoggedIn &&
                        <Stack
                          direction={'row'}
                          justifyContent={'space-evenly'}
                          spacing={4}
                          // sx={{backgroundColor: `var(--secondary-bg)`, borderRadius: '20px'}}
                        >
                            <MuiNextLink
                                sx={{...LinkColor, ...homeFont}}
                                variant={'h6'}
                                href="/entries"
                            >
                                Continue As Guest
                            </MuiNextLink>
                            <MuiNextLink sx={{...LinkColor, ...homeFont}} variant={'h6'} href="/auth/signin">
                                Sign In
                            </MuiNextLink>
                            {/*<Divider flexItem orientation={'vertical'}/>*/}
                            <MuiNextLink sx={{...LinkColor, ...homeFont}}  variant={'h6'} href="/auth/signup">
                                Sign Up
                            </MuiNextLink>
                            {/*<Divider flexItem orientation={'vertical'}/>*/}
                            <MuiNextLink sx={{...LinkColor, ...homeFont}}  variant={'h6'} href="/auth/forgot-password">
                                Forgot Password
                            </MuiNextLink>
                        </Stack>
                    }
                    </Paper>
                </Grid>
                {/*<Grid*/}
                {/*    item*/}
                {/*    component={Paper}*/}
                {/*    sx={{*/}
                {/*        backgroundColor: `var(--secondary-bg-translucent)`,*/}
                {/*        margin: '3rem',*/}
                {/*        padding: '1rem',*/}
                {/*    }}*/}
                {/*>*/}
                
                {/*</Grid>*/}
            </Grid>
            {/*{!isLoggedIn && <SignInPage />}*/}
        </ImageBackground>
    );
};

export default Home;
