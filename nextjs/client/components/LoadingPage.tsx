import LinearProgress from '@mui/material/LinearProgress';
import ColorBackground from './ColorBackground';
import Header from './Header';

const LoadingPage = () => {
    return (
        <ColorBackground>
            <Header />
            <LinearProgress />
        </ColorBackground>
    );
};

export default LoadingPage;
