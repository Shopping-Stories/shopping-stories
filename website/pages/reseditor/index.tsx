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
import { dateToString, moneyToString } from 'client/entryUtils';

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
    const [_editedRow, setEditedRow] = useState<number>(0);
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
            var new_rows: GridValidRowModel[] = [];
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
        }
        else {
            var new_rows = rows.map((row) => row)
            new_rows[edited_row!.id!] = edited_row!
        }
        if (edited_row != null) {
            setEditedRow(edited_row!.id!);
        }
        editRows(new_rows);
        setSelectedRow(null);
    }

    const handleDuplicate = (new_row: rowType) => {
        setOpen(false)

        if (new_row == null || new_row == undefined) {

        }
        else {
            let new_rows: GridValidRowModel[] = new Array()
            rows.forEach((value, index) => {
                if (index == new_row.id!) {
                    new_rows.push(value)
                    let new_new_row = {...new_row}
                    new_new_row.id! += 1
                    new_rows.push(new_new_row)
                }
                else if (index < new_row.id!) {
                    new_rows.push(value)
                }
                else {
                    value.id! += 1
                    new_rows.push(value)
                }
            })
            // console.log(new_rows)
            editRows(new_rows)
            setSelectedRow(null)
        }
    }

    const handleCloseNoSave = () => {
        setOpen(false)
        setSelectedRow(null)
    }

    // useEffect(() => {
    //     console.log(rows[editedRow])
    // }, [rows, editedRow])

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
        await new Promise( resolve => setTimeout(resolve, 500) );
        // console.log("toUp: ");
        // console.log(toUp);
        // console.log("Stringify");
        // console.log(JSON.stringify(toUp));
        // console.log(toUp.files[0]);
        // console.log(JSON.stringify(toUp.files[0]));
        const parse_url = "https://api.shoppingstories.org/upload_and_parse_multi/";
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
        
        const checkUrl = "https://api.shoppingstories.org/get_parser_progress";
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
        const delUrl = "https://api.shoppingstories.org/del_ready_files"
        let toDel: delFiles = {urls: [url]}
        
        const res = await fetch(delUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toDel)
        });
        // const text = await res.text();

        if (res.status == 200) {
            // let result: message = JSON.parse(text);
            // console.log(result);
        }

        handleBack()
    }

    const handleDBSave = async () => {
        const saveUrl = "https://api.shoppingstories.org/create_entries";

        let upMe: entriesToUp = {
            entries: rows.map((row) => {
                return row.original;
            })
        }

        // console.log(upMe)

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
            // console.log(mess.message);
            if (!mess.error) {
                handleDelete();
            }
        }
        else {
            console.log("ERROR: " + text);
        }

    }

    const handleRemoveChecks = () => {
        let newrows: GridValidRowModel[] = []
        if (rows != null && rows != undefined && (rows.length > 0)) {
            rows.forEach((value, _index) => {
                let newOriginal = {...value.original}
                newOriginal.errors = ((value.original!.errors ?? []).includes("Check Item") && (value.original!.errors ?? []).length == 1) ? undefined : value.original!.errors
                let thing: GridValidRowModel = {
                    Errors: ((value.original!.errors ?? []).includes("Check Item") && (value.original!.errors ?? []).length == 1) ? [] : value.original!.errors,
                    AccountName: value.original!.account_name,
                    "Dr/Cr": value.original!.debit_or_credit,
                    Amount: value.original!.amount,
                    Item: (value.original!.item ?? ""),
                    People: ((value.original!.people ?? []).join("; ")),
                    // AccountHolderID: value.original!.accountHolderID,
                    Date: dateToString(value.original!["Date Year"], value.original!["_Month"], value.original!.Day),
                    // Owner: value.original!.store_owner,
                    // Store: value.original!.meta?.store,
                    // Comments: value.original!.meta?.comments,
                    // Colony: value.original!.money?.colony,
                    Quantity: value.original!.Quantity,
                    Commodity: value.original!.Commodity,
                    Money: value.original!.currency_type == "Sterling" ? moneyToString(value.original!.pounds_ster, value.original!.shillings_ster, value.original!.pennies_ster, value.original!.farthings_ster) : moneyToString(value.original!.pounds, value.original!.shillings, value.original!.pennies, value.original!.farthings),
                    CurrencyType: value.original!.currency_type,
                    EntryID: value.original!.entry_id,
                    // Ledger: value.original!.ledger?.folio_year,
                    // Reel: value.original!.reel,
                    FolioPage: value.original!.folio_page,
                    original: newOriginal,
                    id: value.id
                }
                newrows.push(thing)
            })
        }

        editRows(newrows)
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
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <Paper sx={{ ...PaperStyles, marginBottom: "0px", marginTop: "2vh", width: "fit-content", padding: "1.25vh"}}>
                                <Typography variant='h4' sx={{marginBottom: "1.5vh"}} align="center">{url.split("/")[4].replace(".json", "")}</Typography>
                                <Typography variant='h5' align="center">{text}</Typography>
                                <Box sx={{ width: "100%", paddingTop: "0.5vh" }}>
                                    <Button variant='contained' sx={{ "width": "49.75%" }} onClick={() => { handleBack() }}><Typography variant='h5' color={"secondary.contrastText"}>Back</Typography></Button>
                                    <Button variant='contained' sx={{ "width": "49.75%", marginLeft: "0.5%" }} onClick={() => {handleDBSave()}}><Typography variant='h5' color={"secondary.contrastText"}>Save to Database</Typography></Button>
                                </Box>
                                <Box sx={{ width: "100%", paddingTop: "0.5vh" }}>
                                    <Button variant='contained' sx={{ "width": "49.75%" }} onClick={() => {handleRemoveChecks()}}><Typography variant='h5' color={"secondary.contrastText"}>Remove Check Item</Typography></Button>
                                    <Button variant='contained' sx={{ "width": "49.75%", marginLeft: "0.5%" }} onClick={() => {handleDelete()}}><Typography variant='h5' color={"secondary.contrastText"}>Delete</Typography></Button>
                                </Box>
                            </Paper>
                        </Box>
                        {
                            <Paper
                                sx={{
                                    backgroundColor: 'var(--secondary-bg)',
                                    ...PaperStyles,
                                    marginTop: "1vh",
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
                        <ParserEditorDialog row={selectedRow} setRow={handleDialogClose} setClose={handleCloseNoSave} onDuplicate={handleDuplicate}></ParserEditorDialog>

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
                                    <Button variant="contained" sx={{ width: "8vw"}} component="label">
                                        <Typography sx ={{fontSize: "1.5vh", color: "secondary.contrastText"}}>
                                            Upload File
                                        </Typography>
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
