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
    createCategorySchema,
    searchSchema,
    updatePersonSchema,
} from 'client/formikSchemas';
import {
    CreateCategoryDef,
    DeleteCategoryDef,
    SearchCategoryDef,
    UpdateCategoryDef,
} from 'client/graphqlDefs';
import { Category, SearchType } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';

const ManageCategoryPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [_createCategoryResult, createCategory] =
        useMutation<Category>(CreateCategoryDef);
    const [_updateCategoryResult, updateCategory] =
        useMutation<Category>(UpdateCategoryDef);
    const [_deleteCategoryResult, deleteCategory] =
        useMutation<Category>(DeleteCategoryDef);

    const [search, setSearch] = useState<string>('');
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<Category[]>([]);

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

    const createForm = useFormik<Omit<Category, 'id'>>({
        initialValues: {
            item: '',
            category: '',
            subcategory: '',
        },
        validationSchema: createCategorySchema,
        onSubmit: async (values, { resetForm }) => {
            setCreating(true);
            const res = await createCategory({
                category: values,
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

    const updateForm = useFormik<Category>({
        initialValues: {
            id: '',
            item: '',
            category: '',
            subcategory: '',
        },
        validationSchema: updatePersonSchema,
        onSubmit: async (values, { resetForm }) => {
            setUpdating(true);
            const { id, ...changes } = values;
            const res = await updateCategory({
                id: id,
                updates: {
                    ...changes,
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
        if (categoryToDelete) {
            setDeleting(true);
            const id = categoryToDelete.id;
            const res = await deleteCategory({ id });
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
                                    Categories
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
                            queryDef={SearchCategoryDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={isAdmin}
                                    isAdminOrModerator={isAdminOrModerator}
                                    labels={['Item', 'Category', 'Subcategory']}
                                />
                            }
                            bodyRows={rows.map((row, i: number) => (
                                <PaginationTableRow
                                    key={i}
                                    row={row}
                                    isAdmin={isAdmin}
                                    cellValues={[
                                        row.item,
                                        row.category,
                                        row.subcategory,
                                    ]}
                                    isAdminOrModerator={isAdminOrModerator}
                                    onEditClick={(row) => {
                                        updateForm.setValues(
                                            cloneWithoutTypename(row),
                                        );
                                        handleOpenUpdate();
                                    }}
                                    onDeleteClick={async (row) => {
                                        setCategoryToDelete(row);
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
                title={`Edit category`}
            >
                <DialogContentText>
                    Update any of the fields and submit.
                </DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="item"
                    fieldName="item"
                    label="Item"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="category"
                    fieldName="category"
                    label="Category"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="subcategory"
                    fieldName="subcategory"
                    label="Subcategory"
                    formikForm={updateForm}
                />
            </ActionDialog>

            {/* Create Dialog */}
            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create a new category`}
            >
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="item"
                    fieldName="item"
                    label="Item"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="category"
                    fieldName="category"
                    label="Category"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="subcategory"
                    fieldName="subcategory"
                    label="Subcategory"
                    formikForm={createForm}
                />
            </ActionDialog>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm Delete of ${categoryToDelete?.item || ''}`}
            >
                Are you sure you want to delete{' '}
                {categoryToDelete && categoryToDelete.item}
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManageCategoryPage;
