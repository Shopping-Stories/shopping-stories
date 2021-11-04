import Header from '@components/Header';
import AboutNav from '@components/AboutNav';
import { NextPage } from 'next';
import React from 'react';
import Typography from '@mui/material/Typography';

const AboutPage: NextPage = () => {
    return (
        <>
            <Header />
            <Typography variant="h2" component="h1">
                            About Page
            </Typography>
            <AboutNav />
        </>
    );
};

export default AboutPage;
