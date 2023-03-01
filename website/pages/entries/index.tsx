import { useState, useCallback } from "react";
import { NextPage } from 'next';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useQuery } from "@tanstack/react-query";

import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import EntryPaginationTable from "@components/EntryPaginationTable";
import LoadingPage from '@components/LoadingPage';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import { searchSchema } from 'client/formikSchemas';
import { SearchType } from 'client/types';
import { Entry} from "new_types/api_types";
import { Roles } from 'config/constants.config';
import { PaperStyles } from 'styles/styles';
import { useEntryDispatch } from "@components/context/EntryContext";
import AdvancedSearchDialog from "@components/GraphView/AdvancedSearchDialog";

import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ButtonGroup from "@mui/material/ButtonGroup";
// import AddCircle from '@mui/icons-material/AddCircle';
// import Select from '@mui/material/Select';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import DialogContentText from '@mui/material/DialogContentText';
// import FormGroup from '@mui/material/FormGroup';

interface EntryQueryResult {
    entries: (Entry)[];
}

const doSearch = async (search: string, fuzzy: boolean): Promise<EntryQueryResult> => {
    // console.log(fuzzy)
    const res = await fetch(`https://api.preprod.shoppingstories.org/${fuzzy ? "fuzzy" : ""}search/${search}`);
    // console.log(await res.text());
    // console.log(res);
    let toret: EntryQueryResult = JSON.parse(await res.text());
    return toret;
};

const doAdvSearch = async (query: string): Promise<EntryQueryResult> => {
    const res = await fetch(query);
    // console.log(await res.text());
    // console.log(res);
    let toret: EntryQueryResult = JSON.parse(await res.text());
    return toret;
};

const EntriesPage: NextPage = () => {
    const { groups, loading } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const [search, setSearch] = useState<string>('');
    const [advanced, setAdvanced] = useState<boolean>(false)
    const [fuzzy, setFuzzy] = useState<boolean>(false)
    const dispatch = useEntryDispatch()

    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            if (values.search)
                setSearch(values.search)
        },
    });

    const {data, refetch, isLoading} = useQuery({
        queryKey: ["entries", search],
        queryFn: () => advanced ? doAdvSearch(search) : doSearch(search, fuzzy),
        enabled: search !== ''
    });
    
    const toGraph = () => {
        const path = `/entries/graphview/${searchForm.values.search}`;

        router.push(path);
    };
    
    const handleEntryAction = useCallback((action: string, payload: Entry | undefined) => {
        console.log(action)
        if (action === "Delete"){
            const id = payload?._id
            if (!id) return
            let saveUrl = `https://api.preprod.shoppingstories.org/delete_entry/?` + new URLSearchParams({entry_id: id}).toString();
            let req = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
            fetch(saveUrl, req).then(p => {
                console.log(p)
                refetch().then(q => console.log(q.status))
            })
            return
        }
        const path = `/entries/${action}`;
        if (payload && action && action !== "Create" ){
            dispatch({
                type: "CREATE",
                payload: payload
            })
        }
        router.push(path);
    },[dispatch, router, refetch])
    
    const handleFuzzyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFuzzy(e.target.checked)
    };
    
    
    if (loading) {
        return <LoadingPage />;
    }

    return (
        // <QueryClientProvider client={queryClient}>
        <ColorBackground>
            <Header />
            <>
                <Paper
                    sx={{
                        backgroundColor: 'var(--secondary-bg)',
                        ...PaperStyles,
                        // margin: '1rem',
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            {/* Advanced Search View */}
                            {/*<FormGroup>*/}
                            <form onSubmit={searchForm.handleSubmit}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    variant={'filled'}
                                    name={'search'}
                                    formikForm={searchForm}
                                    label={'Search'}
                                    fieldName={'search'}
                                />
                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                    sx={{ mt: 1, mb: 1 }}
                                >
                                    {/*<FormControl component="fieldset">*/}
                                    {/*    <FormGroup>*/}
                                    
                                    {/*    </FormGroup>*/}
                                    {/*</FormControl>*/}
                                    {/*<FormControlLabel*/}
                                    {/*    control={*/}
                                    {/*        <Switch*/}
                                    {/*            checked={fuzzy}*/}
                                    {/*            onChange={handleFuzzyChange}*/}
                                    {/*        />*/}
                                    {/*    }*/}
                                    {/*    // label={`Fuzzy: ${fuzzy ? "on" : "off"}`}*/}
                                    {/*    label={"Fuzzy"}*/}
                                    {/*    labelPlacement="start"*/}
                                    {/*    name={"fuzzy"}*/}
                                    {/*/>*/}
                                    {/*<Divider flexItem orientation={"vertical"}/>*/}
                                    <ButtonGroup variant="contained" fullWidth>
                                        <LoadingButton
                                            fullWidth
                                            loading={search !== '' && isLoading}
                                            // variant="contained"
                                            type="submit"
                                            // sx={{ mt:1 }}
                                        >
                                            Search
                                        </LoadingButton>
                                        <LoadingButton
                                            fullWidth
                                            loading={search !== '' && isLoading}
                                            // variant="contained"
                                            type="submit"
                                            // sx={{ mt:1 }}
                                        >
                                            Fuzzy Search
                                        </LoadingButton>
                                    </ButtonGroup>
                                    <Divider flexItem orientation={"vertical"}/>
                                    <LoadingButton
                                        fullWidth
                                        loading={search !== '' && isLoading}
                                        variant="contained"
                                        type="submit"
                                        onClick={()=>setAdvanced(true)}
                                    >
                                        Advanced Search
                                    </LoadingButton>
                                    <Divider flexItem orientation={"vertical"}/>
                                    <LoadingButton
                                        fullWidth
                                        loading={search !== '' && isLoading}
                                        variant="contained"
                                        // type={'submit'}
                                        color={"secondary"}
                                        onClick={toGraph}
                                        // sx={{ mt:1 }}
                                    >
                                        Graph View
                                    </LoadingButton>
                                    {/*</ButtonGroup>*/}
                                </Stack>
                            </form>
                            {/*</FormGroup>*/}
                            {/*</Paper>*/}
                        </Grid>
                            <Grid item xs={12}>
                                <EntryPaginationTable
                                    entries={data?.entries ?? []}
                                    isAdmin={isAdmin}
                                    isAdminOrModerator={isAdminOrModerator}
                                    handleEntryAction={handleEntryAction}
                                />
                            </Grid>
                    </Grid>
                </Paper>
            </>
            <AdvancedSearchDialog setSearch={setSearch} setAdvanced={setAdvanced} open={advanced} fuzzy={fuzzy}/>
        </ColorBackground>

        // {/*</QueryClientProvider>*/}
    );
};

export default EntriesPage;
