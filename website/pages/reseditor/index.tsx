import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DialogContentText from '@mui/material/DialogContentText';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { searchSchema } from 'client/formikSchemas';
import { SearchType } from 'client/types';
import { ParserOutput } from 'new_types/api_types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';
import { PaperStyles } from 'styles/styles';

import ParserOutputEditor from '@components/ParserOutputEditor';
import Typography from '@mui/material/Typography';

const queryClient = new QueryClient();

const ResEditor: NextPage = () => {
    const { groups, loading } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const [search, setSearch] = useState('blah');
    const [submitted, setSubmitted] = useState(false);
    // const [graph, setGraph] = useState(false)

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState<ParserOutput[]>([]);
    const message_prefix = "Errors are found in entries with ids: ";
    const [text, setText] = useState(message_prefix);

    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            // setCurrentSearchEntry(values.search);
            setSubmitted(values.search);
        },
    });

    useEffect(() => {
        if (submitted) setSearch(searchForm.values.search);
    }, [submitted, searchForm.values.search]);


    // const exportRowsToSpreadSheet = () => {
    //     const XLSX = xlsx;
    //     const fileName = `export-${Date.now()}`;
    //     const flatRows = rows.map((row) => flatten(cloneWithoutTypename(row)));
    //     const workSheet = XLSX.utils.json_to_sheet(flatRows);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    //     XLSX.writeFile(wb, `${fileName}.xlsx`);
    // };


    if (loading) {
        return <LoadingPage />;
    }
    
    return (
        <QueryClientProvider client={queryClient}>
        <ColorBackground>
            <Header />
            <Box sx={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Paper sx={{...PaperStyles, marginBottom: "0px", marginTop: "2vh", width: "fit-content", padding: "1.5vh"}}>
                    <Typography variant='h5' align="center">{text}</Typography>
                </Paper>
            </Box>
            {(search) && (
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
                            setRows={setRows}
                            setIsLoading={setIsLoading}
                            url={"https://shoppingstories.s3.amazonaws.com/Parsed/C_1760_077_FINAL_.xlsx.json"}
                            setErrorRows={(rows) => {setText(message_prefix + rows)}}
                        />                        
                    </Stack>
                </Paper>
            )}
        </ColorBackground>
        </QueryClientProvider>
    );
};

export default ResEditor;
