import LinearProgress from '@mui/material/LinearProgress';
import ColorBackground from './ColorBackground';
import Header from './Header';

const LoadingPage = ({ title }:{title?:string}) => {
    return (
        <ColorBackground>
            {title !== "GraphView" && <Header title={title} />}
            <LinearProgress />
        </ColorBackground>
    );
};

export default LoadingPage;
