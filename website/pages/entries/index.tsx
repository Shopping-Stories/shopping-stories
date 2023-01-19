import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import EntryPaginationTable from '@components/EntryPaginationTable';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DialogContentText from '@mui/material/DialogContentText';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { advancedSearchSchema, searchSchema } from 'client/formikSchemas';
import {
    AdvancedSearchEntryDef,
    EntryFields,
    SearchEntryDef,
} from 'client/graphqlDefs';
import { AdvancedSearch, SearchType } from 'client/types';
import { Entry } from 'new_types/api_types';
// import { cloneWithoutTypename, flatten } from 'client/util';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';
import { PaperStyles } from 'styles/styles';
import { useMutation } from 'urql';
// import xlsx from 'xlsx';
import { FormControl, InputLabel, MenuItem } from '@mui/material';

import { FileUpload } from '@mui/icons-material';

const deleteEntryDef = `
mutation deleteEntry($id: String!, $populate: Boolean!) {
  deleteEntry(id: $id) {
    ...entryFields
  }
}
${EntryFields}
`;

const entriesData = [
    { label: 'Item', value: 'itemEntry' },
    { label: 'Tobacco', value: 'tobaccoEntry' },
];

// const queryClient = new QueryClient();

const downloadOptionsData = [
    { label: 'xlsx', value: 'xlsx' },

    // hide others without csv
    // { label: 'UTFA', value: 'utfa' },
    // { label: 'PDF', value: 'pdf' },
];

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const [_deletePlaceResult, deletePlace] = useMutation(deleteEntryDef);

    const [search, setSearch] = useState('');
    const [submitted, setSubmitted] = useState(false);
    // const [graph, setGraph] = useState(false)

    const [advanced, setAdvanced] = useState<AdvancedSearch | null>(null);
    const [placeToDelete, setPlaceToDelete] = useState<{
        id: string;
    } | null>(null);
    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [, setRows] = useState<Entry[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [currentSearchEntry, setCurrentSearchEntry ] = useState('');
    const [currentDownloadOption, setCurrentDownloadOption] = useState('');

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
            // setCurrentSearchEntry(values.search);
            setSubmitted(values.search);
        },
    });

    useEffect(() => {
        if (submitted) setSearch(searchForm.values.search);
    }, [submitted, searchForm.values.search]);

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

    const toGraph = () => {
        const path = `/entries/graphview/${searchForm.values.search}`;

        router.push(path);
    };

    // const exportRowsToSpreadSheet = () => {
    //     const XLSX = xlsx;
    //     const fileName = `export-${Date.now()}`;
    //     const flatRows = rows.map((row) => flatten(cloneWithoutTypename(row)));
    //     const workSheet = XLSX.utils.json_to_sheet(flatRows);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    //     XLSX.writeFile(wb, `${fileName}.xlsx`);
    // };

    const handleEntryChange = (e: any) => {
        console.log(e.target.value);
        setCurrentSearchEntry(e.target.value);
    };

    const handleDownloadOptionChange = (e: any) => {
        setCurrentDownloadOption(e.target.value);
        switch (e.target.value) {
            case 'xlsx':
                // exportRowsToSpreadSheet();
                break;
            case 'utfa':
                //  exportRowsToUTFA();
                break;
            case 'pdf':
                // exportRowsToPDF();
                break;
            default:
                break;
        }
        setCurrentDownloadOption('');
    };

    if (loading) {
        return <LoadingPage />;
    }

    const renderItemEntryComponent = () => {
        return (
            <Grid container spacing={1}>
                <Grid item lg={2} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`itemEntry.items`}
                        label={`Item Name`}
                        formikForm={advancedSearchForm}
                        fieldName={`itemEntry.items`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={3} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`itemEntry.category`}
                        label={`Category`}
                        formikForm={advancedSearchForm}
                        fieldName={`itemEntry.category`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={3} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`itemEntry.subcategory`}
                        label={`Subcategory`}
                        formikForm={advancedSearchForm}
                        fieldName={`itemEntry.subcategory`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`itemEntry.variant`}
                        label={`Variant`}
                        formikForm={advancedSearchForm}
                        fieldName={`itemEntry.variant`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`itemEntry.perOrder`}
                        label={`Per Order`}
                        type="number"
                        inputProps={{ min: -1 }}
                        formikForm={advancedSearchForm}
                        fieldName={`itemEntry.perOrder`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
            </Grid>
        );
    };

    const renderTobaccoEntryComponent = () => {
        return (
            <Grid container spacing={1}>
                <Grid item lg={3} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`tobaccoEntry.description`}
                        label={`Description`}
                        formikForm={advancedSearchForm}
                        fieldName={`tobaccoEntry.description`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={3} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`tobaccoEntry.tobaccoMarkName`}
                        label={`Tobacco Mark Name`}
                        formikForm={advancedSearchForm}
                        fieldName={`tobaccoEntry.tobaccoMarkName`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={3} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`tobaccoEntry.moneyType`}
                        label={`Type of Money`}
                        formikForm={advancedSearchForm}
                        fieldName={`tobaccoEntry.moneyType`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
                <Grid item lg={3} xs={6}>
                    <TextFieldWithFormikValidation
                        variant="outlined"
                        name={`tobaccoEntry.noteNumber`}
                        label={`Note Number`}
                        type="number"
                        inputProps={{ min: -1 }}
                        formikForm={advancedSearchForm}
                        fieldName={`tobaccoEntry.noteNumber`}
                        style={{ width: '-webkit-fill-available' }}
                    />
                </Grid>
            </Grid>
        );
    };

    return (
        // <QueryClientProvider client={queryClient}>
        <ColorBackground>
            <Header />
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={9}>
                        {/* Advanced Search View */}
                        <Paper
                            sx={{
                                backgroundColor: 'var(--secondary-bg)',
                                ...PaperStyles,
                                margin: '1rem',
                            }}
                        >
                            <FormGroup>
                                {currentSearchEntry ? (
                                    <Box
                                        sx={{
                                            '& .MuiTextField-root': {
                                                m: 1,
                                            },
                                        }}
                                        onSubmit={
                                            advancedSearchForm.handleSubmit
                                        }
                                        component="form"
                                    >
                                        {currentSearchEntry === 'itemEntry' &&
                                            renderItemEntryComponent()}
                                        {currentSearchEntry ===
                                            'tobaccoEntry' &&
                                            renderTobaccoEntryComponent()}
                                        <Grid container spacing={1}>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="accountHolderName"
                                                    label="Account Holder"
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    fieldName="accountHolderName"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="people"
                                                    label="Person"
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    fieldName="people"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="places"
                                                    label="Place"
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    fieldName="places"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="date"
                                                    type="date"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <span></span>
                                                        ),
                                                    }}
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    label="Start Date"
                                                    fieldName="date"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="date2"
                                                    type="date"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <span></span>
                                                        ),
                                                    }}
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    label="End Date"
                                                    fieldName="date2"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="storeOwner"
                                                    label="Company"
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    fieldName="storeOwner"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="folioYear"
                                                    label="Folio Year"
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    fieldName="folioYear"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item lg={4} xs={12}>
                                                <TextFieldWithFormikValidation
                                                    variant="outlined"
                                                    name="folioPage"
                                                    label="Folio Page"
                                                    formikForm={
                                                        advancedSearchForm
                                                    }
                                                    fieldName="folioPage"
                                                    style={{
                                                        width: '-webkit-fill-available',
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <LoadingButton
                                            fullWidth
                                            loading={isLoading}
                                            variant="contained"
                                            type={'submit'}
                                        >
                                            Search
                                        </LoadingButton>
                                    </Box>
                                ) : (
                                    <>
                                        <form
                                            onSubmit={searchForm.handleSubmit}
                                        >
                                            <TextFieldWithFormikValidation
                                                fullWidth
                                                variant={'filled'}
                                                name={'search'}
                                                formikForm={searchForm}
                                                label={'Search'}
                                                fieldName={'search'}
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
                                        <LoadingButton
                                            fullWidth
                                            loading={isLoading}
                                            variant="contained"
                                            onClick={toGraph}
                                        >
                                            Graph View
                                            {/*<Link*/}
                                            {/*    href={`/graphview/${search}`}*/}
                                            {/*    href={{*/}
                                            {/*        pathname: '/graphview/[search]',*/}
                                            {/*        query: {*/}
                                            {/*            search: `/entries/graphview/${searchForm.values.search}`*/}
                                            {/*            advanced:*/}
                                            {/*        }*/}
                                            {/*    }}*/}
                                            {/*    activeClassName="active"*/}
                                            {/*></Link>*/}
                                        </LoadingButton>
                                    </>
                                )}
                            </FormGroup>
                        </Paper>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                        <Paper
                            sx={{
                                ...PaperStyles,
                                backgroundColor: 'var(--secondary-bg)',
                                margin: '1rem',
                                // marginTop: '3rem',
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="advanced-search">
                                    Advanced Search
                                </InputLabel>
                                <Select
                                    labelId="advanced-search"
                                    id="search-entry-select"
                                    value={currentSearchEntry}
                                    label="Advanced Search"
                                    onChange={handleEntryChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {entriesData.map(
                                        (entry: any, key: Number) => (
                                            <MenuItem
                                                value={entry.value}
                                                key={key.toString()}
                                            >
                                                {entry.label}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                        </Paper>

                        {isAdminOrModerator && (
                            <Button
                                sx={{
                                    marginLeft: '1rem',
                                    marginRight: '1rem',
                                }}
                                variant="contained"
                                startIcon={<FileUpload />}
                                onClick={() => router.push(`/file-upload`)}
                            >
                                upload file
                            </Button>
                        )}

                        {isAdminOrModerator && (
                            <Paper
                                sx={{
                                    ...PaperStyles,
                                    backgroundColor: 'var(--secondary-bg)',
                                    margin: '1rem',
                                    marginTop: '3rem',
                                }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="download-view">
                                        Download As
                                    </InputLabel>
                                    <Select
                                        labelId="download-view"
                                        id="download-options-select"
                                        value={currentDownloadOption}
                                        label="Download As"
                                        onChange={handleDownloadOptionChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {downloadOptionsData.map(
                                            (
                                                downloadOption: any,
                                                key: Number,
                                            ) => (
                                                <MenuItem
                                                    key={key.toString()}
                                                    value={downloadOption.value}
                                                >
                                                    {downloadOption.label}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
            {(search || advanced) && (
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
                                {/* <div>
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <FileDownloadIcon />
                                    }
                                    onClick={
                                        exportRowsToSpreadSheet
                                    }
                                >
                                    download current page
                                </Button>
                            </div> */}
                            </Stack>
                        ) : null}
                        
                        <EntryPaginationTable
                            isAdmin={isAdmin}
                            isAdminOrModerator={isAdminOrModerator}
                            queryDef={
                                currentSearchEntry
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
                            isAdvancedSearch={Boolean(
                                currentSearchEntry,
                            )}
                        />
                        
                    </Stack>
                </Paper>
            )}
        

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
        // {/*</QueryClientProvider>*/}
    );
};

export default ManagePlacesPage;
