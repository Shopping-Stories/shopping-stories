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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Storage } from 'aws-amplify';
import {
    CreateDocumentSchema,
    searchSchema,
    UpdateDocumentSchema,
} from 'client/formikSchemas';
import {
    CreateDocumentDef,
    DeleteDocumentDef,
    FetchDocumentsDef,
    UpdateDocumentDef,
} from 'client/graphqlDefs';
import { CreateDocument, DocumentInfo, SearchType } from 'client/types';
import { handlePromise } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { isArray } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';
import Typography from '@mui/material/Typography';

interface BodyRowProps {
    row: DocumentInfo;
    onEditClick: (doc: DocumentInfo) => void;
    onDeleteClick: (doc: DocumentInfo) => void;
}

// special row that create a download link to the file
// under the filename column
const BodyRow = (props: BodyRowProps) => {
    const { row, onEditClick, onDeleteClick } = props;
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
            <TableCell>
                <Button
                    variant="contained"
                    onClick={() => onEditClick(row)}
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
            </TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    onClick={() => onDeleteClick(row)}
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>
                {<Button onClick={getFile}>{row.fileKey}</Button> || null}
            </TableCell>
        </TableRow>
    );
};

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    interface DocOperationResult {
        doc: DocumentInfo;
    }

    const [_createDocResult, createDoc] =
        useMutation<DocOperationResult>(CreateDocumentDef);
    const [_updateDocResult, updateDoc] =
        useMutation<DocOperationResult>(UpdateDocumentDef);
    const [_deleteDocResult, deleteDoc] =
        useMutation<DocOperationResult>(DeleteDocumentDef);

    const [search, setSearch] = useState<string>('');
    const [docToDelete, setDocToDelete] = useState<DocumentInfo | null>(null);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<DocumentInfo[]>([]);

    const [file, setFile] = useState<File | null>(null);
    const [prevFileKey, setPrevFileKey] = useState<string>('');

    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const handleOpenUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

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

    // updates the info in the database then uploads file to s3 bucket
    // and will remove previous file if the admin changed the file
    const updateForm = useFormik<DocumentInfo>({
        initialValues: {
            id: '',
            name: '',
            description: '',
            fileKey: '',
        },
        validationSchema: UpdateDocumentSchema,
        onSubmit: async (values, { resetForm }) => {
            const { id, ...updates } = values;

            setUpdating(true);

            const res = await updateDoc({
                id,
                updates,
            });

            if (file) {
                if (prevFileKey) {
                    await handlePromise(
                        Storage.remove(`documents/${prevFileKey}`),
                    );
                }
                const [_uploadRes, uploadErr] = await handlePromise(
                    Storage.put(`documents/${file.name}`, file),
                );
                if (uploadErr) {
                    updateForm.setFieldError('fileKey', uploadErr.message);
                }
            }

            if (res.error) {
                console.error(res.error);
            } else {
                handleCloseUpdate();
                resetForm();
            }
            setUpdating(false);
        },
    });

    // remove info from database then remove the document from the s3 bucket
    const handleItemDelete = async (
        e?: FormEvent<HTMLFormElement> | undefined,
    ) => {
        if (e) {
            e.preventDefault();
        }
        if (docToDelete) {
            setDeleting(true);
            const id = docToDelete.id;
            const res = await deleteDoc({ id });
            if (docToDelete.fileKey) {
                try {
                    await Storage.remove(`documents/${docToDelete.fileKey}`);
                } catch (error: any) {
                    console.error(error.message);
                }
            }
            if (res.error) {
                console.error(res.error);
            } else {
                handleCloseDelete();
            }
            setDeleting(false);
        }
    };

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

    // gets the file from s3 bucket on the edit dialog
    useEffect(() => {
        const getFile = async () => {
            if (updateForm.values.fileKey) {
                const key = updateForm.values.fileKey;
                if (key) {
                    try {
                        const S3FileUrl = await Storage.get(`documents/${key}`);
                        const fileReq = new Request(S3FileUrl);
                        const [res, _fileNotFound] = await handlePromise(
                            fetch(fileReq),
                        );
                        if (res && res.status === 200) {
                            setPrevFileKey(key);
                        }
                    } catch (error: any) {
                        console.error(error);
                    }
                }
            }
        };
        getFile();
    }, [updateForm.values.fileKey]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <form onSubmit={searchForm.handleSubmit}>
                        <Stack spacing={2}>
                            <div>
                                <Typography
                                    sx={{ textAlign: 'center' }}
                                    variant="h4"
                                >
                                    Documents
                                </Typography>
                            </div>

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
                    <div>
                        <Typography
                            sx={{ textAlign: 'center' }}
                            variant="body1"
                        >
                            <br />
                            NOTE: If you would like to reupload or delete a
                            document, you should first delete all of the
                            associated parsed entries for the document. This can
                            be done via the 'Import Spreadsheet' page. Failure
                            to do so may cause duplicate entries to appear if a
                            document is later uploaded with the same name.
                        </Typography>
                    </div>
                </Paper>
                <Paper sx={PaperStylesSecondary}>
                    <Stack spacing={2}>
                        <div>
                            <Button
                                startIcon={<AddCircle />}
                                variant="contained"
                                onClick={handleOpenCreate}
                            >
                                Create
                            </Button>
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
                                    isAdmin={true}
                                    isAdminOrModerator={true}
                                    labels={[
                                        'Title',
                                        'Description',
                                        'Filename',
                                    ]}
                                />
                            }
                            bodyRows={rows.map((row, i) => (
                                <BodyRow
                                    key={i}
                                    row={row}
                                    onEditClick={(doc: DocumentInfo) => {
                                        updateForm.setValues(doc);
                                        handleOpenUpdate();
                                    }}
                                    onDeleteClick={async (
                                        doc: DocumentInfo,
                                    ) => {
                                        setDocToDelete(doc);
                                        handleOpenDelete();
                                    }}
                                />
                            ))}
                        />
                    </Stack>
                </Paper>
            </DashboardPageSkeleton>

            {/* Edit Dialog */}
            <ActionDialog
                isOpen={openUpdate}
                onClose={handleCloseUpdate}
                isSubmitting={updating}
                onSubmit={updateForm.handleSubmit}
                title={`Edit Document`}
            >
                <DialogContentText>
                    Update any of the fields and submit.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="name"
                    label="Document Name"
                    fieldName="name"
                    formikForm={updateForm}
                />
                <TextAreaWithFormikValidation
                    name="description"
                    label="Description"
                    fieldName="description"
                    formikForm={updateForm}
                />
                <FileInput
                    label="File Upload"
                    // accept="image/*"
                    onChange={onFileChange(updateForm)}
                    initialFilename={updateForm.values.fileKey}
                    icon={true}
                >
                    <>Select File</>
                    <UploadFileIcon />
                </FileInput>
            </ActionDialog>

            {/* Create Dialog */}
            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create Document`}
            >
                <DialogContentText>Create a new document</DialogContentText>
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

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm Delete of ${docToDelete?.name || ''}`}
            >
                <DialogContentText>
                    Are you sure you want to delete{' '}
                    {docToDelete && docToDelete.name}
                </DialogContentText>
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManagePlacesPage;
