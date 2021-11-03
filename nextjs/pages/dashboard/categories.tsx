// import DataGrid from '@components/DataGrid';
import CategoryPaginationTable from '@components/CategoryPaginationTable';
import Header from '@components/Header';
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

const categoryFields = `
fragment categoryFields on Category {
  id
  item
  category
  subcategory
}
`;

const createCategoryDef = `
mutation createCategory($category: CreateCategoryInput!) {
  createCategory(category: $category) {
    ...categoryFields
  }
}
${categoryFields}
`;

const searchCategoryDef = `
query CategoriesQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findCategories(search: $search, options: $options) {
  	...categoryFields
  }
  count: countCategories(search: $search)
}
${categoryFields}
`;

const updateCategoryDef = `
mutation updateCategory($id: String!, $updates: UpdateCategoryInput!) {
  updateCategory(id: $id, updatedFields: $updates) {
    ...categoryFields
  }
}
${categoryFields}
`;

const deleteCategoryDef = `
mutation deleteCategory($id: String!) {
  deleteCategory(id: $id) {
    ...categoryFields
  }
}
${categoryFields}
`;

const validationSchema = yup.object({
    search: yup.string(),
});

const createCategorySchema = yup.object({
    item: yup.string().required('Item name is required'),
    category: yup.string().required('Category is required'),
    subcategory: yup.string().required('Subcategory is required'),
});

const updateCategorySchema = yup.object({
    item: yup.string(),
    category: yup.string(),
    subcategory: yup.string(),
});

const ManageCategoryPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const [_createCategoryResult, createCategory] =
        useMutation(createCategoryDef);
    const [_updateCategoryResult, updateCategory] =
        useMutation(updateCategoryDef);
    const [_deleteCategoryResult, deleteCategory] =
        useMutation(deleteCategoryDef);
    const [search, setSearch] = useState<string>('');
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{
        id: string;
        item: string;
        category: string;
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
            category: '',
            subcategory: '',
        },
        validationSchema: createCategorySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createCategory({
                category: values,
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
            category: '',
            subcategory: '',
        },
        validationSchema: updateCategorySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await updateCategory({
                id: values.id,
                updates: {
                    item: values.item,
                    category: values.category,
                    subcategory: values.subcategory,
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
        if (categoryToDelete) {
            const id = categoryToDelete.id;
            const res = await deleteCategory({ id });
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
                                Create new category
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
                            <CategoryPaginationTable
                                queryDef={searchCategoryDef}
                                onEditClick={(row: any) => {
                                    updateForm.setFieldValue('id', row.id);
                                    updateForm.setFieldValue('item', row.item);
                                    updateForm.setFieldValue(
                                        'category',
                                        row.category,
                                    );
                                    updateForm.setFieldValue(
                                        'subcategory',
                                        row.subcategory,
                                    );
                                    handleOpenUpdate();
                                    console.log('edit', row);
                                }}
                                onDeleteClick={async (row: any) => {
                                    setCategoryToDelete({
                                        item: row.item,
                                        id: row.id,
                                        category: row.category,
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
                    <DialogTitle>Edit category</DialogTitle>
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
                                name="category"
                                label="category"
                                value={updateForm.values.category}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.category &&
                                    Boolean(updateForm.errors.category)
                                }
                                helperText={
                                    updateForm.touched.category &&
                                    updateForm.errors.category
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="subcategory"
                                label="subcategory"
                                value={updateForm.values.subcategory}
                                onChange={updateForm.handleChange}
                                error={
                                    updateForm.touched.subcategory &&
                                    Boolean(updateForm.errors.subcategory)
                                }
                                helperText={
                                    updateForm.touched.subcategory &&
                                    updateForm.errors.subcategory
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
                                Create a new Category
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
                                name="category"
                                label="Category"
                                value={createForm.values.category}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.category &&
                                    Boolean(createForm.errors.category)
                                }
                                helperText={
                                    createForm.touched.category &&
                                    createForm.errors.category
                                }
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="standard"
                                name="subcategory"
                                label="Subcategory"
                                value={createForm.values.subcategory}
                                onChange={createForm.handleChange}
                                error={
                                    createForm.touched.subcategory &&
                                    Boolean(createForm.errors.subcategory)
                                }
                                helperText={
                                    createForm.touched.subcategory &&
                                    createForm.errors.subcategory
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
                        {categoryToDelete && categoryToDelete.category}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete{' '}
                            {categoryToDelete && categoryToDelete.category}
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

export default ManageCategoryPage;
