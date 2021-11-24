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
export default function ItemSearchEntryForm() {
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
    const [perOrder, setPerOrder] = useState('');
    const [itemName, setItemName] = useState('');
    const [cat, setCat] = useState('');
    const [subCat, setSubCat] = useState('');
    const [varient, setVarient] = useState('');

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
            perOrder ||
            itemName ||
            cat ||
            subCat ||
            varient
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
                perOrder,
                itemName,
                cat,
                subCat,
                varient,
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
                    required
                    onChange={(e) => setPerOrder(e.target.value)}
                    className={classes.field}
                    id="outlined-required"
                    label="Per Order (Yes or No)"
                    defaultValue="1 for Yes, 0 for no"
                />
                <TextField
                    onChange={(e) => setItemName(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Item Name"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setCat(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Category"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setSubCat(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Sub-Category"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setVarient(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Varient"
                    variant="outlined"
                />
                <Button type="submit" variant="contained">
                    Search
                </Button>
            </form>
        </>
    );
}
