import Header from '@components/Header';
import ItemGlossaryPaginationTable from '@components/ItemGlossaryPaginationTable';
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
import { useRouter } from 'next/router';
import { useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useMutation } from 'urql';
import * as yup from 'yup';

const glossaryItemFields = `
fragment glossaryItemFields on  GlossaryItem {
    id
    name
    description
    origin
    use
    category
    subcategory
    qualifiers
    culturalContext
    citations
    images {
      thumbnailImage
      name
      material
      width
      height
      date
      caption
      collectionCitation
      url
      license
    }
    examplePurchases {
      folio
      folioItem
      quantityPurchased
      accountHolder
      customer
      purchaseDate
      pounds
      shilling
      pence
    }
}
`;

const _createItemDef = `
mutation($item: CreateGlossaryItemInput!) {
  createGlossaryItem(newGlossaryItem: $item) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`;

const searchItemsDef = `
query glossaryItemsQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findGlossaryItems(search: $search, options: $options) {
    ...glossaryItemFields
  }
  count: countGlossaryItems(search: $search)
}
${glossaryItemFields}
`;

const _updateItemDef = `
mutation($id: String!, $input: UpdateGlossaryItemInput!) {
  updateGlossaryItem(id: $id, updatedFields: $updates) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`;
const deleteItemDef = `
mutation deleteItem($id: String!) {
  deleteGlossaryItem(id: $id) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`;

const validationSchema = yup.object({
    search: yup.string(),
});

const _createItemSchema = yup.object({
    item: yup.string().required('Item name is required'),
    variants: yup.string(),
});

const _updateItemSchema = yup.object({
    item: yup.string(),
    variants: yup.string(),
});

const GlossaryItemsDashboardPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    // const [_createItemResult, createItem] = useMutation(createItemDef);
    // const [_updateItesmResult, updateItem] = useMutation(updateItemDef);
    const [_deleteItemResult, deleteItem] = useMutation(deleteItemDef);
    const [search, setSearch] = useState<string>('');
    const [itemToDelete, setItemToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [reQuery, setReQuery] = useState<Boolean>(false);
    const router = useRouter();

    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

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
                        <Button variant="contained" onClick={() => router.push("/dashboard/glossary/create")}>
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
                    <Paper
                        sx={{
                            backgroundColor: `var(--secondary-bg)`,
                            margin: '3rem',
                            padding: '1rem',
                        }}
                    >
                        <ItemGlossaryPaginationTable
                            queryDef={searchItemsDef}
                            onEditClick={(id: string) => {
                                router.push(`/dashboard/glossary/update/${id}`)
                            }}
                            onDeleteClick={async (row: any) => {
                                setItemToDelete({
                                    name: row.name,
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
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>
                    Confirm Delete of {itemToDelete && itemToDelete.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete{' '}
                        {itemToDelete && itemToDelete.name}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleItemDelete}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default GlossaryItemsDashboardPage;
