import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isSubmitting?: boolean;
    onSubmit: any;
    title: string;
    children?: React.ReactNode;
}

const ActionDialog = (props: ActionDialogProps) => {
    const { isOpen, onClose, isSubmitting, onSubmit, title } = props;

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>{props.children}</DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={onClose}>Cancel</Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={Boolean(isSubmitting)}
                    >
                        Submit
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ActionDialog;
