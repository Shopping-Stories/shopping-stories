import Header from '@components/Header';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { Fragment, useEffect, useState } from 'react';
import { PaperStyles } from 'styles/styles';
import useAuth from '@hooks/useAuth.hook';
import Auth from '@aws-amplify/auth';

// simple page to get access token that can be used with API
// useful for accessing authenticated endpoints with something
// like postman or graphql playground
export default function AccessTokenPage() {
    const { loading } = useAuth('/');
    const [token, setToken] = useState('');

    useEffect(() => {
        if (!loading) {
            Auth.currentSession().then((res) =>
                setToken(res.getAccessToken().getJwtToken()),
            );
        }
    }, [loading]);

    if (loading) {
        return (
            <Fragment>
                <Header />
                <LinearProgress />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Header />
            <Paper
                sx={{ backgroundColor: 'var(--secondary-bg)', ...PaperStyles }}
            >
                {token}
            </Paper>
        </Fragment>
    );
}
