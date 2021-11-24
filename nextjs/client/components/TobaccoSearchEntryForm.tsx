import * as React from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Button from '@mui/material/Button';

const useStyles = makeStyles({
    field: {
        margin: 20,
        display: 'block',
    },
});
export default function TobaccoSearchEntryForm() {
    const classes = useStyles();
    const [reel, setReel] = useState('');
    const [storeOwner, setStoreOwner] = useState('');
    const [folioYear, setFolioYear] = useState('');
    const [folioPage, setFolioPage] = useState('');
    const [entryID, setEntryID] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [people, setPeople] = useState('');
    const [places, setPlaces] = useState('');
    const [commodity, setCommodity] = useState('');
    const [colony, setColony] = useState('');
    const [entryDescription, setEntryDescription] = useState('');
    const [tobaccoMarkName, setTobaccoMarkName] = useState('');
    const [noteNumber, setNoteNumber] = useState('');
    const [moneyType, setMoneyType] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (
            reel ||
            storeOwner ||
            folioYear ||
            folioPage ||
            entryID ||
            accountHolder ||
            people ||
            places ||
            commodity ||
            colony ||
            entryDescription ||
            tobaccoMarkName ||
            noteNumber ||
            moneyType
        ) {
            console.log(
                reel,
                storeOwner,
                folioYear,
                folioPage,
                entryID,
                accountHolder,
                people,
                places,
                commodity,
                colony,
                entryDescription,
                tobaccoMarkName,
                noteNumber,
                moneyType,
            );
        }
    };
    return (
        <>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    onChange={(e) => setReel(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Reel"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setStoreOwner(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Store Owner"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setFolioYear(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Folio Year"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setFolioPage(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Folio Page"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setEntryID(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Entry ID"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Account Holder Name"
                    variant="outlined"
                />

                <TextField
                    onChange={(e) => setPeople(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="People"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setPlaces(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Places"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setCommodity(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Commodity"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setColony(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Colony"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setEntryDescription(e.target.value)}
                    className={classes.field}
                    id="outlined-multiline-static"
                    label="Entry Description"
                    multiline
                    rows={4}
                />
                <TextField
                    onChange={(e) => setTobaccoMarkName(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Tobacco Mark Name"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setNoteNumber(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Note Number"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setMoneyType(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Money Type"
                    variant="outlined"
                />
                <Button type="submit" variant="contained">
                    Search
                </Button>
            </form>
        </>
    );
}
