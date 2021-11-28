import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const SnackBarCloseButton = (props: {
    handleClose: (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string | undefined,
    ) => void;
}) => {
    return (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={props.handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );
};

export default SnackBarCloseButton;
