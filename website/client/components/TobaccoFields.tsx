import { Box, Button, Paper, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import { TobaccoEntry } from 'new_types/api_types';
import { useEffect, useMemo } from 'react';

interface ParserEditorDialog {
    tobacco_weight?: string
    gross_weight?: string
    tare_weight?: string
    note_id?: string
    onEdit: (entry: TobaccoEntry|null) => void
}


const TobaccoFields = (props: ParserEditorDialog) => {
    const {
        tobacco_weight,
        gross_weight,
        tare_weight,
        note_id,
        onEdit
    } = props

    const entry: TobaccoEntry = useMemo(() => {return {number: note_id, gross_weight: gross_weight, tare_weight: tare_weight, weight: tobacco_weight};}, [tobacco_weight, gross_weight, tare_weight, note_id])

    // console.log(tobacco_weight);

    const style = {margin: "0.5vh"}

    return (
        <Paper>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <TextField
                margin="dense"
                label="Note ID"
                type="text"
                variant="filled"
                defaultValue={entry.number}
                sx={style}
                onChange={(event) => {entry.number = event.target.value}}
                />
                <TextField
                margin="dense"
                label="Gross weight"
                type="text"
                variant="filled"
                defaultValue={entry.gross_weight}
                sx={style}
                onChange={(event) => {entry.gross_weight = event.target.value}}
                />
                <TextField
                margin="dense"
                label="Tare weight"
                type="text"
                variant="filled"
                defaultValue={entry.tare_weight}
                sx={style}
                onChange={(event) => {entry.tare_weight = event.target.value}}
                />
                <TextField
                margin="dense"
                label="Tobacco weight"
                type="text"
                variant="filled"
                defaultValue={entry.weight}
                sx={style}
                onChange={(event) => {entry.weight = event.target.value}}
                />
                <Stack direction="row" sx={{marginLeft: "1vw"}}>
                    <Button variant='contained' sx={style} onClick={() => {onEdit(null)}}>Delete</Button>
                    <Button variant='contained' sx={style} onClick={() => {onEdit(entry)}}>Save</Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default TobaccoFields;