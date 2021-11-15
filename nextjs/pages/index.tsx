import Header from '@components/Header';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
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
                    style={{ minHeight: '100vh' }}
                >
                    <Box
                        sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            width: '60%',
                            backgroundColor: 'primary.main',
                            textAlign: 'center',
                            mx: 'auto',
                            margin: '3rem',
                            padding: '1rem',
                            // opacity: [0.9, 0.8, 0.7],
                            // '&:hover': {
                            // backgroundColor: 'primary.main',
                            // opacity: [0.9, 0.8, 0.7],
                            // },
                        }}
                    >
                        <h4>
                            Welcome to
                        </h4>
                        <h3>
                            Shopping Stories
                        </h3>
                    </Box>
                    <Switch
                        checked={toggleOn}
                        onChange={() => {
                            setToggle(!toggleOn);
                            toggleColorMode();
                        }}
                    />
                </Grid>
            </div>
        </Fragment>
    );
};

export default Home;
