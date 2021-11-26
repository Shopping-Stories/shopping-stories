import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import FileInput from '@components/FileInput';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import ParseTable from '@components/ParseTable';
import useAuth from '@hooks/useAuth.hook';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';
import { styled } from '@mui/material/styles';
import xlsx from 'xlsx';

const parseSheetDef = `
	mutation ParseSheet ($spreadsheet: JSONObject!) {
		entries : importSpreadsheet(spreadsheetObj: $spreadsheet)
	}
`;

const createEntriesDef = `
	mutation CreateEntries($entries: [CreateEntryInput]!) {
  		createEntries(entries: $entries){
			id
		}
	}
`;

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const ImportPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const [_parseResponse, parseSheet] = useMutation(parseSheetDef);
    const [_createResponse, createEntries] = useMutation(createEntriesDef);
    const [file, setFile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreatingEntries, setIsCreatingEntries] = useState<boolean>(false);
    const [entries, setEntries] = useState<any>(null);
    const [_requestErrors, _setRequestErrors] = useState<any>(null);
    const [parseErrors, setParseErrors] = useState<any>(null);
    const [openError, setErrorOpen] = useState(false);
    const [error, setError] = useState('');

    const convertFileToJSON = async () => {
        if (file === null || !file) {
            return;
        }

        setIsLoading(true);
        let sheets: { [name: string]: any } = {};
        const selectedFile = file;
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = async (event: any) => {
            let binaryData = event.target.result;
            let workbook = xlsx.read(binaryData, { type: 'binary' });
            workbook.SheetNames.forEach((sheet: string) => {
                const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], {
                    defval: '',
                    raw: true,
                });
                sheets[sheet] = data;
            });

            const res: any = await parseSheet({ spreadsheet: sheets });
            if (res.error) {
                console.error(res.error);
                setError('An error occurred during the upload to the parser.');
                setErrorOpen(true);
            }
            setEntries([...res?.data?.entries]);
            updateParseErrors(res?.data?.entries);
            setIsLoading(false);
            console.log({ entries: res?.data?.entries });
        };
    };

    const updateParseErrors = (entries: any) => {
        if (entries) {
            const errors = entries
                .map((entry: any, i: number) => ({
                    index: i,
                    message: entry.errorMessage,
                }))
                .filter((entry: any) => entry.message);
            // setParseErrors([...errors]);
            if (errors.length > 0) {
                setError('Error(s) occurred parsing the sheet');
                setErrorOpen(true);
            }
        }
    };

    const handleUploadLoadToDatabase = () => {
        setIsCreatingEntries(true);
        const entriesWithoutError = entries.map((entry: any) => {
            delete entry.errorCode;
            delete entry.errorMessage;
            return entry;
        });
        createEntries({ entries: entriesWithoutError })
            .then(() => {
                setParseErrors(null);
                setIsCreatingEntries(false);
            })
            .catch((err: any) => {
                console.error(err);
                setErrorOpen(true);
                setError('The import into the database failed');
            });
    };

    const handleErrorClose = (
        _: React.SyntheticEvent | React.MouseEvent,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const closeSnackBarButton = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleErrorClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Container maxWidth="xs">
                    <Paper sx={PaperStylesSecondary}>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                                <FileInput
                                    label="import spreadsheet"
                                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={({ files }: any) =>
                                        setFile(files)
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <LoadingButton
                                    loading={isLoading}
                                    onClick={convertFileToJSON}
                                    variant="contained"
                                    sx={{
                                        margin: '1rem 5rem',
                                    }}
                                >
                                    Parse Sheet
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
                {entries ? (
                    <Paper sx={PaperStylesSecondary}>
                        <ParseTable entries={entries} />
                    </Paper>
                ) : null}
                <Container maxWidth="sm">
                    {!!parseErrors && parseErrors.length > 0 && (
                        <Stack spacing={2}>
                            {parseErrors.map((error: any, i: number) => (
                                <Item key={i}>
                                    <Typography>
                                        Entry {error.index + 1} had the error:{' '}
                                        {error.message}
                                    </Typography>
                                </Item>
                            ))}
                        </Stack>
                    )}
                </Container>
                <Container maxWidth="xs">
                    <Paper sx={PaperStylesSecondary}>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                                <LoadingButton
                                    variant="contained"
                                    onClick={handleUploadLoadToDatabase}
                                    loading={isCreatingEntries}
                                    disabled={
                                        (!!parseErrors &&
                                            parseErrors.length > 0) ||
                                        !entries
                                    }
                                >
                                    Confirm Import into Database
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </DashboardPageSkeleton>

            <Snackbar
                open={openError}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                action={closeSnackBarButton}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </ColorBackground>
    );
};

export default ImportPage;
