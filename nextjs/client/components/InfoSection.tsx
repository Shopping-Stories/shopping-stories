import Typography from "@mui/material/Typography";

interface InfoProps {
    label: string;
    body: string;
}

const InfoSection = (props: InfoProps) => {
    return (
        <div>
            <b>{props.label}</b>
            <Typography sx={{whiteSpace: 'pre-line'}} variant="body2">{props.body}</Typography>
        </div>
    );
};

export default InfoSection;