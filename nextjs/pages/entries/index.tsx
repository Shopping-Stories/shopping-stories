import EntryPaginationTable from '@components/EntryPaginationTable';
import Header from '@components/Header';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
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
import { entryFields } from 'client/graphqlDefs';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useMutation } from 'urql';
import * as yup from 'yup';

const searchEntryDef = `
query entriesQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findEntries(search: $search, options: $options) {
  	...entryFields
  }
  count: countEntries(search: $search)
}
${entryFields}
`;

const deleteEntryDef = `
mutation deleteEntry($id: String!) {
  deleteEntry(id: $id) {
    ...entryFields
  }
}
${entryFields}
`;

const searchSchema = yup.object({
    search: yup.string(),
});

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    console.log(isAdmin, isModerator);
    const [_deletePlaceResult, deletePlace] = useMutation(deleteEntryDef);
    const [search, setSearch] = useState<string>('');
    const [placeToDelete, setPlaceToDelete] = useState<{
        id: string;
    } | null>(null);
    const [reQuery, setReQuery] = useState<Boolean>(false);

    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleItemDelete = async () => {
        if (placeToDelete) {
            const id = placeToDelete.id;
            const res = await deletePlace({ id });
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
                <Container>
                    <Grid item xs={10}>
                        <Paper
                            sx={{
                                backgroundColor: `var(--secondary-bg)`,
                                margin: '3rem',
                                padding: '1rem',
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => {
                                    router.push(`/entries/create`);
                                }}
                            >
                                Create new entry
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
                            <EntryPaginationTable
                                queryDef={searchEntryDef}
                                onEditClick={(row: any) => {
                                    router.push(`/entries/update/${row.id}`);
                                }}
                                onDeleteClick={async (row: any) => {
                                    setPlaceToDelete({
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
                </Container>
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Confirm Delete of this entry</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this entry
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

export default ManagePlacesPage;
