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
    createItemSchema,
    searchSchema,
    updateItemSchema,
} from 'client/formikSchemas';
import {
    CreateItemDef,
    DeleteItemDef,
    SearchItemsDef,
    UpdateItemDef,
} from 'client/graphqlDefs';
import { Item, SearchType } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';

const ManageItemsPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [_createItemResult, createItem] = useMutation<Item>(CreateItemDef);
    const [_updateItemResult, updateItem] = useMutation<Item>(UpdateItemDef);
    const [_deleteItemResult, deleteItem] = useMutation<Item>(DeleteItemDef);

    const [search, setSearch] = useState<string>('');
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rows, setRows] = useState<Item[]>([]);

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

    const createForm = useFormik<Omit<Item, 'id'>>({
        initialValues: {
            item: '',
            variants: '',
        },
        validationSchema: createItemSchema,
        onSubmit: async (values, { resetForm }) => {
            setCreating(true);
            const res = await createItem({
                item: values,
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

    const updateForm = useFormik<Item>({
        initialValues: {
            id: '',
            item: '',
            variants: '',
        },
        validationSchema: updateItemSchema,
        onSubmit: async (values, { resetForm }) => {
            setUpdating(true);
            const res = await updateItem({
                id: values.id,
                updates: {
                    item: values.item,
                    variants: values.variants,
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
        if (itemToDelete) {
            setDeleting(true);
            const id = itemToDelete.id;
            const res = await deleteItem({ id });
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
                                    Items
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
                            queryDef={SearchItemsDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={isAdmin}
                                    isAdminOrModerator={isAdminOrModerator}
                                    labels={['Item', 'Variants']}
                                />
                            }
                            bodyRows={rows.map((row, i: number) => (
                                <PaginationTableRow
                                    key={i}
                                    row={row}
                                    isAdmin={isAdmin}
                                    cellValues={[row.item, row.variants]}
                                    isAdminOrModerator={isAdminOrModerator}
                                    onEditClick={(row) => {
                                        updateForm.setValues(
                                            cloneWithoutTypename(row),
                                        );
                                        handleOpenUpdate();
                                    }}
                                    onDeleteClick={async (row) => {
                                        setItemToDelete(row);
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
                    label="Item"
                    fieldName="item"
                    formikForm={updateForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="variants"
                    label="Variants"
                    fieldName="variants"
                    formikForm={updateForm}
                />
            </ActionDialog>

            {/* Create Dialog */}
            <ActionDialog
                isOpen={openCreate}
                onClose={handleCloseCreate}
                isSubmitting={creating}
                onSubmit={createForm.handleSubmit}
                title={`Create Item`}
            >
                <DialogContentText>Create a new Item</DialogContentText>
                <TextFieldWithFormikValidation
                    fullWidth
                    autoFocus
                    name="item"
                    label="Item"
                    fieldName="item"
                    formikForm={createForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="variants"
                    label="Variants"
                    fieldName="variants"
                    formikForm={createForm}
                />
            </ActionDialog>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm Delete of ${itemToDelete?.item || ''}`}
            >
                Are you sure you want to delete{' '}
                {itemToDelete && itemToDelete.item}
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManageItemsPage;
