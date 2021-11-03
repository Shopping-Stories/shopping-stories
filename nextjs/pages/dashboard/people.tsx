import Header from '@components/Header';
import PersonPaginationTable from '@components/PersonPaginationTable';
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

const personFields = `
fragment personFields on Person {
  id
  account
  enslaved
  firstName
  lastName
  gender
  location
  prefix
  suffix
  profession
  professionCategory
  professionQualifier
  reference
  store
  variations
}
`;

const createPersonDef = `
mutation createPerson($person: CreatePersonInput!) {
  createPerson(person: $person) {
    ...personFields
  }
}
${personFields}
`;

const searchPeopleDef = `
query peopleQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findPeople(search: $search, options: $options) {
  	...personFields
  }
  count: countPeople(search: $search)
}
${personFields}
`;

const updatePersonDef = `
mutation updatePerson($id: String!, $updates: UpdatePersonInput!) {
  updatePerson(id: $id, updatedFields: $updates) {
    ...personFields
  }
}
${personFields}
`;

const deletePersonDef = `
mutation deletePerson($id: String!) {
  deletePerson(id: $id) {
    ...personFields
  }
}
${personFields}
`;

const searchSchema = yup.object({
    search: yup.string(),
});

const createPersonSchema = yup.object({
    account: yup.string().required('Account is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    enslaved: yup.string().typeError('Enslaved must be a string').strict(true),
    location: yup.string().typeError('Location must be a string').strict(true),
    gender: yup.string().typeError('Gender must be a string').strict(true),
    prefix: yup.string().typeError('Prefix must be a string').strict(true),
    suffix: yup.string().typeError('Suffix must be a string').strict(true),
    profession: yup
        .string()
        .typeError('Profession must be a string')
        .strict(true),
    professionCategory: yup
        .string()
        .typeError('Profession Category must be a string')
        .strict(true),
    professionQualifier: yup
        .string()
        .typeError('Profession Qualifier must be a string')
        .strict(true),
    reference: yup
        .string()
        .typeError('Reference must be a string')
        .strict(true),
    store: yup.string().typeError('Store must be a string').strict(true),
    variations: yup
        .string()
        .typeError('Variations must be a string')
        .strict(true),
});

const updateCategorySchema = yup.object({
    account: yup.string(),
    enslaved: yup.string(),
    firstName: yup.string(),
    lastName: yup.string(),
    gender: yup.string(),
    location: yup.string(),
    prefix: yup.string(),
    suffix: yup.string(),
    profession: yup.string(),
    professionCategory: yup.string(),
    professionQualifier: yup.string(),
    reference: yup.string(),
    store: yup.string(),
    variations: yup.string(),
});

const ManageMarksPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const [_createPersonResult, createPerson] = useMutation(createPersonDef);
    const [_updatePersonResult, updatePerson] = useMutation(updatePersonDef);
    const [_deletePersonResult, deletePerson] = useMutation(deletePersonDef);
    const [search, setSearch] = useState<string>('');
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [personToDelete, setPersonToDelete] = useState<{
        id: string;
        firstName: string;
        lastName: string;
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
            firstName: '',
            lastName: '',
            account: '',
            enslaved: '',
            gender: '',
            location: '',
            prefix: '',
            suffix: '',
            profession: '',
            professionCategory: '',
            professionQualifier: '',
            reference: '',
            store: '',
            variations: '',
        },
        validationSchema: createPersonSchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createPerson({
                person: values,
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
            firstName: '',
            lastName: '',
            account: '',
            enslaved: '',
            gender: '',
            location: '',
            prefix: '',
            suffix: '',
            profession: '',
            professionCategory: '',
            professionQualifier: '',
            reference: '',
            store: '',
            variations: '',
        },
        validationSchema: updateCategorySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const { id, ...updates } = values;

            const res = await updatePerson({
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
        if (personToDelete) {
            const id = personToDelete.id;
            const res = await deletePerson({ id });
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
                                Create new person
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
                            <PersonPaginationTable
                                queryDef={searchPeopleDef}
                                onEditClick={(row: any) => {
                                    const { __typename, ...cleanedRow } = row;
                                    updateForm.setValues(cleanedRow);
                                    handleOpenUpdate();
                                }}
                                onDeleteClick={async (row: any) => {
                                    setPersonToDelete({
                                        id: row.id,
                                        firstName: row.firstName,
                                        lastName: row.lastName,
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
                    <DialogTitle>Edit Person</DialogTitle>
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
                                name="firstName"
                                label="First name"
                                value={updateForm.values.firstName}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.firstName &&
                                    Boolean(updateForm.errors.firstName)
                                }
                                helperText={
                                    updateForm.touched.firstName &&
                                    updateForm.errors.firstName
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="lastName"
                                label="Last name"
                                value={updateForm.values.lastName}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.lastName &&
                                    Boolean(updateForm.errors.lastName)
                                }
                                helperText={
                                    updateForm.touched.lastName &&
                                    updateForm.errors.lastName
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="account"
                                label="Account"
                                value={updateForm.values.account}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.account &&
                                    Boolean(updateForm.errors.account)
                                }
                                helperText={
                                    updateForm.touched.account &&
                                    updateForm.errors.account
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="enslaved"
                                label="Enslaved"
                                value={updateForm.values.enslaved}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.enslaved &&
                                    Boolean(updateForm.errors.enslaved)
                                }
                                helperText={
                                    updateForm.touched.enslaved &&
                                    updateForm.errors.enslaved
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="gender"
                                label="Gender"
                                value={updateForm.values.gender}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.gender &&
                                    Boolean(updateForm.errors.gender)
                                }
                                helperText={
                                    updateForm.touched.gender &&
                                    updateForm.errors.gender
                                }
                            />
                            <TextField
                                fullWidth
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
                                name="prefix"
                                label="Prefix"
                                value={updateForm.values.prefix}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.prefix &&
                                    Boolean(updateForm.errors.prefix)
                                }
                                helperText={
                                    updateForm.touched.prefix &&
                                    updateForm.errors.prefix
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="suffix"
                                label="Suffix"
                                value={updateForm.values.suffix}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.suffix &&
                                    Boolean(updateForm.errors.suffix)
                                }
                                helperText={
                                    updateForm.touched.suffix &&
                                    updateForm.errors.suffix
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="profession"
                                label="Profession"
                                value={updateForm.values.profession}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.profession &&
                                    Boolean(updateForm.errors.profession)
                                }
                                helperText={
                                    updateForm.touched.profession &&
                                    updateForm.errors.profession
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="professionCategory"
                                label="Profession Category"
                                value={updateForm.values.professionCategory}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.professionCategory &&
                                    Boolean(
                                        updateForm.errors.professionCategory,
                                    )
                                }
                                helperText={
                                    updateForm.touched.professionCategory &&
                                    updateForm.errors.professionCategory
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="professionQualifier"
                                label="Profession Qualifier"
                                value={updateForm.values.professionQualifier}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.professionQualifier &&
                                    Boolean(
                                        updateForm.errors.professionQualifier,
                                    )
                                }
                                helperText={
                                    updateForm.touched.professionQualifier &&
                                    updateForm.errors.professionQualifier
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="reference"
                                label="Reference"
                                value={updateForm.values.reference}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.reference &&
                                    Boolean(updateForm.errors.reference)
                                }
                                helperText={
                                    updateForm.touched.reference &&
                                    updateForm.errors.reference
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="store"
                                label="Store"
                                value={updateForm.values.store}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.store &&
                                    Boolean(updateForm.errors.store)
                                }
                                helperText={
                                    updateForm.touched.store &&
                                    updateForm.errors.store
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="variations"
                                label="Variations"
                                value={updateForm.values.variations}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.variations &&
                                    Boolean(updateForm.errors.variations)
                                }
                                helperText={
                                    updateForm.touched.variations &&
                                    updateForm.errors.variations
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
                    <DialogTitle>Create Person</DialogTitle>
                    <form onSubmit={createForm.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Create a new Person
                            </DialogContentText>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                variant="standard"
                                name="firstName"
                                label="First name"
                                value={createForm.values.firstName}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.firstName &&
                                    Boolean(createForm.errors.firstName)
                                }
                                helperText={
                                    createForm.touched.firstName &&
                                    createForm.errors.firstName
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="lastName"
                                label="Last name"
                                value={createForm.values.lastName}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.lastName &&
                                    Boolean(createForm.errors.lastName)
                                }
                                helperText={
                                    createForm.touched.lastName &&
                                    createForm.errors.lastName
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="account"
                                label="Account"
                                value={createForm.values.account}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.account &&
                                    Boolean(createForm.errors.account)
                                }
                                helperText={
                                    createForm.touched.account &&
                                    createForm.errors.account
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="enslaved"
                                label="Enslaved"
                                value={createForm.values.enslaved}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.enslaved &&
                                    Boolean(createForm.errors.enslaved)
                                }
                                helperText={
                                    createForm.touched.enslaved &&
                                    createForm.errors.enslaved
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="gender"
                                label="Gender"
                                value={createForm.values.gender}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.gender &&
                                    Boolean(createForm.errors.gender)
                                }
                                helperText={
                                    createForm.touched.gender &&
                                    createForm.errors.gender
                                }
                            />
                            <TextField
                                fullWidth
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
                                name="prefix"
                                label="Prefix"
                                value={createForm.values.prefix}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.prefix &&
                                    Boolean(createForm.errors.prefix)
                                }
                                helperText={
                                    createForm.touched.prefix &&
                                    createForm.errors.prefix
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="suffix"
                                label="Suffix"
                                value={createForm.values.suffix}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.suffix &&
                                    Boolean(createForm.errors.suffix)
                                }
                                helperText={
                                    createForm.touched.suffix &&
                                    createForm.errors.suffix
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="profession"
                                label="Profession"
                                value={createForm.values.profession}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.profession &&
                                    Boolean(createForm.errors.profession)
                                }
                                helperText={
                                    createForm.touched.profession &&
                                    createForm.errors.profession
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="professionCategory"
                                label="Profession Category"
                                value={createForm.values.professionCategory}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.professionCategory &&
                                    Boolean(
                                        createForm.errors.professionCategory,
                                    )
                                }
                                helperText={
                                    createForm.touched.professionCategory &&
                                    createForm.errors.professionCategory
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="professionQualifier"
                                label="Profession Qualifier"
                                value={createForm.values.professionQualifier}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.professionQualifier &&
                                    Boolean(
                                        createForm.errors.professionQualifier,
                                    )
                                }
                                helperText={
                                    createForm.touched.professionQualifier &&
                                    createForm.errors.professionQualifier
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="reference"
                                label="Reference"
                                value={createForm.values.reference}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.reference &&
                                    Boolean(createForm.errors.reference)
                                }
                                helperText={
                                    createForm.touched.reference &&
                                    createForm.errors.reference
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="store"
                                label="Store"
                                value={createForm.values.store}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.store &&
                                    Boolean(createForm.errors.store)
                                }
                                helperText={
                                    createForm.touched.store &&
                                    createForm.errors.store
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="variations"
                                label="Variations"
                                value={createForm.values.variations}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.variations &&
                                    Boolean(createForm.errors.variations)
                                }
                                helperText={
                                    createForm.touched.variations &&
                                    createForm.errors.variations
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
                        {personToDelete &&
                            personToDelete.firstName +
                                ' ' +
                                personToDelete.lastName}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete{' '}
                            {personToDelete &&
                                personToDelete.firstName +
                                    personToDelete.lastName}
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
