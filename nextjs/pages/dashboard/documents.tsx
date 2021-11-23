import FileInput from '@components/FileInput';
import Header from '@components/Header';
import PaginationTable from '@components/PaginationTable';
import SideMenu from '@components/SideMenu';
import TextAreaWithFormikValidation from '@components/TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
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
import { handlePromise, processStorageList } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { isArray } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useMutation } from 'urql';

const HeaderRow = () => {
    return (
        <TableRow>
            <TableCell />
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Filename</TableCell>
        </TableRow>
    );
};

interface BodyRowProps {
    row: DocumentInfo;
    onEditClick: (doc: DocumentInfo) => void;
    onDeleteClick: (doc: DocumentInfo) => void;
}

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
                    endIcon={<EditIcon />}
                >
                    Edit
                </Button>
            </TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    onClick={() => onDeleteClick(row)}
                    endIcon={<DeleteIcon />}
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
    const [_createDocResult, createDoc] = useMutation(CreateDocumentDef);
    const [_updateDocResult, updateDoc] = useMutation(UpdateDocumentDef);
    const [_deleteDocResult, deleteDoc] = useMutation(DeleteDocumentDef);
    const [search, setSearch] = useState<string>('');
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [DocToDelete, setDocToDelete] = useState<DocumentInfo | null>(null);
    const [rows, setRows] = useState<DocumentInfo[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [reQuery, setReQuery] = useState<boolean>(false);
    const [prevFileKey, setPrevFileKey] = useState<string>('');
    // const [fileUrl, setFileUrl] = useState<string>('');

    const handleOpenUpdate = () => {
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const [openCreate, setOpenCreate] = useState<boolean>(false);

    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    const handleCloseCreate = () => {
        setOpenCreate(false);
    };

    const createForm = useFormik<CreateDocument>({
        initialValues: {
            name: '',
            description: '',
            fileKey: '',
        },
        validationSchema: CreateDocumentSchema,
        onSubmit: async (values, { resetForm }) => {
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
            } else {
                setReQuery(true);
                handleCloseCreate();
                resetForm();
            }
        },
    });

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
            } else {
                handleCloseUpdate();
                resetForm();
            }
        },
    });

    const handleItemDelete = async () => {
        if (DocToDelete) {
            const id = DocToDelete.id;
            const res = await deleteDoc({ id });
            if (DocToDelete.fileKey) {
                try {
                    await Storage.remove(`documents/${DocToDelete.fileKey}`);
                } catch (error: any) {
                    console.error(error.message);
                }
            }
            if (res.error) {
            } else {
                handleCloseDelete();
            }
        }
    };

    const formik = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            setSearch(values.search);
        },
    });

    const onFileChange = (formikForm: any) => {
        const onFileChangeWithFormik = (input: { files: File | File[] }) => {
            if (!isArray(input.files)) {
                const file = input.files;

                const newFile = new File([file], input.files.name, {
                    type: file.type,
                });

                setFile(newFile);
                // setFileUrl('');
                formikForm.setFieldValue('fileKey', newFile.name);
            }
        };
        return onFileChangeWithFormik;
    };

    useEffect(() => {
        const getFile = async () => {
            if (updateForm.values.fileKey) {
                const [res, err] = await handlePromise(
                    Storage.list('documents/'),
                );

                if (!err && res) {
                    const { files } = processStorageList(res);
                    const fileKeys: string[] = files.map(
                        (file: any) => file.key.split('/')[1],
                    );

                    const key = updateForm.values.fileKey;
                    const fileKey = fileKeys.find(
                        (fileKey: string) => fileKey === key,
                    );
                    if (fileKey) {
                        try {
                            const S3FileUrl = await Storage.get(
                                `documents/${fileKey}`,
                            );
                            const fileReq = new Request(S3FileUrl);
                            const [res, _fileNotFound] = await handlePromise(
                                fetch(fileReq),
                            );
                            if (res && res.status === 200) {
                                // setFileUrl(S3FileUrl);
                                setPrevFileKey(fileKey);
                            }
                        } catch (error: any) {
                            console.error(error);
                        }
                    }
                }
            }
        };
        getFile();
    }, [updateForm.values.fileKey]);

    if (loading) {
        return (
            <>
                <Header />
                <LinearProgress />
            </>
        );
    }

    return (
        <div className={backgrounds.colorBackground}>
            <Header />
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <SideMenu groups={groups} />
                </Grid>
                <Grid item xs={8}>
                    <Paper
                        sx={{
                            backgroundColor: `var(--secondary-bg)`,
                            margin: '3rem',
                            padding: '1rem',
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleOpenCreate}
                            endIcon={<AddCircleIcon />}
                        >
                            Create
                        </Button>
                        <FormGroup>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    name="search"
                                    label="Search"
                                    value={formik.values.search}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.search &&
                                        Boolean(formik.errors.search)
                                    }
                                    helperText={
                                        formik.touched.search &&
                                        formik.errors.search
                                    }
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                >
                                    Search
                                </Button>
                            </form>
                        </FormGroup>
                    </Paper>

                    <Paper
                        sx={{
                            backgroundColor: `var(--secondary-bg)`,
                            margin: '3rem',
                            padding: '1rem',
                        }}
                    >
                        <PaginationTable
                            queryDef={FetchDocumentsDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            headerRow={<HeaderRow />}
                            bodyRows={
                                rows.map((row, i: number) => (
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
                                )) || []
                            }
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                <DialogTitle>Edit location</DialogTitle>
                <form onSubmit={updateForm.handleSubmit}>
                    <DialogContent>
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
                        {/* {fileUrl ? (
                            <MuiNextLink href={fileUrl}>Download</MuiNextLink>
                        ) : null} */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUpdate}>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openCreate} onClose={handleCloseCreate}>
                <DialogTitle>Create Document</DialogTitle>
                <form onSubmit={createForm.handleSubmit}>
                    <DialogContent>
                        <DialogContentText>
                            Create a new document
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
                        <FileInput
                            label="File Upload"
                            // accept="image/*"
                            onChange={onFileChange(createForm)}
                            icon={true}
                        >
                            <>Select File</>
                            <UploadFileIcon />
                        </FileInput>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCreate}>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>
                    Confirm Delete of {DocToDelete && DocToDelete.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete{' '}
                        {DocToDelete && DocToDelete.name}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleItemDelete}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManagePlacesPage;
