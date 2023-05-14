import {
    // createPersonSchema,
    searchSchema,
    // updateCategorySchema,
} from 'client/formikSchemas';
// import {
//     CreatePersonDef,
//     DeletePersonDef,
//     SearchPeopleDef,
//     UpdatePersonDef,
// } from 'client/graphqlDefs';
import {
    // Person,
    SearchType
} from 'client/types';
// import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import {
    // FormEvent,
    useCallback, useEffect, useMemo, useState
} from "react";
import { PaperDashStyles } from "styles/styles";
// import { useMutation } from 'urql';
import { Entry } from "../../new_types/api_types";
import { useMutation, useQueryClient, useQuery as uq } from "@tanstack/react-query";

import ColorBackground from '@components/ColorBackground';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';

import {
    GridColDef,
    GridRowsProp,
    DataGrid,
    GridRowId,
    // GridToolbar,
    // GridToolbarExport,
    // GridColumnVisibilityModel,
    // GridRowModel, GridValidRowModel,
    GridToolbarFilterButton,
    // GRID_CHECKBOX_SELECTION_COL_DEF
} from "@mui/x-data-grid";

// import ActionDialog from '@components/ActionDialog';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
// import PaginationTable from '@components/PaginationTable';
// import PaginationTableHead from '@components/PaginationTableHead';
// import PaginationTableRow from '@components/PaginationTableRow';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import AddCircle from '@mui/icons-material/AddCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import RemoveCircle from "@mui/icons-material/RemoveCircle";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddRelationshipDialog from "@components/AddRelationshipDialog";
import EditPersonDialog from "@components/EditPersonDialog";
import { parsePeople, PersonObject, toTitleCase } from "../../client/entryUtils";
import { useSearch, useSearchDispatch } from "@components/context/SearchContext";
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider";

// interface SelectedRowParams {
//     id: GridRowId;
//     // field?: string;
// }

interface PeopleMap {
    [key: string]: PersonObject
}

interface RelationState {
    open: boolean
    mutation: string
}

interface EditModalState {
    open:boolean
    mode:string
}

const ManageMarksPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;
    // const [search, setSearch] = useState<string>('john');
    const {search} = useSearch()
    const searchDispatch = useSearchDispatch()
    
    const [selectedRow, setSelectedRow] =
        useState<GridRowId>("");
    
    useEffect(()=>{
        if (search === ''){
            searchDispatch({
                type: "FUZZY_ADVANCED",
                payload:new URLSearchParams({person:"john"}).toString()
            });
        }
    }, [searchDispatch])
    
    const [relationOpen, setRelationOpen] = useState<RelationState>({open:false, mutation:'closed'})
    const [editOpen, setEditOpen] = useState<EditModalState>({open:false, mode:'closed'})
    const [confirm, setConfirm] = useState<boolean>(false)
    const router = useRouter()
    
    const doSearch = useCallback(async () => {
        const req = `https://api.shoppingstories.org/itemsearch-fuzzy/?${search}`
        const res = await fetch(req);
        let toret: {entries: Entry[]} = JSON.parse(await res.text());
        // console.log("Search Options: ", search, "fuzzy-", fuzzy, "advanced-", advanced)
        // console.log(req)
        // console.log(toret);
        return toret;
    },[search])
    
    const {data, isFetching} = uq({
        queryKey: ["entries", search],
        queryFn: doSearch,
        // initialData: () => queryClient.getQueryData(['entries', search, fuzzy, advanced]),
        // enabled: search !== '',
    })
    
    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: search === '' ? 'john' : new URLSearchParams(search).get("person")?.toString() ?? "",
        },
        validationSchema: searchSchema,
        onSubmit: (values) => {
            searchDispatch({
                type: "FUZZY_ADVANCED",
                payload: new URLSearchParams({person:values.search}).toString()
            })
            setSelectedRow("")
        },
    });
    
    const cols: GridColDef[] = [
        // {...GRID_CHECKBOX_SELECTION_COL_DEF, width:100},
        {field: 'Name', headerName: 'Name', flex:1, hideable:false},
        {field: 'ID', headerName: 'ID', flex:1, hideable:false, sortable:false}
    ]
    
    const people: { rows: GridRowsProp, pplMap: PeopleMap} = useMemo(()=>{
        if (!data || !data.entries) return {rows:[], pplMap: {}}
        const {entries} = data
        let pplMap: PeopleMap = {}
        // let r = /'(.*?)'/g ///'((?:\\.|[^'\\])*)'/g
        for (const e of entries){
            if (e.accountHolderID && e.account_name && e.accountHolder){
                let ppl = parsePeople(e.accountHolder)
                if (ppl.length){
                    pplMap[e.accountHolderID] = ppl[0]
                }
            }
            if (e?.people?.length && e.peopleID && e.people_obj){
                let ppl = parsePeople(e.people_obj)
                for (let p of ppl){
                    if (p._id && p.name && !pplMap[p._id]){
                        pplMap[p._id] = p
                    }
                }
                // let pSet = new Set<string>(e.people)
                // let matches = [...e.peopleID.matchAll(r)]
                // if (matches.length === e.people.length) {
                //     for (let [j, m] of matches.entries()) {
                //         if (!pplMap[m[1]]) {
                //             // pSet.delete(pplMap[m[1]])
                //             pplMap[m[1]] = e.people[j]
                //         }
                //     }
                // }
            }
        }
        let rows: GridRowsProp = Object.entries(pplMap)
            .map(([id, p])=>({
                Name: toTitleCase(p.name).trimStart(),
                id: id,
                ID: id,
            }))
        return { rows: rows, pplMap: pplMap}
    }, [data])
    
    const handleCellFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        const row = event.currentTarget.parentElement;
        const id = row!.dataset.id!;
        // const field = event.currentTarget.dataset.field!;
        console.log(id)
        setSelectedRow(id);
    }, [setSelectedRow]);
    
    const queryClient = useQueryClient()
    
    // const handleACtionClick = useCallback((action: string) => {
    //     // if (selectedRows?.id){
    //     //     // handleEntryAction(action, entryMap[selectedRow.id])
    //     // }
    //     // else{
    //     //     // handleEntryAction(action, undefined)
    //     // }
    // },[selectedRows])
    

    
    // const getEntryResults = useCallback( async ()=>{
    //     if (selectedRow === "" || isNaN(selectedRow as number))  return
    //     let person = people.pplMap[selectedRow].name
    //     console.log(person)
    //     if (!person) {return}
    //     searchDispatch({
    //         type: "FUZZY_ADVANCED",
    //         payload: person
    //     })
    // }, [searchDispatch, selectedRow, people.pplMap])
    
    const entriesRedirect = useCallback(  ()=>{
        console.log(selectedRow)
        if (selectedRow === "" || !selectedRow)  return
        let person = people.pplMap[selectedRow].name
        console.log(person)
        if (!person) {return}
        searchDispatch({
            type: "FUZZY_ADVANCED",
            payload: new URLSearchParams({person:person}).toString()
        })
        router.push('/entries')
        
    },[searchDispatch, selectedRow, people.pplMap])
    
    const addMutation = useMutation({
        mutationFn: (people:[string, string, string]) => {
            const [p1, p2, mutation] = people
            let saveUrl = `https://api.shoppingstories.org/${mutation}_people_relationship/?` + new URLSearchParams({
                person1_name: p1,
                person2_name: p2
            }).toString();
            let req = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
            return fetch(saveUrl, req).then(p => {console.log(p)})
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    
    const addRelationship = useCallback((p1:string, p2:string, mutation:string) => {
        addMutation.mutate([p1, p2, mutation])
    }, [addMutation])
    
    const editMutation = useMutation({
        mutationFn: (person:[string, string]) => {
            const [id, name] = person
            let saveUrl = `https://api.shoppingstories.org/edit_person/?` + new URLSearchParams({ person_id: id }).toString();
            let reqBody = JSON.stringify({ name: name })
            let req = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: reqBody
            }
            console.log(req)
            return fetch(saveUrl, req).then(p => {
                console.log(p)
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    
    const editPerson = useCallback((id:string, name:string) => {
        editMutation.mutate([id, name])
        // let saveUrl = `https://api.shoppingstories.org/edit_person/?` + new URLSearchParams({person_id: id}).toString();
        // let reqBody = JSON.stringify({name: name})
        // let req = {
        //     method: "POST",
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json"
        //     },
        //     body: reqBody
        // }
        // fetch(saveUrl, req)//.then(p => {console.log(p)})
        setEditOpen({open:false, mode:'closed'})
    }, [editMutation])
    
    const deleteMutation = useMutation({
        mutationFn: (id:string) => {
            let saveUrl = `https://api.shoppingstories.org/delete_person/?` + new URLSearchParams({ person_id: id }).toString();
            return fetch(saveUrl).then(p => {
                console.log(p)
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    
    const deletePerson = useCallback((id:string) => {
        deleteMutation.mutate(id)
        setConfirm(false)
        setEditOpen({open:false, mode:'closed'})
    }, [deleteMutation])
    

    
    const resetSearch = () => {
        searchDispatch({
            type: "FUZZY_ADVANCED",
            payload: new URLSearchParams({person:"john"}).toString()
        });
        setSelectedRow('')
    }
    
    if (loading) {
        return <LoadingPage />;
    }
    
    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                {/*<Box sx={{height: '80vh'}}>*/}
                <Paper sx={{
                    ...PaperDashStyles
                    // ...PaperStylesSecondary,
                    // ...PaperStyles,
                    // backgroundColor: 'var(--secondary-bg)',
                    // , height:'80vh', width:'100%'
                }}>
                    <Grid container spacing={2}>
                            <Grid item xs={12}>
                            {/*<Paper>*/}
                                <form onSubmit={searchForm.handleSubmit}>
                                    <Stack spacing={2}>
                                        <div>
                                            <Typography
                                                sx={{ textAlign: 'center' }}
                                                variant="h4"
                                            >
                                                People
                                            </Typography>
                                        </div>
                                
                                        <TextFieldWithFormikValidation
                                            variant={'filled'}
                                            fullWidth
                                            name="search"
                                            fieldName="search"
                                            label="Search"
                                            formikForm={searchForm}
                                        />
                                        <Stack direction={'row'} spacing={1}>
                                            <LoadingButton
                                                loading={isFetching}//{isLoading}
                                                variant="contained"
                                                fullWidth
                                                type="submit"
                                            >
                                                <Typography fontWeight={"500"} color="secondary.contrastText">
                                                    Search
                                                </Typography>
                                            </LoadingButton>
                                            <LoadingButton
                                                onClick={resetSearch}
                                                variant={"contained"}
                                                color={'secondary'}
                                                fullWidth
                                            >
                                                Reset Results
                                            </LoadingButton>
                                        </Stack>
                                    </Stack>
                                </form>
                            {/*</Paper>*/}
                            </Grid>
                            <Grid item xs={12} sx={{height:"80vh", width:'100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                                <Paper sx={{height: '100%',width: '100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                                    <Stack sx={{ borderBottom: 1, borderColor: 'divider', p: 1, }}>
                                    <Stack spacing={1} direction='row'>
                                        {isAdminOrModerator &&
                                            (<>
                                                <Button
                                                    onClick={entriesRedirect}
                                                    disabled={!selectedRow || selectedRow === ""}
                                                    hidden={!isAdminOrModerator}
                                                    variant="contained"
                                                    color={"secondary"}
                                                >
                                                    View Entries
                                                </Button>
                                                <Button
                                                    onClick={()=> setEditOpen({open:true, mode:'edit'})}
                                                    disabled={!selectedRow || selectedRow === ""}
                                                    hidden={!isAdminOrModerator}
                                                    variant="contained"
                                                    color={"warning"}
                                                >
                                                    <Typography fontWeight={"500"}>
                                                        Edit
                                                    </Typography>
                                                </Button>
                                                { !confirm &&
                                                    <Button
                                                        onClick={()=> setConfirm(true)}
                                                        disabled={!selectedRow || selectedRow === ""}
                                                        hidden={!isAdminOrModerator}
                                                        variant="contained"
                                                        color={"error"}
                                                    >
                                                        <Typography fontWeight={"500"}>
                                                            Delete
                                                        </Typography>
                                                    </Button>
                                                }
                                                { confirm &&
                                                    <Button
                                                        sx={{ ml: 1 }}
                                                        onClick={() => deletePerson(selectedRow as string)}
                                                        variant={"contained"}
                                                        color={'error'}
                                                    >
                                                        Confirm ?
                                                    </Button>
                                                }
                                                <Divider flexItem orientation={'vertical'}/>
                                                <Button
                                                    onClick={()=>setEditOpen({open:true, mode:'view'})}
                                                    disabled={!selectedRow || selectedRow === ""}
                                                    hidden={!isAdminOrModerator}
                                                    variant="contained"
                                                    color={"primary"}
                                                >
                                                    <Typography fontWeight={"500"} color="secondary.contrastText">
                                                        View Relationships
                                                    </Typography>
                                                </Button>
                                                <Button
                                                    onClick={() => setRelationOpen({open:true, mutation:"add"})}
                                                    variant="contained"
                                                    color={'success'}
                                                    startIcon={<AddCircle sx={{color: "secondary.contrastText"}} />}
                                                    hidden={!isAdminOrModerator}
                                                >
                                                    <Typography fontWeight={"500"} color="secondary.contrastText">
                                                        Add Relationship
                                                    </Typography>
                                                </Button>
                                                <Button
                                                    onClick={() => setRelationOpen({open:true, mutation:"remove"})}
                                                    variant="contained"
                                                    color={"error"}
                                                    startIcon={<RemoveCircle sx={{color: "secondary.contrastText"}} />}
                                                    hidden={!isAdminOrModerator}
                                                >
                                                    <Typography fontWeight={"500"} color="secondary.contrastText">
                                                        Remove Relationship
                                                    </Typography>
                                                </Button>
                                            </>)
                                        }
                                    </Stack>
                                    </Stack>
                                    <DataGrid
                                        // autoHeight
                                        autoPageSize
                                        pagination
                                        columns={cols}
                                        rows={people.rows}
                                        // checkboxSelection
                                        // isRowSelectable={p =>
                                        //     !selectedRows || (Object.keys(selectedRows).length < 2 && !selectedRows[p.row.id])
                                        // }
                                        components={{
                                            Toolbar: GridToolbarFilterButton
                                        }}
                                        componentsProps={{
                                            cell: { onFocus: handleCellFocus },
                                        }}
                                    />
                                </Paper>
                            </Grid>
                    </Grid>
                </Paper>
                {/*</Box>*/}
            </DashboardPageSkeleton>
            <AddRelationshipDialog
                open={relationOpen.open && relationOpen.mutation !== 'closed'}
                setOpen={setRelationOpen}
                handleSubmit={addRelationship}
                person1={selectedRow as string}
                mutation={relationOpen.mutation}
            />
            <EditPersonDialog
                handleSubmit={editPerson}
                open={editOpen.open && editOpen.mode !== 'closed'}
                setOpen={setEditOpen}
                person={selectedRow !== "" && !!people.pplMap[selectedRow] ? people.pplMap[selectedRow] : undefined}
                relations={selectedRow.toString().trim() !== "" && !!people.pplMap[selectedRow] && !!people.pplMap[selectedRow].related
                    ? Object.fromEntries(people.pplMap[selectedRow].related
                        .filter(r=>r in people.pplMap).map(r => [r, people.pplMap[r]]))
                    : {}
            }
                id={selectedRow as string}
                mode={editOpen.mode}
            />
        </ColorBackground>
    );
};

export default ManageMarksPage;


// const [_createPersonResult, createPerson] =
//     useMutation<Person>(CreatePersonDef);
// const [_updatePersonResult, updatePerson] =
//     useMutation<Person>(UpdatePersonDef);
// const [_deletePersonResult, deletePerson] =
//     useMutation<Person>(DeletePersonDef);
//
// const [search, setSearch] = useState<string>('');
// const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
//
// const [reQuery, setReQuery] = useState(false);
// const [isLoading, setIsLoading] = useState(false);
// const [creating, setCreating] = useState(false);
// const [deleting, setDeleting] = useState(false);
// const [updating, setUpdating] = useState(false);
// const [rows, setRows] = useState<Person[]>([]);
//
// const [openUpdate, setOpenUpdate] = useState<boolean>(false);
// const handleOpenUpdate = () => setOpenUpdate(true);
// const handleCloseUpdate = () => setOpenUpdate(false);
//
// const [openDelete, setOpenDelete] = useState<boolean>(false);
// const handleOpenDelete = () => setOpenDelete(true);
// const handleCloseDelete = () => setOpenDelete(false);
//
// const [openCreate, setOpenCreate] = useState<boolean>(false);

//    const handleOpenCreate = () => setOpenCreate(true);
//     const handleCloseCreate = () => {
//         setOpenCreate(false);
//         createForm.resetForm();
//     };
//
//     const createForm = useFormik<Omit<Person, 'id'>>({
//         initialValues: {
//             firstName: '',
//             lastName: '',
//             account: '',
//             enslaved: '',
//             gender: '',
//             location: '',
//             prefix: '',
//             suffix: '',
//             profession: '',
//             professionCategory: '',
//             professionQualifier: '',
//             reference: '',
//             store: '',
//             variations: '',
//         },
//         validationSchema: createPersonSchema,
//         onSubmit: async (values, { resetForm }) => {
//             setCreating(true);
//             const res = await createPerson({
//                 person: values,
//             });
//             if (res.error) {
//                 console.error(res.error);
//             } else {
//                 setReQuery(true);
//                 handleCloseCreate();
//                 resetForm();
//             }
//             setCreating(false);
//         },
//     });

//
// const updateForm = useFormik<Person>({
//     initialValues: {
//         id: '',
//         firstName: '',
//         lastName: '',
//         account: '',
//         enslaved: '',
//         gender: '',
//         location: '',
//         prefix: '',
//         suffix: '',
//         profession: '',
//         professionCategory: '',
//         professionQualifier: '',
//         reference: '',
//         store: '',
//         variations: '',
//     },
//     validationSchema: updateCategorySchema,
//     onSubmit: async (values, { resetForm }) => {
//         setUpdating(true);
//         const { id, ...updates } = values;
//
//         const res = await updatePerson({
//             id,
//             updates,
//         });
//         if (res.error) {
//             console.error(res.error);
//         } else {
//             handleCloseUpdate();
//             resetForm();
//         }
//         setUpdating(false);
//     },
// });
//
// const handleItemDelete = async (e?: FormEvent<HTMLFormElement>) => {
//     if (e) {
//         e.preventDefault();
//     }
//     if (personToDelete) {
//         setDeleting(true);
//         const id = personToDelete.id;
//         const res = await deletePerson({ id });
//         if (res.error) {
//             console.error(res.error);
//         } else {
//             setReQuery(true);
//             handleCloseDelete();
//         }
//         setDeleting(false);
//     }
// };

// <PaginationTable
//     queryDef={SearchPeopleDef}
//     search={search}
//     setRows={setRows}
//     reQuery={reQuery}
//     setReQuery={setReQuery}
//     setIsLoading={setIsLoading}
//     headerRow={
//         <PaginationTableHead
//             isAdmin={isAdmin}
//             isAdminOrModerator={isAdminOrModerator}
//             labels={[
//                 'First name',
//                 'Last name',
//                 'Prefix',
//                 'Suffix',
//                 'Account',
//                 'Enslaved',
//                 'Gender',
//                 'Location',
//                 'Profession',
//                 'Profession Category',
//                 'Profession Qualifier',
//                 'Reference',
//                 'Store',
//                 'Variations',
//             ]}
//         />
//     }
//     bodyRows={rows.map((row, i) => (
//         <PaginationTableRow
//             key={i}
//             row={row}
//             isAdmin={isAdmin}
//             cellValues={[
//                 row.firstName,
//                 row.lastName,
//                 row.prefix,
//                 row.suffix,
//                 row.account,
//                 row.enslaved,
//                 row.gender,
//                 row.location,
//                 row.profession,
//                 row.professionCategory,
//                 row.professionQualifier,
//                 row.reference,
//                 row.store,
//                 row.variations,
//             ]}
//             isAdminOrModerator={isAdminOrModerator}
//             onEditClick={(row) => {
//                 updateForm.setValues(
//                     cloneWithoutTypename(row),
//                 );
//                 handleOpenUpdate();
//             }}
//             onDeleteClick={async (row) => {
//                 setPersonToDelete(row);
//                 handleOpenDelete();
//             }}
//         />
//     ))}
// />

// {/* Edit Dialog */}
// <ActionDialog
//     isOpen={openUpdate}
//     onClose={handleCloseUpdate}
//     isSubmitting={updating}
//     onSubmit={updateForm.handleSubmit}
//     title={`Edit Person`}
// >
//     <DialogContentText>
//         Update any of the fields and submit.
//     </DialogContentText>
//     <TextFieldWithFormikValidation
//         fullWidth
//         autoFocus
//         name="firstName"
//         label="First name"
//         fieldName="firstName"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="lastName"
//         label="Last name"
//         fieldName="lastName"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="account"
//         label="Account"
//         fieldName="account"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="enslaved"
//         label="Enslaved"
//         fieldName="enslaved"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="gender"
//         label="Gender"
//         fieldName="gender"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="location"
//         label="Location"
//         fieldName="location"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="prefix"
//         label="Prefix"
//         fieldName="prefix"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="suffix"
//         label="Suffix"
//         fieldName="suffix"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="profession"
//         label="Profession"
//         fieldName="profession"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="professionCategory"
//         label="Profession Category"
//         fieldName="professionCategory"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="professionQualifier"
//         label="Profession Qualifier"
//         fieldName="professionQualifier"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="reference"
//         label="Reference"
//         fieldName="reference"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="store"
//         label="Store"
//         fieldName="store"
//         formikForm={updateForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="variations"
//         label="Variations"
//         fieldName="variations"
//         formikForm={updateForm}
//     />
// </ActionDialog>
//
// {/* Create Dialog */}
// <ActionDialog
//     isOpen={openCreate}
//     onClose={handleCloseCreate}
//     isSubmitting={creating}
//     onSubmit={createForm.handleSubmit}
//     title={`Create Person`}
// >
//     <DialogContentText>Create a new Person</DialogContentText>
//     <TextFieldWithFormikValidation
//         fullWidth
//         autoFocus
//         name="firstName"
//         label="First name"
//         fieldName="firstName"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="lastName"
//         label="Last name"
//         fieldName="lastName"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="account"
//         label="Account"
//         fieldName="account"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="enslaved"
//         label="Enslaved"
//         fieldName="enslaved"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="gender"
//         label="Gender"
//         fieldName="gender"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="location"
//         label="Location"
//         fieldName="location"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="prefix"
//         label="Prefix"
//         fieldName="prefix"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="suffix"
//         label="Suffix"
//         fieldName="suffix"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="profession"
//         label="Profession"
//         fieldName="profession"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="professionCategory"
//         label="Profession Category"
//         fieldName="professionCategory"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="professionQualifier"
//         label="Profession Qualifier"
//         fieldName="professionQualifier"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="reference"
//         label="Reference"
//         fieldName="reference"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="store"
//         label="Store"
//         fieldName="store"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="variations"
//         label="Variations"
//         fieldName="variations"
//         formikForm={createForm}
//     />
// </ActionDialog>
//
// {/* Delete Dialog */}
// <ActionDialog
//     isOpen={openDelete}
//     onClose={handleCloseDelete}
//     isSubmitting={deleting}
//     onSubmit={handleItemDelete}
//     title={`Confirm delete of ${personToDelete?.firstName} ${personToDelete?.lastName}`}
// >
//     Are you sure you want to delete{' '}
//     {personToDelete &&
//         personToDelete.firstName + personToDelete.lastName}
// </ActionDialog>
