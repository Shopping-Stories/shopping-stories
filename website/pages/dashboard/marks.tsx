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
    createTobaccoMarkSchema,
    searchSchema,
    updateTobaccoMarkSchema,
} from 'client/formikSchemas';
import {
    CreateTobaccoMarkDef,
    DeleteTobaccoMarkDef,
    SearchTobaccoMarksDef,
    UpdateTobaccoMarkDef,
} from 'client/graphqlDefs';
import { SearchType, TobaccoMark } from 'client/types';
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

    const [_createTobaccoMarkResult, createTobaccoMark] =
        useMutation<TobaccoMark>(CreateTobaccoMarkDef);
    const [_updateTobaccoMarkResult, updateTobaccoMark] =
        useMutation<TobaccoMark>(UpdateTobaccoMarkDef);
    const [_deleteTobaccoMarkResult, deleteTobaccoMark] =
        useMutation<TobaccoMark>(DeleteTobaccoMarkDef);

    const [search, setSearch] = useState<string>('');
    const [tobaccoMarkToDelete, setTobaccoMarkToDelete] =
        useState<TobaccoMark | null>(null);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<TobaccoMark[]>([]);

    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const handleOpenUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const createForm = useFormik<Omit<TobaccoMark, 'id'>>({
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
            setCreating(true);
            const res = await createTobaccoMark({
                mark: values,
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

    const updateForm = useFormik<TobaccoMark>({
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
        validationSchema: updateTobaccoMarkSchema,
        onSubmit: async (values, { resetForm }) => {
            setUpdating(true);
            const { id, ...updates } = values;

            const res = await updateTobaccoMark({
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
        if (tobaccoMarkToDelete) {
            setDeleting(true);
            const id = tobaccoMarkToDelete.id;
            const res = await deleteTobaccoMark({ id });
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
                            queryDef={SearchTobaccoMarksDef}
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
                                        'Tobacco Mark ID',
                                        'Description',
                                        'Where',
                                        'Warehouse',
                                        'Who it Represents',
                                        "Who it's Under",
                                        'Image',
                                        'Net Weight',
                                        'Note',
                                        'Notes',
                                    ]}
                                />
                            }
                            bodyRows={rows.map((row, i) => (
                                <PaginationTableRow
                                    key={i}
                                    row={row}
                                    isAdmin={isAdmin}
                                    cellValues={[
                                        row.tobaccoMarkId,
                                        row.description,
                                        row.where,
                                        row.warehouse,
                                        row.whoRepresents,
                                        row.whoUnder,
                                        row.image,
                                        row.netWeight,
                                        row.note,
                                        row.notes,
                                    ]}
                                    isAdminOrModerator={isAdminOrModerator}
                                    onEditClick={(row) => {
                                        updateForm.setValues(
                                            cloneWithoutTypename(row),
                                        );
                                        handleOpenUpdate();
                                    }}
                                    onDeleteClick={async (row) => {
                                        setTobaccoMarkToDelete(row);
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
                title={`Edit Tobacco Mark`}
            >
                <DialogContentText>
                    Update any of the fields and submit.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="tobaccoMarkId"
                    label="Tobacco Mark ID"
                    fieldName="tobaccoMarkId"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="where"
                    label="Where"
                    fieldName="where"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="description"
                    label="Description"
                    fieldName="description"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="image"
                    label="Image"
                    fieldName="image"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="netWeight"
                    label="Net Weight"
                    fieldName="netWeight"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="note"
                    label="Note"
                    fieldName="note"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="notes"
                    label="Notes"
                    fieldName="notes"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="warehouse"
                    label="Warehouse"
                    fieldName="warehouse"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="whoRepresents"
                    label="Who it Represents"
                    fieldName="whoRepresents"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="whoUnder"
                    label="Who it's under"
                    fieldName="whoUnder"
                    formikForm={updateForm}
                />
            </ActionDialog>

            {/* Create Dialog */}
            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create Tobacco Mark`}
            >
                <DialogContentText>Create a new Tobacco Mark</DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="tobaccoMarkId"
                    label="Tobacco Mark ID"
                    fieldName="tobaccoMarkId"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="where"
                    label="Where"
                    fieldName="where"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="description"
                    label="Description"
                    fieldName="description"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="image"
                    label="Image"
                    fieldName="image"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="netWeight"
                    label="Net Weight"
                    fieldName="netWeight"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="note"
                    label="Note"
                    fieldName="note"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="notes"
                    label="Notes"
                    fieldName="notes"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="warehouse"
                    label="Warehouse"
                    fieldName="warehouse"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="whoRepresents"
                    label="Who it Represents"
                    fieldName="whoRepresents"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="whoUnder"
                    label="Who it's under"
                    fieldName="whoUnder"
                    formikForm={createForm}
                />
            </ActionDialog>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm delete of ${tobaccoMarkToDelete?.tobaccoMarkId}`}
            >
                Are you sure you want to delete{' '}
                {tobaccoMarkToDelete && tobaccoMarkToDelete.tobaccoMarkId}
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManageMarksPage;
