// import DataGrid from '@components/DataGrid';
import Header from '@components/Header';
import ItemsPaginationTable from '@components/ItemsPaginationTable';
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
// import LoadingButton from '@mui/lab/LoadingButton';
// import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useMutation } from 'urql';
import * as yup from 'yup';

const itemFields = `
fragment itemsFields on  Item {
  id
  item
  variants
}
`;

const createItemDef = `
mutation createItem($item: CreateItemInput!) {
  createItem(item: $item) {
    ...itemsFields
  }
}
${itemFields}
`;

const searchItemsDef = `
query itemsQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findItems(search: $search, options: $options) {
  	...itemsFields
  }
  count: countItems(search: $search)
}
${itemFields}
`;

const updateItemDef = `
mutation updateItem($id: String!, $updates: UpdateItemInput!) {
  updateItem(id: $id, updatedFields: $updates) {
    ...itemsFields
  }
}
${itemFields}
`;
const deleteItemDef = `
mutation deleteItem($id: String!) {
  deleteItem(id: $id) {
    ...itemsFields
  }
}
${itemFields}
`;

const validationSchema = yup.object({
    search: yup.string(),
});

const createItemSchema = yup.object({
    item: yup.string().required('Item name is required'),
    variants: yup.string(),
});

const updateItemSchema = yup.object({
    item: yup.string(),
    variants: yup.string(),
});

const ManageItemsPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const [_createItemResult, createItem] = useMutation(createItemDef);
    const [_updateItesmResult, updateItem] = useMutation(updateItemDef);
    const [_deleteItemResult, deleteItem] = useMutation(deleteItemDef);
    const [search, setSearch] = useState<string>('');
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<{
        id: string;
        item: string;
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
            item: '',
            variants: '',
        },
        validationSchema: createItemSchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createItem({
                item: values,
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
            item: '',
            variants: '',
        },
        validationSchema: updateItemSchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await updateItem({
                id: values.id,
                updates: {
                    item: values.item,
                    variants: values.variants,
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
        if (itemToDelete) {
            const id = itemToDelete.id;
            const res = await deleteItem({ id });
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
        validationSchema: validationSchema,
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
                                Create new item
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
                            <ItemsPaginationTable
                                queryDef={searchItemsDef}
                                onEditClick={(row: any) => {
                                    updateForm.setFieldValue('id', row.id);
                                    updateForm.setFieldValue('item', row.item);
                                    updateForm.setFieldValue(
                                        'variants',
                                        row.variants,
                                    );
                                    handleOpenUpdate();
                                    console.log('edit', row);
                                }}
                                onDeleteClick={async (row: any) => {
                                    setItemToDelete({
                                        item: row.item,
                                        id: row.id,
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
                    <DialogTitle>Edit Item</DialogTitle>
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
                                name="item"
                                label="Item"
                                value={updateForm.values.item}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.item &&
                                    Boolean(updateForm.errors.item)
                                }
                                helperText={
                                    updateForm.touched.item &&
                                    updateForm.errors.item
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="variants"
                                label="variants"
                                value={updateForm.values.variants}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.variants &&
                                    Boolean(updateForm.errors.variants)
                                }
                                helperText={
                                    updateForm.touched.variants &&
                                    updateForm.errors.variants
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
                    <DialogTitle>Add Item</DialogTitle>
                    <form onSubmit={createForm.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Create a new Item
                            </DialogContentText>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                variant="standard"
                                name="item"
                                label="Item"
                                value={createForm.values.item}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.item &&
                                    Boolean(createForm.errors.item)
                                }
                                helperText={
                                    createForm.touched.item &&
                                    createForm.errors.item
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="variants"
                                label="variants"
                                value={createForm.values.variants}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.variants &&
                                    Boolean(createForm.errors.variants)
                                }
                                helperText={
                                    createForm.touched.variants &&
                                    createForm.errors.variants
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
                        Confirm Delete of {itemToDelete && itemToDelete.item}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete{' '}
                            {itemToDelete && itemToDelete.item}
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

export default ManageItemsPage;
