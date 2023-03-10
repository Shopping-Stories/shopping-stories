import { useState, useCallback } from "react";
import { NextPage } from 'next';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useQuery } from "@tanstack/react-query";

import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import EntryPaginationTable from "@components/EntryPaginationTable";
// import LoadingPage from '@components/LoadingPage';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import { searchSchema } from 'client/formikSchemas';
import { SearchType } from 'client/types';
import { Entry} from "new_types/api_types";
import { Roles } from 'config/constants.config';
import { PaperStyles } from 'styles/styles';
import { useEntryDispatch } from "@components/context/EntryContext";
import AdvancedSearchDialog from "@components/AdvancedSearchDialog";
import { useSearch, useSearchDispatch, SearchAction } from "@components/context/SearchContext";

import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

interface EntryQueryResult {
    entries: (Entry)[];
}

const getType = (fz:boolean, adv:boolean): SearchAction["type"] => {
    if (fz && adv) return "FUZZY_ADVANCED"
    if (!fz && adv) return "ADVANCED"
    if (fz && !adv) return "FUZZY_SIMPLE"
    return "SIMPLE"
}

const EntriesPage: NextPage = () => {
    const { groups } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    // const [search, setSearch] = useState<string>('');
    const {search, fuzzy, advanced} = useSearch()
    const searchDispatch = useSearchDispatch()
    const [fuzzToggle, setFuzzToggle] = useState<boolean>(search !== '' ? fuzzy : true)
    const [advancedOpen, setAdvancedOpen] = useState<boolean>(false)
    const [advSubmitted, setAdvSubmitted] = useState<boolean>(false)
    const dispatch = useEntryDispatch()
    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: !advanced ? search : '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            if (values.search)
                searchDispatch({type: getType(fuzzToggle, false), payload: values.search})
        },
    });
    
    // console.log(search)
    
    const doSearch = useCallback(async () => {
        const req = advanced
            ? `https://api.preprod.shoppingstories.org/itemsearch${fuzzy ? '-fuzzy' : ""}/?${search}`
            : `https://api.preprod.shoppingstories.org/${fuzzy ? "fuzzy" : ""}search/${search}`
        const res = await fetch(req);
        let toret: EntryQueryResult = JSON.parse(await res.text());
        console.log("Search Options: ", search, "fuzzy-", fuzzy, "advanced-", advanced)
        console.log(req)
        console.log(toret);
        return toret;
    },[search, fuzzy, advanced])
    
    // const queryClient = useQueryClient()
    
    const {data, isLoading} = useQuery({
        queryKey: ["entries", search, fuzzy, advanced],
        queryFn: doSearch,
        // initialData: () => queryClient.getQueryData(['entries', search, fuzzy, advanced]),
        enabled: search !== '' && !advancedOpen,
        keepPreviousData: true,
        staleTime: 1000
    });
    
    const toGraph = useCallback((query:string) => {
        const path = `/entries/graphview/${query}`;
        searchDispatch({type: getType(fuzzToggle, advSubmitted), payload: query})
        router.push({
            pathname: path,
            query: {search:query, fuzzy:fuzzToggle, advanced:advSubmitted}
        });
    }, [advSubmitted, fuzzToggle, router, searchDispatch]);
    
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
                // refetch().then(q => console.log(q.status))
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
    },[dispatch, router])
    
    const handleFuzzyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFuzzToggle(e.target.checked)
    };
    
    
    // if (loading) {
    //     return <LoadingPage />;
    // }

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
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={fuzzToggle}
                                                onChange={handleFuzzyChange}
                                                color={"secondary"}
                                            />
                                        }
                                        // label={`Fuzzy: ${fuzzy ? "on" : "off"}`}
                                        label={"Fuzzy"}
                                        labelPlacement="start"
                                        name={"fuzzy"}
                                    />
                                    <Divider flexItem orientation={"vertical"}/>
                                    {/*<ButtonGroup variant="contained" fullWidth>*/}
                                        <LoadingButton
                                            fullWidth
                                            loading={search !== '' && isLoading}
                                            variant="contained"
                                            type="submit"
                                            color={"secondary"}
                                            // onClick={()=>setFuzzy(false)}
                                            // sx={{ mt:1 }}
                                        >
                                            Search
                                        </LoadingButton>
                                    {/*    <LoadingButton*/}
                                    {/*        fullWidth*/}
                                    {/*        loading={search !== '' && isLoading}*/}
                                    {/*        // variant="contained"*/}
                                    {/*        type="submit"*/}
                                    {/*        onClick={()=>setFuzzy(true)}*/}
                                    {/*        // sx={{ mt:1 }}*/}
                                    {/*    >*/}
                                    {/*        Fuzzy Search*/}
                                    {/*    </LoadingButton>*/}
                                    {/*</ButtonGroup>*/}
                                    <Divider flexItem orientation={"vertical"}/>
                                    <LoadingButton
                                        fullWidth
                                        loading={search !== '' && isLoading}
                                        variant="contained"
                                        color={"secondary"}
                                        type="submit"
                                        onClick={()=>setAdvancedOpen(true)}
                                    >
                                        Advanced Options
                                    </LoadingButton>
                                    <Divider flexItem orientation={"vertical"}/>
                                    <LoadingButton
                                        fullWidth
                                        loading={search !== '' && isLoading}
                                        variant="contained"
                                        // type={'submit'}
                                        color={"secondary"}
                                        onClick={()=>toGraph(searchForm.values.search)}
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
            <AdvancedSearchDialog
                // setSearch={searchDispatch}
                open={advancedOpen}
                setAdvancedOpen={setAdvancedOpen}
                fuzzy={fuzzToggle}
                setFuzzy={setFuzzToggle}
                toGraph={toGraph}
                setAdvSubmitted={setAdvSubmitted}
            />
        </ColorBackground>

        // {/*</QueryClientProvider>*/}
    );
};

export default EntriesPage;
