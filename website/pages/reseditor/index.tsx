import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DialogContentText from '@mui/material/DialogContentText';
import FormGroup from '@mui/material/FormGroup';
import Grid2 from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { GridRowsProp } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ParserOutput } from 'new_types/api_types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { FormEvent, useState, useEffect } from 'react';
import { PaperStyles } from 'styles/styles';

import ParserOutputEditor from '@components/ParserOutputEditor';
import Typography from '@mui/material/Typography';
import ParserEditorDialog, {rowType} from '@components/ParserEditorDialog';
import URLTable from '@components/URLTable';


const queryClient = new QueryClient();

const ResView: NextPage = () => {
    const { groups, loading } = useAuth();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const [editing, setEditing] = useState(false);
    // const [graph, setGraph] = useState(false)


    const [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = useState<boolean>(false);
    const message_prefix = "Errors are found in entries with ids: ";
    const [text, setText] = useState(message_prefix);

    const [rows, editRows] = useState<GridRowsProp>([] as GridRowsProp);

    const [selectedRow, setSelectedRow] = useState<rowType|null>(null);
    const [url, setUrl] = useState("");

    const handleClick = (event: React.MouseEvent, url: string) => {
        setUrl(url);
        setEditing(true);
    }


    const handleDialogClose = (edited_row: rowType) => {
        setOpen(false)
        setSelectedRow(null)
        let new_rows = rows.map((row) => row)
        new_rows[edited_row.id!] = edited_row
        editRows(new_rows)
    }

    const handleCloseNoSave = () => {
        setOpen(false)
        setSelectedRow(null)
    }

    const handleBack = () => {
        setOpen(false)
        setSelectedRow(null)
        setEditing(false)
        setUrl("")
    }

    if (loading) {
        return <LoadingPage />;
    }
    
    if (editing) {
        return (
            <QueryClientProvider client={queryClient}>
            <ColorBackground>
                <Header />
                <Box sx={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Paper sx={{...PaperStyles, marginBottom: "0px", marginTop: "2vh", width: "fit-content", padding: "1.5vh"}}>
                            <Typography variant='h5' align="center">{text}</Typography>
                            <Box sx={{width: "100%", paddingTop: "1vh"}}><Button variant='contained' sx={{"width": "100%"}} onClick={(event) => {handleBack()}}><Typography variant='h5'>Back</Typography></Button></Box>
                            <Box sx={{width: "100%", paddingTop: "1vh"}}><Button variant='contained' sx={{"width": "100%"}}><Typography variant='h5'>Save to Database</Typography></Button></Box>
                    </Paper>
                </Box>
                {
                    <Paper
                        sx={{
                            backgroundColor: 'var(--secondary-bg)',
                            ...PaperStyles,
                            marginTop: "2vh",
                        }}
                    >
                        <Stack spacing={2}>
                            <ParserOutputEditor
                                isAdmin={isAdmin}
                                isAdminOrModerator={isAdminOrModerator}
                                setIsLoading={setIsLoading}
                                url={url}
                                setErrorRows={(rows) => {setText(message_prefix + rows)}}
                                setSelectedRow={setSelectedRow}
                                rows={rows}
                                editRows={editRows}
                            />                        
                        </Stack>
                    </Paper>
                }
                <ParserEditorDialog row={selectedRow} setRow={handleDialogClose} setClose={handleCloseNoSave}></ParserEditorDialog>
    
            </ColorBackground>
            </QueryClientProvider>
        );
    }
    else {
        return (
            <QueryClientProvider client={queryClient}>
            <ColorBackground>
                <Header />
                {
                    <Paper
                        sx={{
                            backgroundColor: 'var(--secondary-bg)',
                            ...PaperStyles,
                            marginTop: "2vh",
                        }}
                    >
                        <URLTable handleClick={handleClick}></URLTable>
                    </Paper>
                }
    
            </ColorBackground>
            </QueryClientProvider>
        );
    }
};

export default ResView;
