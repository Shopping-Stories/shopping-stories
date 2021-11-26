import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import FileInput from '@components/FileInput';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import ParseTable from '@components/ParseTable';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';
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
            setEntries([...res?.data?.entries]);
            console.log({ entries: res?.data?.entries });
            updateParseErrors(res?.data?.entries);
            setIsLoading(false);
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
            setParseErrors([...errors]);
        }
    };

    const handleUploadLoadToDatabase = () => {
        setIsCreatingEntries(true);
        const entriesWithoutError = entries.map((entry: any) => {
            delete entry.errorCode;
            delete entry.errorMessage;
            return entry;
        });
        createEntries({ entries: entriesWithoutError }).then((res: any) => {
            setParseErrors(null);
            setIsCreatingEntries(false);
            console.log({ res });
        });
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <Stack spacing={2} direction="row">
                        <FileInput
                            label="import spreadsheet"
                            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={({ files }: any) => setFile(files)}
                        />
                        <LoadingButton
                            loading={isLoading}
                            onClick={convertFileToJSON}
                            variant="contained"
                            sx={{
                                margin: '1rem 5rem',
                            }}
                        >
                            Parse File
                        </LoadingButton>
                    </Stack>
                </Paper>
                <Paper sx={PaperStylesSecondary}>
                    <ParseTable entries={entries} />
                    {!!parseErrors && parseErrors.length > 0 && (
                        <Stack>
                            {parseErrors.map((error: any, i: number) => (
                                <Typography key={i}>
                                    Entry {error.index} had the error:{' '}
                                    {error.message}
                                </Typography>
                            ))}
                        </Stack>
                    )}
                    <LoadingButton
                        variant="contained"
                        onClick={handleUploadLoadToDatabase}
                        loading={isCreatingEntries}
                        disabled={
                            (!!parseErrors && parseErrors.length > 0) ||
                            !entries
                        }
                    >
                        Confirm Import into Database
                    </LoadingButton>
                </Paper>
            </DashboardPageSkeleton>
        </ColorBackground>
    );
};

export default ImportPage;
