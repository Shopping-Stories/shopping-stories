import Header from '@components/Header';
import ImageBackground from '@components/ImageBackground';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PaperStyles } from 'styles/styles';

export default function ErrorPage() {
    return (
        <ImageBackground>
            <Header />
            <Container maxWidth="md">
                <Paper
                    sx={{
                        backgroundColor: 'var(--secondary-bg-translucent)',
                        textAlign: 'center',
                        ...PaperStyles,
                    }}
                >
                    <Typography variant="h2">404</Typography>
                    <Typography variant="h4">
                        This page could not be found.
                    </Typography>
                </Paper>
            </Container>
        </ImageBackground>
    );
}
