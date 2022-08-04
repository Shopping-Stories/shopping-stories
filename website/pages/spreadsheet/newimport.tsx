import FormHelperText from '@mui/material/FormHelperText';
import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import FileInput from '@components/FileInput';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import PaginationTable from '@components/PaginationTable';
import PaginationTableHead from '@components/PaginationTableHead';
import TextAreaWithFormikValidation from '@components/TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Storage } from 'aws-amplify';
import { CreateDocumentSchema, searchSchema } from 'client/formikSchemas';
import { CreateDocumentDef, FetchDocumentsDef } from 'client/graphqlDefs';
import { CreateDocument, DocumentInfo, SearchType } from 'client/types';
import { handlePromise } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { isArray } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';
import Typography from '@mui/material/Typography';

interface BodyRowProps {
    row: DocumentInfo;
}
// special row that create a download link to the file
// under the filename column
const BodyRow = (props: BodyRowProps) => {
    const { row } = props;
    const router = useRouter();

    const getFile = async () => {
        const [fileUrl, getErr] = await handlePromise(
            Storage.get(`documents/${row.fileKey}`),
        );
        if (fileUrl) {
            const fileReq = new Request(fileUrl);
            const [res, _fileNotFound] = await handlePromise(fetch(fileReq));
            if (res && res.status === 200) {
                router.push(fileUrl);
            }
        }
        if (getErr) {
            console.error(getErr.message);
        }
    };

    return (
        <TableRow>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>
                {<Button onClick={getFile}>{row.fileKey}</Button> || null}
            </TableCell>
            <TableCell>
                <Button
                    sx={{ m: 2 }}
                    startIcon={<AddCircle />}
                    variant="contained"
                    onClick={() =>
                        router.push(
                            `/spreadsheet/entries?documentName=${row.name}`,
                        )
                    }
                >
                    Review Parsed Enries
                </Button>
            </TableCell>{' '}
        </TableRow>
    );
};

const NewImportPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    interface DocOperationResult {
        doc: DocumentInfo;
    }

    const [_createDocResult, createDoc] =
        useMutation<DocOperationResult>(CreateDocumentDef);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [rows, setRows] = useState<DocumentInfo[]>([]);
    const [search, setSearch] = useState<string>('');

    const [file, setFile] = useState<File | null>(null);

    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => {
        setOpenCreate(false);
        createForm.resetForm();
    };

    // creates the info in the database then uploads file to s3 bucket
    const createForm = useFormik<CreateDocument>({
        initialValues: {
            name: '',
            description: '',
            fileKey: '',
        },
        validationSchema: CreateDocumentSchema,
        onSubmit: async (values, { resetForm }) => {
            setCreating(true);
            const res = await createDoc({
                doc: values,
            });

            if (file) {
                const [_uploadRes, uploadErr] = await handlePromise(
                    Storage.put(`documents/${file.name}`, file),
                );
                if (uploadErr) {
                    createForm.setFieldError('fileKey', uploadErr.message);
                }
            }

            if (res.error) {
                console.error(res.error);
            } else {
                setReQuery(true);
                handleCloseCreate();
                resetForm();
            }
            setCreating(false);
        },
    });

    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            setSearch(values.search);
        },
    });

    // returns a function that works with the file input component
    const onFileChange = (formikForm: any) => {
        // updates the current file and related formik validation fields
        // when the file is changed in a dialog
        const onFileChangeWithFormik = (input: { files: File | File[] }) => {
            if (!isArray(input.files)) {
                const file = input.files;

                const newFile = new File([file], input.files.name, {
                    type: file.type,
                });

                setFile(newFile);
                formikForm.setFieldValue('fileKey', newFile.name);
            }
        };
        return onFileChangeWithFormik;
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <div>
                        <Typography sx={{ textAlign: 'center' }} variant="h4">
                            Spreadsheet Parser Dashboard
                        </Typography>
                        <Typography
                            sx={{ textAlign: 'center' }}
                            variant="body1"
                        >
                            This page will allow you view/edit parsed entries
                            from a selected spreadsheet. If necessary, click
                            &apos;Create Document&apos; to upload a new
                            spreadsheet file to be parsed. After the file is
                            created, or if it already exists, you can then
                            search for it using the search bar. Then, click the
                            button labeled &apos;Review Parsed Enries&apos; to
                            view/edit the entries before deciding to upload to
                            the database, allowing it to be viewed from the live
                            website.
                        </Typography>
                    </div>
                </Paper>
                <Paper sx={PaperStylesSecondary}>
                    <Stack spacing={2}>
                        <div>
                            <Typography
                                sx={{ textAlign: 'center' }}
                                variant="h5"
                            >
                                Select the document to be parsed.
                            </Typography>
                        </div>
                        <div>
                            <form onSubmit={searchForm.handleSubmit}>
                                <Stack spacing={2}>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="search"
                                        fieldName="search"
                                        label="Search"
                                        formikForm={searchForm}
                                    />

                                    <LoadingButton
                                        loading={isLoading}
                                        variant="contained"
                                        fullWidth
                                        type="submit"
                                    >
                                        Search
                                    </LoadingButton>
                                </Stack>
                            </form>
                        </div>
                        <div>
                            <Box textAlign="center">
                                <Button
                                    sx={{ m: 2 }}
                                    startIcon={<AddCircle />}
                                    variant="contained"
                                    onClick={handleOpenCreate}
                                >
                                    Create document
                                </Button>
                            </Box>
                        </div>
                        <PaginationTable
                            queryDef={FetchDocumentsDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={false}
                                    isAdminOrModerator={false}
                                    labels={[
                                        'Title',
                                        'Description',
                                        'Filename',
                                    ]}
                                />
                            }
                            bodyRows={rows.map((row, i) => (
                                <BodyRow key={i} row={row} />
                            ))}
                        />
                    </Stack>
                </Paper>
            </DashboardPageSkeleton>

            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create Document`}
            >
                <DialogContentText>
                    Submit a document file to be uploaded. Must be in format
                    .xlsx, xls, or .csv.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="name"
                    label="Document Name"
                    fieldName="name"
                    formikForm={createForm}
                />
                <TextAreaWithFormikValidation
                    name="description"
                    label="Description"
                    fieldName="description"
                    formikForm={createForm}
                />
                <div>
                    <FileInput
                        label="File Upload"
                        onChange={onFileChange(createForm)}
                        icon={true}
                    >
                        Select File
                        <UploadFileIcon />
                    </FileInput>
                    {!!createForm.errors.fileKey ? (
                        <FormHelperText error={!!createForm.errors.fileKey}>
                            {createForm.errors.fileKey}
                        </FormHelperText>
                    ) : null}
                </div>
            </ActionDialog>
        </ColorBackground>
    );
};

export default NewImportPage;
