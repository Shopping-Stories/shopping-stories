import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';

import { ParserOutput } from 'new_types/api_types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { PaperStyles } from 'styles/styles';

import ParserOutputEditor from '@components/ParserOutputEditor';
import Typography from '@mui/material/Typography';
import ParserEditorDialog, { rowType } from '@components/ParserEditorDialog';
import URLTable from '@components/URLTable';

interface sfile {
    file: string
    name: string
}

interface fileUploads {
    files: Array<sfile>
}

interface parserProgress {
    progress: number
    filenames: Array<string>
}

interface fileError {
    name: string,
    reason: string
}

interface fileErrorList {
    files: Array<fileError>
}

interface delFiles {
    urls: Array<string>
}

interface message {
    message: string
    error: boolean
}

interface entriesToUp {
    entries: Array<ParserOutput>
}

const queryClient = new QueryClient();

const ResView: NextPage = () => {
    const { groups, loading } = useAuth();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const [editing, setEditing] = useState(false);
    // const [graph, setGraph] = useState(false)


    const [, setIsLoading] = useState(false);

    const [, setOpen] = useState<boolean>(false);
    const message_prefix = "Errors are found in entries with ids: ";
    const [text, setText] = useState(message_prefix);

    const [rows, editRows] = useState<GridRowsProp>([] as GridRowsProp);
    const [parsing, setParsing] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const [selectedRow, setSelectedRow] = useState<rowType | null>(null);
    const [url, setUrl] = useState("");

    const [errorText, setErrorText] = useState<string>("");
    const [unchangeable, setUnchangeable] = useState<boolean>(false);
    const [waiting, setWaiting] = useState<boolean>(false);

    const handleClick = (_event: React.MouseEvent, url: string) => {
        setUrl(url);
        setEditing(true);
    }


    const handleDialogClose = (edited_row: rowType|null) => {
        setOpen(false)

        if (edited_row == null) {
            let new_rows: GridValidRowModel[] = [];
            rows.map((row) => {
                if (row.id < selectedRow!.id!) {
                    new_rows.push(row);
                }
                else if (row.id == selectedRow!.id!) {

                }
                else {
                    row.id = row.id - 1;
                    new_rows.push(row);
                }
            })
            editRows(new_rows);
            setSelectedRow(null);
            return;
        }
        
        setSelectedRow(null)
        let new_rows = rows.map((row) => row)
        new_rows[edited_row!.id!] = edited_row!
        editRows(new_rows)
    }

    const handleCloseNoSave = () => {
        setOpen(false)
        setSelectedRow(null)
    }

    const getBase64 = (file: Blob, cb: (content: string | ArrayBuffer | null) => void) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const handleBack = () => {
        setOpen(false)
        setSelectedRow(null)
        setEditing(false)
        setUrl("")
    }

    const doUpload = async (toUp: fileUploads) => {
        console.log("toUp: ");
        console.log(toUp);
        console.log("Stringify");
        // console.log(JSON.stringify(toUp));
        console.log(toUp.files[0]);
        // console.log(JSON.stringify(toUp.files[0]));
        const parse_url = "http://preprod.shoppingstories.org:4562/upload_and_parse_multi/";
        const res = await fetch(parse_url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toUp)
        });

        const text = await res.text();
        const errors: fileErrorList = JSON.parse(text);

        if (errors.files.length == 0) {

        }
        else {
            setErrorText("ERROR occured when uploading: " + text);
        }
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files == null) {
            return;
        }

        const files: Array<sfile> = [];

        for (let ix = 0; ix < e.target.files.length; ix++) {
            const file = e.target.files[ix];
            getBase64(file, (content) => {
                if ((content != null) && (typeof content == typeof "asdas")) {
                    const f: sfile = { "file": (content as unknown as string).split(",")[1], "name": file.name }
                    files.push(f)
                    if (ix == e.target.files!.length! - 1) {
                        // console.log(files);
                        // console.log(files.length);
                        const toUpload: fileUploads = { files: files };
                
                        // console.log("To Upload: ");
                        // console.log(toUpload);
                        // console.log(toUpload.files);
                        // console.log(toUpload.files.length);
                        // console.log(toUpload);
                        // console.log((toUpload.files)[0]);
                
                        doUpload(toUpload);
                
                        setParsing(true);
                        setProgress(0);
                        CheckParsing(true);
                        setUnchangeable(true);
                    }
                }
            });
        }
    }

    async function CheckParsing(wait = false) {
        if (wait) {
            if (!waiting) {
                setWaiting(true);
                await new Promise(r => setTimeout(r, 180000));
                setWaiting(false);
            }
            else {
                return;
            }
        }
        
        const checkUrl = "http://preprod.shoppingstories.org:4562/get_parser_progress";
        const res = await fetch(checkUrl);
        const text = await res.text();

        let progress: parserProgress = JSON.parse(text);
        if (progress.progress < 1 || unchangeable) {
            setParsing(true);
            setProgress(progress.progress);
            if (!waiting) {
                setWaiting(true);
                await new Promise(r => setTimeout(r, 45000));
                setWaiting(false);
                CheckParsing();
            }
        }
        else {
            setParsing(false);
            setProgress(0);
        }
    }

    const handleDelete = async () => {
        const delUrl = "http://preprod.shoppingstories.org:4562/del_ready_files"
        let toDel: delFiles = {urls: [url]}
        
        const res = await fetch(delUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toDel)
        });
        const text = await res.text();

        if (res.status == 200) {
            let result: message = JSON.parse(text);
            console.log(result);
        }

        handleBack()
    }

    const handleDBSave = async () => {
        const saveUrl = "http://preprod.shoppingstories.org:4562/create_entries";

        let upMe: entriesToUp = {
            entries: rows.map((row) => {
                return row.original;
            })
        }

        const res = await fetch(saveUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(upMe)
        });

        const text = await res.text();
        if (res.status == 200) {
            let mess: message = JSON.parse(text);
            console.log(mess.message);
            if (!mess.error) {
                handleDelete();
            }
        }
        else {
            console.log("ERROR: " + text);
        }

    }

    CheckParsing();

    if (loading) {
        return <LoadingPage />;
    }

    if (errorText != "") {
        return (
            <ColorBackground>
                <Header/>
                <Box sx={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
                    <Paper sx={{...PaperStyles, width: "fit-content", marginTop: "2vh"}}>
                        <Typography variant="h3">{errorText}</Typography>
                    </Paper>
                </Box>
            </ColorBackground>
        );
    }
    else if (parsing || unchangeable) {
        return (
            <ColorBackground>
                <Header/>
                <Box sx={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
                    <Paper sx={{...PaperStyles, width: "fit-content", marginTop: "2vh"}}>
                        <Typography variant="h3">Parsing is about {progress * 100}% done.</Typography>
                    </Paper>
                </Box>
            </ColorBackground>
        );
    }
    else {
        if (editing) {
            return (
                <QueryClientProvider client={queryClient}>
                    <ColorBackground>
                        <Header />
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Paper sx={{ ...PaperStyles, marginBottom: "0px", marginTop: "2vh", width: "fit-content", padding: "1.5vh" }}>
                                <Typography variant='h5' align="center">{text}</Typography>
                                <Box sx={{ width: "100%", paddingTop: "1vh" }}><Button variant='contained' sx={{ "width": "100%" }} onClick={() => { handleBack() }}><Typography variant='h5'>Back</Typography></Button></Box>
                                <Box sx={{ width: "100%", paddingTop: "1vh" }}><Button variant='contained' sx={{ "width": "100%" }} onClick={() => {handleDBSave()}}><Typography variant='h5'>Save to Database</Typography></Button></Box>
                                <Box sx={{ width: "100%", paddingTop: "1vh" }}><Button variant='contained' sx={{ "width": "100%" }} onClick={() => {handleDelete()}}><Typography variant='h5'>Delete</Typography></Button></Box>
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
                                        setErrorRows={(rows) => { 
                                            if (rows == "") {
                                                setText("No errors found.")
                                            }
                                            else {
                                                setText(message_prefix + rows)
                                            } 
                                        }}
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
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Box>
                                <Paper sx={{ ...PaperStyles, width: "fit-content", margin: "0", marginTop: "2vh" }}>
                                    <Button variant="contained" sx={{ width: "8vw" }} component="label">
                                        Upload File
                                        <input hidden multiple type="file" onChange={handleUpload} />
                                    </Button>
                                </Paper>
                            </Box>
                        </Box>
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
    }
};

export default ResView;
