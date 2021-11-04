import Header from '@components/Header';
import PlacePaginationTable from '@components/PlacePaginationTable';
import SideMenu from '@components/SideMenu';
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

const placeFields = `
fragment placeFields on Place {
  id
  location
  alias
  descriptor
}
`;

const createPlaceDef = `
mutation createPlace($place: CreatePlaceInput!) {
  createPlace(place: $place) {
    ...placeFields
  }
}
${placeFields}
`;

const searchPlaceDef = `
query placesQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findPlaces(search: $search, options: $options) {
  	...placeFields
  }
  count: countPlaces(search: $search)
}
${placeFields}
`;

const updatePlaceDef = `
mutation updatePlace($id: String!, $updates: UpdatePlaceInput!) {
  updatePlace(id: $id, updatedFields: $updates) {
    ...placeFields
  }
}
${placeFields}
`;

const deletePlaceDef = `
mutation deletePlace($id: String!) {
  deletePlace(id: $id) {
    ...placeFields
  }
}
${placeFields}
`;

const searchSchema = yup.object({
    search: yup.string(),
});

const createPlaceSchema = yup.object({
    location: yup.string().required('Location is required'),
    alias: yup.string().typeError('Alias must be a string').strict(true),
    descriptor: yup
        .string()
        .typeError('Descriptor must be a string')
        .strict(true),
});

const updatePlaceSchema = yup.object({
    item: yup.string(),
    category: yup.string(),
    subcategory: yup.string(),
});

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const [_createPlaceResult, createPlace] = useMutation(createPlaceDef);
    const [_updatePlaceResult, updatePlace] = useMutation(updatePlaceDef);
    const [_deletePlaceResult, deletePlace] = useMutation(deletePlaceDef);
    const [search, setSearch] = useState<string>('');
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [placeToDelete, setPlaceToDelete] = useState<{
        id: string;
        location: string;
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
            location: '',
            alias: '',
            descriptor: '',
        },
        validationSchema: createPlaceSchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createPlace({
                place: values,
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
            location: '',
            alias: '',
            descriptor: '',
        },
        validationSchema: updatePlaceSchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await updatePlace({
                id: values.id,
                updates: {
                    location: values.location,
                    alias: values.alias,
                    descriptor: values.descriptor,
                },
            });
            if (res.error) {
            } else {
                handleCloseUpdate();
                resetForm();
            }
        },
    });

    const handleItemDelete = async () => {
        if (placeToDelete) {
            const id = placeToDelete.id;
            const res = await deletePlace({ id });
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
                                Create new place
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
                            <PlacePaginationTable
                                queryDef={searchPlaceDef}
                                onEditClick={(row: any) => {
                                    updateForm.setValues(row);
                                    handleOpenUpdate();
                                }}
                                onDeleteClick={async (row: any) => {
                                    setPlaceToDelete({
                                        id: row.id,
                                        location: row.location,
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
                    <DialogTitle>Edit location</DialogTitle>
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
                                name="location"
                                label="Location"
                                value={updateForm.values.location}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.location &&
                                    Boolean(updateForm.errors.location)
                                }
                                helperText={
                                    updateForm.touched.location &&
                                    updateForm.errors.location
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="alias"
                                label="Alias"
                                value={updateForm.values.alias}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.alias &&
                                    Boolean(updateForm.errors.alias)
                                }
                                helperText={
                                    updateForm.touched.alias &&
                                    updateForm.errors.alias
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="descriptor"
                                label="Descriptor"
                                value={updateForm.values.descriptor}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.descriptor &&
                                    Boolean(updateForm.errors.descriptor)
                                }
                                helperText={
                                    updateForm.touched.descriptor &&
                                    updateForm.errors.descriptor
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
                    <DialogTitle>Add Category</DialogTitle>
                    <form onSubmit={createForm.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Create a new location
                            </DialogContentText>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                variant="standard"
                                name="location"
                                label="Location"
                                value={createForm.values.location}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.location &&
                                    Boolean(createForm.errors.location)
                                }
                                helperText={
                                    createForm.touched.location &&
                                    createForm.errors.location
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="alias"
                                label="Alias"
                                value={createForm.values.alias}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.alias &&
                                    Boolean(createForm.errors.alias)
                                }
                                helperText={
                                    createForm.touched.alias &&
                                    createForm.errors.alias
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="descriptor"
                                label="Descriptor"
                                value={createForm.values.descriptor}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.descriptor &&
                                    Boolean(createForm.errors.descriptor)
                                }
                                helperText={
                                    createForm.touched.descriptor &&
                                    createForm.errors.descriptor
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
                        {placeToDelete && placeToDelete.location}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete{' '}
                            {placeToDelete && placeToDelete.location}
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

export default ManagePlacesPage;
