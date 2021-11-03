import Header from '@components/Header';
import SideMenu from '@components/SideMenu';
import TobaccoMarkPaginationTable from '@components/TobaccoMarkTable';
import useAuth from '@hooks/useAuth.hook';
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
import TextField from '@mui/material/TextField';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useMutation } from 'urql';
import * as yup from 'yup';

const tobaccoMarkFields = `
fragment markFields on TobaccoMark {
  id
  description
  image
  netWeight
  note
  notes
  tobaccoMarkId
  warehouse
  where
  whoRepresents
  whoUnder
}
`;

const createTobaccoMarkDef = `
mutation createTobaccoMark($mark: CreateTobaccoMarkInput!) {
  createTobaccoMark(tobaccoMark: $mark) {
    ...markFields
  }
}
${tobaccoMarkFields}
`;

const searchTobaccoMarksDef = `
query tobaccoMarksQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findTobaccoMarks(search: $search, options: $options) {
    ...markFields
  }
  count: countTobaccoMarks(search: $search)
}
${tobaccoMarkFields}
`;

const updateTobaccoMarkDef = `
mutation updateTobaccoMark($id: String!, $updates: UpdateTobaccoMarkInput!) {
  updateTobaccoMark(id: $id, updatedFields: $updates) {
    ...markFields
  }
}
${tobaccoMarkFields}
`;

const deleteTobaccoMarkDef = `
mutation deleteTobaccoMark($id: String!) {
  deleteTobaccoMark(id: $id) {
    ...markFields
  }
}
${tobaccoMarkFields}
`;

const searchSchema = yup.object({
    search: yup.string(),
});

const createTobaccoMarkSchema = yup.object({
    tobaccoMarkId: yup.string().required('Tobacco Mark ID is required'),
    warehouse: yup.string().required('Warehouse is required'),
    description: yup
        .string()
        .typeError('Description must be a string')
        .strict(true),
    image: yup.string().typeError('Item must be a string').strict(true),
    netWeight: yup
        .string()
        .typeError('Net Weight must be a string')
        .strict(true),
    note: yup.string().typeError('Note must be a string').strict(true),
    notes: yup.string().typeError('Notes must be a string').strict(true),
    where: yup.string().typeError('Where must be a string').strict(true),
    whoRepresents: yup
        .string()
        .typeError('Who it Represents must be a string')
        .strict(true),
    whoUnder: yup
        .string()
        .typeError("Who it's under must be a string")
        .strict(true),
});

const updateCategorySchema = yup.object({
    tobaccoMarkId: yup.string(),
    where: yup.string(),
    description: yup.string(),
    image: yup.string(),
    netWeight: yup.string(),
    note: yup.string(),
    notes: yup.string(),
    warehouse: yup.string(),
    whoRepresents: yup.string(),
    whoUnder: yup.string(),
});

const ManageMarksPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const [_createTobaccoMarkResult, createTobaccoMark] =
        useMutation(createTobaccoMarkDef);
    const [_updateTobaccoMarkResult, updateTobaccoMark] =
        useMutation(updateTobaccoMarkDef);
    const [_deleteTobaccoMarkResult, deleteTobaccoMark] =
        useMutation(deleteTobaccoMarkDef);
    const [search, setSearch] = useState<string>('');
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [tobaccoMarkToDelete, setTobaccoMarkToDelete] = useState<{
        id: string;
        tobaccoMarkId: string;
    } | null>(null);
    const [reQuery, setReQuery] = useState<Boolean>(false);

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

    const createForm = useFormik({
        initialValues: {
            tobaccoMarkId: '',
            where: '',
            description: '',
            image: '',
            netWeight: '',
            note: '',
            notes: '',
            warehouse: '',
            whoRepresents: '',
            whoUnder: '',
        },
        validationSchema: createTobaccoMarkSchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createTobaccoMark({
                mark: values,
            });
            if (res.error) {
            } else {
                setReQuery(true);
                handleCloseCreate();
                resetForm();
            }
        },
    });

    const updateForm = useFormik({
        initialValues: {
            id: '',
            tobaccoMarkId: '',
            where: '',
            description: '',
            image: '',
            netWeight: '',
            note: '',
            notes: '',
            warehouse: '',
            whoRepresents: '',
            whoUnder: '',
        },
        validationSchema: updateCategorySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const { id, ...updates } = values;

            const res = await updateTobaccoMark({
                id,
                updates,
            });
            if (res.error) {
            } else {
                handleCloseUpdate();
                resetForm();
            }
        },
    });

    const handleItemDelete = async () => {
        if (tobaccoMarkToDelete) {
            const id = tobaccoMarkToDelete.id;
            const res = await deleteTobaccoMark({ id });
            if (res.error) {
            } else {
                setReQuery(true);
                handleCloseDelete();
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            setSearch(values.search);
        },
    });

    if (loading) {
        return (
            <>
                <Header />
                <LinearProgress />
            </>
        );
    }

    return (
        <>
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
                            >
                                Create new Tobacco Mark
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
                                        // loading={isLoading}
                                        // onClick={handl}
                                        variant="contained"
                                        fullWidth
                                        type="submit"
                                    >
                                        Search
                                    </Button>
                                </form>
                            </FormGroup>
                        </Paper>
                        {/* <ParseTable entries={entries} /> */}
                        <Paper
                            sx={{
                                backgroundColor: `var(--secondary-bg)`,
                                margin: '3rem',
                                padding: '1rem',
                            }}
                        >
                            <TobaccoMarkPaginationTable
                                queryDef={searchTobaccoMarksDef}
                                onEditClick={(row: any) => {
                                    const { __typename, ...cleanedRow } = row;
                                    updateForm.setValues(cleanedRow);
                                    handleOpenUpdate();
                                }}
                                onDeleteClick={async (row: any) => {
                                    setTobaccoMarkToDelete({
                                        id: row.id,
                                        tobaccoMarkId: row.tobaccoMarkId,
                                    });
                                    handleOpenDelete();
                                }}
                                search={search}
                                reQuery={reQuery}
                                setReQuery={setReQuery}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                    <DialogTitle>Edit Tobacco Mark</DialogTitle>
                    <form onSubmit={updateForm.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Update any of the fields and submit.
                            </DialogContentText>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                variant="standard"
                                name="tobaccoMarkId"
                                label="Tobacco Mark ID"
                                value={updateForm.values.tobaccoMarkId}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.tobaccoMarkId &&
                                    Boolean(updateForm.errors.tobaccoMarkId)
                                }
                                helperText={
                                    updateForm.touched.tobaccoMarkId &&
                                    updateForm.errors.tobaccoMarkId
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="where"
                                label="Where"
                                value={updateForm.values.where}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.where &&
                                    Boolean(updateForm.errors.where)
                                }
                                helperText={
                                    updateForm.touched.where &&
                                    updateForm.errors.where
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="description"
                                label="Description"
                                value={updateForm.values.description}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.description &&
                                    Boolean(updateForm.errors.description)
                                }
                                helperText={
                                    updateForm.touched.description &&
                                    updateForm.errors.description
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="image"
                                label="Image"
                                value={updateForm.values.image}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.image &&
                                    Boolean(updateForm.errors.image)
                                }
                                helperText={
                                    updateForm.touched.image &&
                                    updateForm.errors.image
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="netWeight"
                                label="Net Weight"
                                value={updateForm.values.netWeight}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.netWeight &&
                                    Boolean(updateForm.errors.netWeight)
                                }
                                helperText={
                                    updateForm.touched.netWeight &&
                                    updateForm.errors.netWeight
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="note"
                                label="Note"
                                value={updateForm.values.note}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.note &&
                                    Boolean(updateForm.errors.note)
                                }
                                helperText={
                                    updateForm.touched.note &&
                                    updateForm.errors.note
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="notes"
                                label="Notes"
                                value={updateForm.values.notes}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.notes &&
                                    Boolean(updateForm.errors.notes)
                                }
                                helperText={
                                    updateForm.touched.notes &&
                                    updateForm.errors.notes
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="warehouse"
                                label="Warehouse"
                                value={updateForm.values.warehouse}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.warehouse &&
                                    Boolean(updateForm.errors.warehouse)
                                }
                                helperText={
                                    updateForm.touched.warehouse &&
                                    updateForm.errors.warehouse
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="whoRepresents"
                                label="Who it Represents"
                                value={updateForm.values.whoRepresents}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.whoRepresents &&
                                    Boolean(updateForm.errors.whoRepresents)
                                }
                                helperText={
                                    updateForm.touched.whoRepresents &&
                                    updateForm.errors.whoRepresents
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="whoUnder"
                                label="Who it's under"
                                value={updateForm.values.whoUnder}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.whoUnder &&
                                    Boolean(updateForm.errors.whoUnder)
                                }
                                helperText={
                                    updateForm.touched.whoUnder &&
                                    updateForm.errors.whoUnder
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUpdate}>Cancel</Button>
                            <Button type="submit">Submit</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openCreate} onClose={handleCloseCreate}>
                    <DialogTitle>Add Tobacco Mark</DialogTitle>
                    <form onSubmit={createForm.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Create a new Tobacco Mark
                            </DialogContentText>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                variant="standard"
                                name="tobaccoMarkId"
                                label="Tobacco Mark ID"
                                value={createForm.values.tobaccoMarkId}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.tobaccoMarkId &&
                                    Boolean(createForm.errors.tobaccoMarkId)
                                }
                                helperText={
                                    createForm.touched.tobaccoMarkId &&
                                    createForm.errors.tobaccoMarkId
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="where"
                                label="Where"
                                value={createForm.values.where}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.where &&
                                    Boolean(createForm.errors.where)
                                }
                                helperText={
                                    createForm.touched.where &&
                                    createForm.errors.where
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="description"
                                label="Description"
                                value={createForm.values.description}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.description &&
                                    Boolean(createForm.errors.description)
                                }
                                helperText={
                                    createForm.touched.description &&
                                    createForm.errors.description
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="image"
                                label="Image"
                                value={createForm.values.image}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.image &&
                                    Boolean(createForm.errors.image)
                                }
                                helperText={
                                    createForm.touched.image &&
                                    createForm.errors.image
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="netWeight"
                                label="Net Weight"
                                value={createForm.values.netWeight}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.netWeight &&
                                    Boolean(createForm.errors.netWeight)
                                }
                                helperText={
                                    createForm.touched.netWeight &&
                                    createForm.errors.netWeight
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="note"
                                label="Note"
                                value={createForm.values.note}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.note &&
                                    Boolean(createForm.errors.note)
                                }
                                helperText={
                                    createForm.touched.note &&
                                    createForm.errors.note
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="notes"
                                label="Notes"
                                value={createForm.values.notes}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.notes &&
                                    Boolean(createForm.errors.notes)
                                }
                                helperText={
                                    createForm.touched.notes &&
                                    createForm.errors.notes
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="warehouse"
                                label="Warehouse"
                                value={createForm.values.warehouse}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.warehouse &&
                                    Boolean(createForm.errors.warehouse)
                                }
                                helperText={
                                    createForm.touched.warehouse &&
                                    createForm.errors.warehouse
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="whoRepresents"
                                label="Who it Represents"
                                value={createForm.values.whoRepresents}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.whoRepresents &&
                                    Boolean(createForm.errors.whoRepresents)
                                }
                                helperText={
                                    createForm.touched.whoRepresents &&
                                    createForm.errors.whoRepresents
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="whoUnder"
                                label="Who it's under"
                                value={createForm.values.whoUnder}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.whoUnder &&
                                    Boolean(createForm.errors.whoUnder)
                                }
                                helperText={
                                    createForm.touched.whoUnder &&
                                    createForm.errors.whoUnder
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreate}>Cancel</Button>
                            <Button type="submit">Submit</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>
                        Confirm Delete of{' '}
                        {tobaccoMarkToDelete &&
                            tobaccoMarkToDelete.tobaccoMarkId}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete{' '}
                            {tobaccoMarkToDelete &&
                                tobaccoMarkToDelete.tobaccoMarkId}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                        <Button onClick={handleItemDelete}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default ManageMarksPage;
