import ActionDialog from '@components/ActionDialog';
import AdvancedSearchTabForm from '@components/AdvancedSearchTabForm';
import ColorBackground from '@components/ColorBackground';
import EntryPaginationTable from '@components/EntryPaginationTable';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DialogContentText from '@mui/material/DialogContentText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { advancedSearchSchema, searchSchema } from 'client/formikSchemas';
import {
    AdvancedSearchEntryDef,
    EntryFields,
    SearchEntryDef,
} from 'client/graphqlDefs';
import { AdvancedSearch, Entry, SearchType } from 'client/types';
import { cloneWithoutTypename, flatten } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { PaperStyles } from 'styles/styles';
import { useMutation } from 'urql';
import xlsx from 'xlsx';

const deleteEntryDef = `
mutation deleteEntry($id: String!, $populate: Boolean!) {
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
    const isAdminOrModerator = isAdmin || isModerator;
    const [_deletePlaceResult, deletePlace] = useMutation(deleteEntryDef);
    const [search, setSearch] = useState('');
    const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
    const [advanced, setAdvanced] = useState<AdvancedSearch | null>(null);
    const [placeToDelete, setPlaceToDelete] = useState<{
        id: string;
    } | null>(null);
    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [rows, setRows] = useState<Entry[]>([]);
    const [deleting, setDeleting] = useState(false);

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleItemDelete = async (
        e?: FormEvent<HTMLFormElement> | undefined,
    ) => {
        if (e) {
            e.preventDefault();
        }
        if (placeToDelete) {
            setDeleting(true);
            const id = placeToDelete.id;
            const res = await deletePlace({ id, populate: false });
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
            const query = cloneDeep(values);
            if (query.itemEntry && query.itemEntry.perOrder === -1) {
                delete query.itemEntry.perOrder;
            }
            if (query.tobaccoEntry && query.tobaccoEntry.noteNumber === -1) {
                delete query.tobaccoEntry.noteNumber;
            }

            setAdvanced(values);
        },
    });

    const exportRowsToSpreadSheet = () => {
        const XLSX = xlsx;
        const fileName = `export-${Date.now()}`;
        const flatRows = rows.map((row) => flatten(cloneWithoutTypename(row)));
        const workSheet = XLSX.utils.json_to_sheet(flatRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, workSheet, fileName);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <Container>
                <Grid container justifyContent="center">
                    <Grid
                        item
                        {...(isAdvancedSearch
                            ? { xs: 12 }
                            : { xs: 12, sm: 10, md: 8, lg: 6 })}
                    >
                        <Paper
                            sx={{
                                backgroundColor: 'var(--secondary-bg)',
                                ...PaperStyles,
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
                                label="Advanced"
                            />
                            <FormGroup>
                                {isAdvancedSearch ? (
                                    <Box
                                        onSubmit={
                                            advancedSearchForm.handleSubmit
                                        }
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
                                        <AdvancedSearchTabForm
                                            formikForm={advancedSearchForm}
                                        />
                                        <LoadingButton
                                            fullWidth
                                            loading={isLoading}
                                            variant="contained"
                                            type="submit"
                                        >
                                            Search
                                        </LoadingButton>
                                    </Box>
                                ) : (
                                    <form onSubmit={searchForm.handleSubmit}>
                                        <TextFieldWithFormikValidation
                                            fullWidth
                                            name="search"
                                            label="Search"
                                            formikForm={searchForm}
                                            fieldName="search"
                                        />
                                        <LoadingButton
                                            fullWidth
                                            loading={isLoading}
                                            variant="contained"
                                            type="submit"
                                        >
                                            Search
                                        </LoadingButton>
                                    </form>
                                )}
                            </FormGroup>
                        </Paper>
                    </Grid>
                </Grid>
                <Paper
                    sx={{
                        backgroundColor: 'var(--secondary-bg)',
                        ...PaperStyles,
                    }}
                >
                    <Stack spacing={2}>
                        {isAdmin ? (
                            <Stack direction="row" spacing={4}>
                                <div>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircle />}
                                        onClick={() =>
                                            router.push(`/entries/create`)
                                        }
                                    >
                                        Create
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={exportRowsToSpreadSheet}
                                    >
                                        download current page
                                    </Button>
                                </div>
                            </Stack>
                        ) : null}
                        <EntryPaginationTable
                            isAdmin={isAdmin}
                            isAdminOrModerator={isAdminOrModerator}
                            queryDef={
                                isAdvancedSearch
                                    ? AdvancedSearchEntryDef
                                    : SearchEntryDef
                            }
                            onEditClick={(row: any) =>
                                router.push(`/entries/update/${row.id}`)
                            }
                            onDeleteClick={async (row: any) => {
                                setPlaceToDelete({
                                    id: row.id,
                                });
                                handleOpenDelete();
                            }}
                            search={search}
                            reQuery={reQuery}
                            setRows={setRows}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            advanced={advanced}
                            isAdvancedSearch={isAdvancedSearch}
                        />
                    </Stack>
                </Paper>
            </Container>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm deletion of entry`}
            >
                <DialogContentText>
                    Are you sure you want to delete this entry
                </DialogContentText>
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManagePlacesPage;
