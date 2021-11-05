import AboutNav from '@components/AboutNav';
import Header from '@components/Header';
import { Paper } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';
import backgrounds from 'styles/backgrounds.module.css';

const AboutPage: NextPage = () => {
    return (
        <>
            <div className={backgrounds.colorBackground}>
                <Header />
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        boxShadow: 5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        border: 1,
                        fontFamily: 'Merriweather',
                        letterSpacing: 6,
                        textAlign: 'center',
                        fontSize: 54,
                        mx: 'auto',
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >About Page
                <AboutNav />
                </Paper>
            </div>
        </>
    );
};

export default AboutPage;
