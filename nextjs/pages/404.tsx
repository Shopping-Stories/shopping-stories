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
            <Paper
                sx={{ backgroundColor: 'var(--secondary-bg)', ...PaperStyles }}
            >
                <Container>
                    <Typography variant="h1">404</Typography>
                    <div>
                        <Typography variant="h2">
                            This page could not be found.
                        </Typography>
                    </div>
                </Container>
            </Paper>
        </ImageBackground>
    );
}
