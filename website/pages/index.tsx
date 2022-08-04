import ImageBackground from '@components/ImageBackground';
import Header from '@components/Header';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import SignInPage from './auth/signin';
import useAuth from '@hooks/useAuth.hook';

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
                    component={Paper}
                    sx={{
                        backgroundColor: `var(--secondary-bg-translucent)`,
                        margin: '3rem',
                        padding: '1rem',
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
                </Grid>
            </Grid>
            {!isLoggedIn && <SignInPage />}
        </ImageBackground>
    );
};

export default Home;
