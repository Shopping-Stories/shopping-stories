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
import {
    createPlaceSchema,
    searchSchema,
    updatePlaceSchema,
} from 'client/formikSchemas';
import {
    CreatePlaceDef,
    DeletePlaceDef,
    SearchPlacesDef,
    UpdatePlaceDef,
} from 'client/graphqlDefs';
import { Place, SearchType } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [_createPlaceResult, createPlace] =
        useMutation<Place>(CreatePlaceDef);
    const [_updatePlaceResult, updatePlace] =
        useMutation<Place>(UpdatePlaceDef);
    const [_deletePlaceResult, deletePlace] =
        useMutation<Place>(DeletePlaceDef);

    const [search, setSearch] = useState<string>('');
    const [placeToDelete, setPlaceToDelete] = useState<Place | null>(null);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<Place[]>([]);

    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const handleOpenUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const createForm = useFormik<Omit<Place, 'id'>>({
        initialValues: {
            location: '',
            alias: '',
            descriptor: '',
        },
        validationSchema: createPlaceSchema,
        onSubmit: async (values, { resetForm }) => {
            setCreating(true);
            const res = await createPlace({
                place: values,
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

    const updateForm = useFormik<Place>({
        initialValues: {
            id: '',
            location: '',
            alias: '',
            descriptor: '',
        },
        validationSchema: updatePlaceSchema,
        onSubmit: async (values, { resetForm }) => {
            setUpdating(true);
            const res = await updatePlace({
                id: values.id,
                updates: {
                    location: values.location,
                    alias: values.alias,
                    descriptor: values.descriptor,
                },
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
        if (placeToDelete) {
            setDeleting(true);
            const id = placeToDelete.id;
            const res = await deletePlace({ id });
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
                            queryDef={SearchPlacesDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={isAdmin}
                                    isAdminOrModerator={isAdminOrModerator}
                                    labels={['Location', 'Alias', 'Descriptor']}
                                />
                            }
                            bodyRows={rows.map((row, i) => (
                                <PaginationTableRow
                                    key={i}
                                    row={row}
                                    isAdmin={isAdmin}
                                    cellValues={[
                                        row.location,
                                        row.alias,
                                        row.descriptor,
                                    ]}
                                    isAdminOrModerator={isAdminOrModerator}
                                    onEditClick={(row) => {
                                        updateForm.setValues(
                                            cloneWithoutTypename(row),
                                        );
                                        handleOpenUpdate();
                                    }}
                                    onDeleteClick={async (row) => {
                                        setPlaceToDelete(row);
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
                title={`Edit Place`}
            >
                <DialogContentText>
                    Update any of the fields and submit.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="location"
                    label="Location"
                    fieldName="location"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="alias"
                    label="Alias"
                    fieldName="alias"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="descriptor"
                    label="Descriptor"
                    fieldName="descriptor"
                    formikForm={updateForm}
                />
            </ActionDialog>

            {/* Create Dialog */}
            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create Place`}
            >
                <DialogContentText>Create a new location</DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="location"
                    label="Location"
                    fieldName="location"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="alias"
                    label="Alias"
                    fieldName="alias"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="descriptor"
                    label="Descriptor"
                    fieldName="descriptor"
                    formikForm={createForm}
                />
            </ActionDialog>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm delete of ${placeToDelete?.location}`}
            >
                Are you sure you want to delete{' '}
                {placeToDelete && placeToDelete.location}
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManagePlacesPage;
