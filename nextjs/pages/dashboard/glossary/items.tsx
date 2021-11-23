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
import { Storage } from 'aws-amplify';
import { GlossaryItem } from 'client/types';
import {
    DeleteGlossaryItemDef,
    FetchGlossaryItemsDef,
} from 'client/graphqlDefs';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useMutation } from 'urql';
import * as yup from 'yup';

const validationSchema = yup.object({
    search: yup.string(),
});

// const _updateItemSchema = yup.object({
//     item: yup.string(),
//     variants: yup.string(),
// });

interface ItemToDelete {
    id: string;
    name: string;
}

const GlossaryItemsDashboardPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    // const [_createItemResult, createItem] = useMutation(createItemDef);
    // const [_updateItesmResult, updateItem] = useMutation(updateItemDef);
    const [_deleteItemResult, deleteItem] = useMutation(DeleteGlossaryItemDef);
    const [search, setSearch] = useState<string>('');
    const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);
    const [reQuery, setReQuery] = useState<Boolean>(true);
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
                const images = res.data.deletedItem.images.map(
                    (image: GlossaryItem['images'][0]) => image.imageKey,
                );
                setReQuery(true);

                for (const image of images) {
                    try {
                        await Storage.remove(`images/${image}`);
                    } catch (error: any) {
                        console.error(error.message);
                    }
                }

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
                        <Button
                            variant="contained"
                            onClick={() =>
                                router.push('/dashboard/glossary/create')
                            }
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
                    <Paper
                        sx={{
                            backgroundColor: `var(--secondary-bg)`,
                            margin: '3rem',
                            padding: '1rem',
                        }}
                    >
                        <ItemGlossaryPaginationTable
                            queryDef={FetchGlossaryItemsDef}
                            onEditClick={(id: string) => {
                                router.push(`/dashboard/glossary/update/${id}`);
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
