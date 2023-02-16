import { useState } from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import { Entry, ParserOutput } from "new_types/api_types";


interface EntryDialogProps {
    dialogType?: string
    entry?: Entry
    setDialog: (dialog:string|undefined) => void
}

const EntryDialog = ({dialogType, entry, setDialog}: EntryDialogProps) => {
    console.log(dialogType, entry)
    const [open, setOpen] = useState<boolean>(!!dialogType)
    const handleClose = () => {
        setDialog(undefined);
    };
    
    return (
        <Dialog open={!!dialogType} onClose={handleClose}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Subscribe</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EntryDialog