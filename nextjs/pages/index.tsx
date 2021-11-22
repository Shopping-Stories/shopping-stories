import Header from '@components/Header';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useColorMode } from './_app';

const Home: NextPage = () => {
    const [toggleOn, setToggle] = useState<boolean>(false);
    const { toggleColorMode } = useColorMode();

    return (
        <Fragment>
            <div className={backgrounds.imageBackground}>
                <Head>
                    <title>Shopping Stories</title>
                    <meta
                        name="description"
                        content="Revealing Colonial History"
                    />
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
                        <Typography align="center" variant="h2" component="div">
                            Welcome to
                        </Typography>
                        <Typography align="center" variant="h1" component="div">
                            Shopping Stories
                        </Typography>
                    </Grid>
                </Grid>

                <Switch
                    checked={toggleOn}
                    onChange={() => {
                        setToggle(!toggleOn);
                        toggleColorMode();
                    }}
                />
            </div>
        </Fragment>
    );
};

export default Home;
