import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import FileInput from '@components/FileInput';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import ParseEntryUpdateForm from '@components/ParseEntryUpdateForm';
import ParseTable from '@components/ParseTable';
import SnackBarCloseButton from '@components/SnackBarCloseButton';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Entry } from 'client/types';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';
import xlsx from 'xlsx';
import * as yup from 'yup';

const parseSheetDef = `
	mutation ParseSheet ($ledgerName: String!, $entries: JSONObject!) {
		entries : importSpreadsheet(spreadsheetObj: { ledgerName: $ledgerName, entries: $entries})
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
    const [i, setI] = useState(0);

    const [editEntry, setEditEntry] = useState<any>(null);

    const [openSuccess, setSuccessOpen] = useState(false);
    const [successMessage, setSuccess] = useState('');

    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const ledgerField = useFormik<{ ledgerName: string }>({
        initialValues: {
            ledgerName: '',
        },
        validationSchema: yup.object({
            ledgerName: yup.string().required('A ledger name is required'),
        }),
        onSubmit: async () => {
            convertFileToJSON();
        },
    });

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

            const res: any = await parseSheet({
                ledgerName: ledgerField.values.ledgerName,
                entries: sheets,
            });
            if (res.error) {
                console.error(res.error);
                setError('An error occurred during the upload to the parser.');
                setErrorOpen(true);
            } else {
                setEntries(res ? [...res?.data?.entries] : []);
            }
            updateParseErrors(res?.data?.entries);
            setSuccessOpen(false);
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
            if (errors.length > 0) {
                setParseErrors(errors);
                setError('Error(s) occurred parsing the sheet');
                setErrorOpen(true);
            }
        }
    };

    const handleUploadLoadToDatabase = async () => {
        setIsCreatingEntries(true);
        const entriesWithoutError = entries.map((entry: any) => {
            delete entry.errorCode;
            delete entry.errorMessage;
            return entry;
        });
        try {
            const res = await createEntries({ entries: entriesWithoutError });
            if (res.data) {
                setParseErrors(null);
                setIsCreatingEntries(false);
                setSuccess('The sheet was successfully imported');
                setSuccessOpen(true);
            } else if (res.error) {
                console.error(res.error);
                setErrorOpen(true);
                setError('The import into the database failed');
            }
        } catch (err: any) {
            console.error(err.message);
            setErrorOpen(true);
            setError('The import into the database failed');
        }
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

    const handleSuccessClose = (
        _: React.SyntheticEvent | React.MouseEvent,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Container maxWidth="xs">
                    <Paper sx={PaperStylesSecondary}>
                        <Grid container justifyContent="center" spacing={3}>
                            <Grid item>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="ledgerName"
                                    fieldName="ledgerName"
                                    label="Ledger name"
                                    formikForm={ledgerField}
                                />
                            </Grid>
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
                                <form onSubmit={ledgerField.handleSubmit}>
                                    <LoadingButton
                                        loading={isLoading}
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            margin: '1rem 5rem',
                                        }}
                                    >
                                        Parse Sheet
                                    </LoadingButton>
                                </form>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
                {entries ? (
                    <Paper sx={PaperStylesSecondary}>
                        <ParseTable
                            onParseEdit={(_entry: Entry, index: number) => {
                                setEditEntry(entries[index]);
                                setI(index);
                                setOpenEdit(true);
                            }}
                            entries={entries}
                        />
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
                action={SnackBarCloseButton({ handleClose: handleErrorClose })}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>

            <Snackbar
                open={openSuccess}
                autoHideDuration={6000}
                onClose={handleSuccessClose}
                action={SnackBarCloseButton({ handleClose: handleErrorClose })}
            >
                <Alert severity="success">{successMessage}</Alert>
            </Snackbar>

            <Dialog
                fullWidth
                maxWidth="lg"
                open={openEdit}
                onClose={handleCloseEdit}
            >
                <DialogTitle>Editing Entry</DialogTitle>
                <DialogContent>
                    <ParseEntryUpdateForm
                        initialValues={editEntry}
                        setEntry={(entry) => {
                            entries[i] = entry;
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ alignSelf: 'center' }}>
                    <Button variant="contained" onClick={handleCloseEdit}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </ColorBackground>
    );
};

export default ImportPage;
