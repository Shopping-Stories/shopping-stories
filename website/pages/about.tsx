import AboutNav from '@components/AboutNav';
import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import Paper from '@mui/material/Paper';
import { NextPage } from 'next';
import styles from 'styles/About.module.css';
import { Roles } from 'config/constants.config';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';

const AboutPage: NextPage = () => {
    const { groups } = useAuth();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;

    return (
        <ColorBackground>
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
            >
                <h5 className={styles.about}>About Page</h5>
                <AboutNav 
                isAdminOrModerator={isAdminOrModerator}
                />
            </Paper>
        </ColorBackground>
    );
};

export default AboutPage;
