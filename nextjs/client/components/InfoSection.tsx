import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface InfoProps {
    label: string;
    body: string;
}

const InfoSection = (props: InfoProps) => {
    return (
        <div>
            <Typography component="div">
                <Box sx={{ fontWeight: 'bold' }}>{props.label}</Box>
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2">
                {props.body}
            </Typography>
        </div>
    );
};

export default InfoSection;
