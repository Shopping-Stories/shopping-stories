import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import PaginationTable from '@components/PaginationTable';
import PaginationTableHead from '@components/PaginationTableHead';
import PaginationTableRow from '@components/PaginationTableRow';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    createPersonSchema,
    searchSchema,
    updateCategorySchema,
} from 'client/formikSchemas';
import {
    CreatePersonDef,
    DeletePersonDef,
    SearchPeopleDef,
    UpdatePersonDef,
} from 'client/graphqlDefs';
import { Person, SearchType } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';

const ManageMarksPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [_createPersonResult, createPerson] =
        useMutation<Person>(CreatePersonDef);
    const [_updatePersonResult, updatePerson] =
        useMutation<Person>(UpdatePersonDef);
    const [_deletePersonResult, deletePerson] =
        useMutation<Person>(DeletePersonDef);

    const [search, setSearch] = useState<string>('');
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<Person[]>([]);

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

    const createForm = useFormik<Omit<Person, 'id'>>({
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
            setCreating(true);
            const res = await createPerson({
                person: values,
            });
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

    const updateForm = useFormik<Person>({
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
            setUpdating(true);
            const { id, ...updates } = values;

            const res = await updatePerson({
                id,
                updates,
            });
            if (res.error) {
                console.error(res.error);
            } else {
                handleCloseUpdate();
                resetForm();
            }
            setUpdating(false);
        },
    });

    const handleItemDelete = async (
        e?: FormEvent<HTMLFormElement> | undefined,
    ) => {
        if (e) {
            e.preventDefault();
        }
        if (personToDelete) {
            setDeleting(true);
            const id = personToDelete.id;
            const res = await deletePerson({ id });
            if (res.error) {
                console.error(res.error);
            } else {
                setReQuery(true);
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
        onSubmit: (values) => {
            setReQuery(true);
            setSearch(values.search);
        },
    });

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
                                    People
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
                </Paper>
                <Paper sx={PaperStylesSecondary}>
                    <Stack spacing={2}>
                        {isAdmin ? (
                            <div>
                                <Button
                                    startIcon={<AddCircle />}
                                    variant="contained"
                                    onClick={handleOpenCreate}
                                >
                                    Create
                                </Button>
                            </div>
                        ) : null}
                        <PaginationTable
                            queryDef={SearchPeopleDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={isAdmin}
                                    isAdminOrModerator={isAdminOrModerator}
                                    labels={[
                                        'First name',
                                        'Last name',
                                        'Prefix',
                                        'Suffix',
                                        'Account',
                                        'Enslaved',
                                        'Gender',
                                        'Location',
                                        'Profession',
                                        'Profession Category',
                                        'Profession Qualifier',
                                        'Reference',
                                        'Store',
                                        'Variations',
                                    ]}
                                />
                            }
                            bodyRows={rows.map((row, i) => (
                                <PaginationTableRow
                                    key={i}
                                    row={row}
                                    isAdmin={isAdmin}
                                    cellValues={[
                                        row.firstName,
                                        row.lastName,
                                        row.prefix,
                                        row.suffix,
                                        row.account,
                                        row.enslaved,
                                        row.gender,
                                        row.location,
                                        row.profession,
                                        row.professionCategory,
                                        row.professionQualifier,
                                        row.reference,
                                        row.store,
                                        row.variations,
                                    ]}
                                    isAdminOrModerator={isAdminOrModerator}
                                    onEditClick={(row) => {
                                        updateForm.setValues(
                                            cloneWithoutTypename(row),
                                        );
                                        handleOpenUpdate();
                                    }}
                                    onDeleteClick={async (row) => {
                                        setPersonToDelete(row);
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
                title={`Edit Person`}
            >
                <DialogContentText>
                    Update any of the fields and submit.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="firstName"
                    label="First name"
                    fieldName="firstName"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="lastName"
                    label="Last name"
                    fieldName="lastName"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="account"
                    label="Account"
                    fieldName="account"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="enslaved"
                    label="Enslaved"
                    fieldName="enslaved"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="gender"
                    label="Gender"
                    fieldName="gender"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="location"
                    label="Location"
                    fieldName="location"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="prefix"
                    label="Prefix"
                    fieldName="prefix"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="suffix"
                    label="Suffix"
                    fieldName="suffix"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="profession"
                    label="Profession"
                    fieldName="profession"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="professionCategory"
                    label="Profession Category"
                    fieldName="professionCategory"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="professionQualifier"
                    label="Profession Qualifier"
                    fieldName="professionQualifier"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="reference"
                    label="Reference"
                    fieldName="reference"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="store"
                    label="Store"
                    fieldName="store"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="variations"
                    label="Variations"
                    fieldName="variations"
                    formikForm={updateForm}
                />
            </ActionDialog>

            {/* Create Dialog */}
            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create Person`}
            >
                <DialogContentText>Create a new Person</DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="firstName"
                    label="First name"
                    fieldName="firstName"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="lastName"
                    label="Last name"
                    fieldName="lastName"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="account"
                    label="Account"
                    fieldName="account"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="enslaved"
                    label="Enslaved"
                    fieldName="enslaved"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="gender"
                    label="Gender"
                    fieldName="gender"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="location"
                    label="Location"
                    fieldName="location"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="prefix"
                    label="Prefix"
                    fieldName="prefix"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="suffix"
                    label="Suffix"
                    fieldName="suffix"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="profession"
                    label="Profession"
                    fieldName="profession"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="professionCategory"
                    label="Profession Category"
                    fieldName="professionCategory"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="professionQualifier"
                    label="Profession Qualifier"
                    fieldName="professionQualifier"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="reference"
                    label="Reference"
                    fieldName="reference"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="store"
                    label="Store"
                    fieldName="store"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="variations"
                    label="Variations"
                    fieldName="variations"
                    formikForm={createForm}
                />
            </ActionDialog>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm delete of ${personToDelete?.firstName} ${personToDelete?.lastName}`}
            >
                Are you sure you want to delete{' '}
                {personToDelete &&
                    personToDelete.firstName + personToDelete.lastName}
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManageMarksPage;
