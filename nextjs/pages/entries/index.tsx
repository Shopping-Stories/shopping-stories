import AdvancedSearchTabForm from '@components/AdvancedSearchTabForm';
import ColorBackground from '@components/ColorBackground';
import EntryPaginationTable from '@components/EntryPaginationTable';
import Header from '@components/Header';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { advancedSearchSchema, searchSchema } from 'client/formikSchemas';
import { AdvancedSearchEntryDef, EntryFields, SearchEntryDef } from 'client/graphqlDefs';
import { AdvancedSearch, SearchType } from 'client/types';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from 'urql';

const deleteEntryDef = `
mutation deleteEntry($id: String!) {
  deleteEntry(id: $id) {
    ...entryFields
  }
}
${EntryFields}
`;

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const [_deletePlaceResult, deletePlace] = useMutation(deleteEntryDef);
    const [search, setSearch] = useState('');
    const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
    const [advanced, setAdvanced] = useState<AdvancedSearch | null>(null);
    const [placeToDelete, setPlaceToDelete] = useState<{
        id: string;
    } | null>(null);
    const [reQuery, setReQuery] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

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

    const formik = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            setSearch(values.search);
        },
    });

    const advancedSearchForm = useFormik<AdvancedSearch>({
        initialValues: {
            reel: '',
            storeOwner: '',
            folioYear: '',
            folioPage: '',
            entryID: '',
            accountHolderName: '',
            date: new Date(100, 0, 1).toISOString().substring(0, 10),
            date2: new Date().toISOString().substring(0, 10),
            people: '',
            places: '',
            commodity: '',
            colony: '',
            itemEntry: null,
            tobaccoEntry: null,
            regularEntry: null,
        },
        validationSchema: advancedSearchSchema,
        onSubmit: (values) => {
            console.log(values);
            setAdvanced(values);
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
        <ColorBackground>
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
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAdvancedSearch}
                                    onChange={() =>
                                        setIsAdvancedSearch((prev) => !prev)
                                    }
                                />
                            }
                            label="Advanced?"
                        />
                        <FormGroup>
                            {isAdvancedSearch ? (
                                <Box
                                    onSubmit={advancedSearchForm.handleSubmit}
                                    sx={{
                                        '& .MuiTextField-root': {
                                            m: 1,
                                        },
                                    }}
                                    component="form"
                                >
                                    <TextFieldWithFormikValidation
                                        name="reel"
                                        label="Reel"
                                        formikForm={advancedSearchForm}
                                        fieldName="reel"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="storeOwner"
                                        label="Store Owner"
                                        formikForm={advancedSearchForm}
                                        fieldName="storeOwner"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="folioYear"
                                        label="Folio Year"
                                        formikForm={advancedSearchForm}
                                        fieldName="folioYear"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="folioPage"
                                        label="Folio Page"
                                        formikForm={advancedSearchForm}
                                        fieldName="folioPage"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="entryID"
                                        label="Entry ID"
                                        formikForm={advancedSearchForm}
                                        fieldName="entryID"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="accountHolderName"
                                        label="Account Holder"
                                        formikForm={advancedSearchForm}
                                        fieldName="accountHolderName"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="people"
                                        label="Person"
                                        formikForm={advancedSearchForm}
                                        fieldName="people"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="places"
                                        label="Place"
                                        formikForm={advancedSearchForm}
                                        fieldName="places"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="commodity"
                                        label="Commodity"
                                        formikForm={advancedSearchForm}
                                        fieldName="commodity"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="colony"
                                        label="Colony"
                                        formikForm={advancedSearchForm}
                                        placeholder="Placeholder"
                                        fieldName="colony"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="date"
                                        type="date"
                                        InputProps={{
                                            startAdornment: <span></span>,
                                        }}
                                        formikForm={advancedSearchForm}
                                        label="Start Date"
                                        fieldName="date"
                                    />
                                    <TextFieldWithFormikValidation
                                        name="date2"
                                        type="date"
                                        InputProps={{
                                            startAdornment: <span></span>,
                                        }}
                                        formikForm={advancedSearchForm}
                                        label="End Date"
                                        fieldName="date2"
                                    />
                                    <AdvancedSearchTabForm formikForm={advancedSearchForm} />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        type="submit"
                                    >
                                        Search
                                    </Button>
                                </Box>
                            ) : (
                                <form onSubmit={formik.handleSubmit}>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="search"
                                        label="Search"
                                        formikForm={formik}
                                        fieldName="search"
                                    />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        type="submit"
                                    >
                                        Search
                                    </Button>
                                </form>
                            )}
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
                        <Button
                            variant="contained"
                            onClick={() => {
                                router.push(`/entries/create`);
                            }}
                        >
                            Create
                        </Button>
                        <EntryPaginationTable
                            queryDef={isAdvancedSearch ? AdvancedSearchEntryDef : SearchEntryDef}
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
                            advanced={advanced}
                            isAdvancedSearch={isAdvancedSearch}
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
        </ColorBackground>
    );
};

export default ManagePlacesPage;
