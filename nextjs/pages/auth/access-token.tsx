import Auth from '@aws-amplify/auth';
import Header from '@components/Header';
import ImageBackground from '@components/ImageBackground';
import LoadingPage from '@components/LoadingPage';
import useAuth from '@hooks/useAuth.hook';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { PaperStyles } from 'styles/styles';

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
        return <LoadingPage />;
    }

    return (
        <ImageBackground>
            <Header />
            <Paper
                sx={{
                    backgroundColor: 'var(--secondary-bg)',
                    ...PaperStyles,
                }}
            >
                <div>Access Token:</div>
                <div style={{ overflowWrap: 'anywhere' }}>{token}</div>
            </Paper>
        </ImageBackground>
    );
}
