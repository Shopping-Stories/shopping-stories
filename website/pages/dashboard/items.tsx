import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import {
    // createItemSchema,
    searchSchema,
    // updateItemSchema,
} from 'client/formikSchemas';
import { SearchType } from 'client/types';
import { Roles } from 'config/constants.config';
import { useFormik, Formik, Form } from 'formik';
import { NextPage } from 'next';
import { useCallback, useMemo, useState } from "react";
import { PaperStylesSecondary } from 'styles/styles';
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef, GridRowId, GridRowsProp, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useQuery as uq, useMutation, useQueryClient } from "@tanstack/react-query";
import { Entry } from "../../new_types/api_types";
import { ItemObject, parseItem, toTitleCase } from "../../client/entryUtils";
import { useSearchDispatch } from "@components/context/SearchContext";
import { useRouter } from 'next/router';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
// import {
//     CreateItemDef,
//     DeleteItemDef,
//     SearchItemsDef,
//     UpdateItemDef,
// } from 'client/graphqlDefs';
// import { cloneWithoutTypename } from 'client/util';
// import PaginationTable from '@components/PaginationTable';
// import PaginationTableHead from '@components/PaginationTableHead';
// import PaginationTableRow from '@components/PaginationTableRow';
// import AddCircle from '@mui/icons-material/AddCircle';
// import ActionDialog from '@components/ActionDialog';
// import DialogContentText from '@mui/material/DialogContentText';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// import Divider from "@mui/material/Divider";
// import { PersonObject } from "../entryUtils";
// import FormGroup from "@mui/material/FormGroup";
// import FormLabel from "@mui/material/FormLabel";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";

interface ItemMap {
    [key: string]: ItemObject
}

interface EditItemForm {
    item: string,
    archMat: number
    category: string
    subcategory: string
}

const ManageItemsPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;
    
    const [search, setSearch] = useState<string>('john');
    const [selectedRow, setSelectedRow] =
        useState<GridRowId>("");
    // const [relationOpen, setRelationOpen] = useState<boolean>(false)
    const [editOpen, setEditOpen] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const searchDispacth = useSearchDispatch()
    const router = useRouter()
    
    const handleCellFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        const row = event.currentTarget.parentElement;
        const id = row!.dataset.id!;
        // const field = event.currentTarget.dataset.field!;
        console.log(id)
        setSelectedRow(id);
    }, [setSelectedRow]);
    
    const queryClient = useQueryClient()
    
    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values) => {
            setSearch(values.search);
            setSelectedRow("")
        },
    });
    
    const resetSearch = () => {
        setSearch('john')
        setSelectedRow('')
    }
    
    const doSearch = useCallback(async () => {
        const req = `https://api.preprod.shoppingstories.org/itemsearch-fuzzy/?${new URLSearchParams(
            searchForm.values.search === '' ? {person:search} : {item:search}
        ).toString()}`
        const res = await fetch(req);
        let toret: {entries: Entry[]} = JSON.parse(await res.text());
        // console.log("Search Options: ", search, "fuzzy-", fuzzy, "advanced-", advanced)
        // console.log(req)
        // console.log(toret);
        return toret;
    },[search, searchForm.values.search])
    
    const {data, isFetching} = uq({
        queryKey: ["entries", search],
        queryFn: doSearch,
        // initialData: () => queryClient.getQueryData(['entries', search, fuzzy, advanced]),
        enabled: search !== '',
    })
    
    const items: { rows: GridRowsProp, itemMap: ItemMap} = useMemo(()=>{
        if (!data || !data.entries) return {rows:[], itemMap: {}}
        const {entries} = data
        let itemMap: ItemMap = {}
        for (const e of entries){
            console.log(e)
            if (e.item_obj && e.item_obj !== ""){
                let item = parseItem(e.item_obj)
                if (item.length){
                    itemMap[item[0]._id] = item[0]
                }
            }
            // if (e?.people?.length && e.peopleID && e.people_obj){
            //     let ppl = parsePeople(e.people_obj)
            //     for (let p of ppl){
            //         if (p._id && p.name && !itemMap[p._id]){
            //             itemMap[p._id] = p
            //         }
            //     }
            // }
        }
        let rows: GridRowsProp = Object.entries(itemMap)
            .map(([id, item])=>({
                Item: toTitleCase(item.item).trimStart(),
                ArchMat: item.archMat,
                Category: item.category,
                Subcategory: item.subcategory,
                id: id,
                // ID: id,
            }))
        return { rows: rows, itemMap: itemMap}
    }, [data])
    
    const editMutation = useMutation({
        mutationFn: (itemKey:[string, string]) => {
            const [id, item] = itemKey
            let saveUrl = `https://api.preprod.shoppingstories.org/edit_item/?` + new URLSearchParams({ item_id: id }).toString();
            let reqBody = JSON.stringify({ item: item })
            let req = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: reqBody
            }
            return fetch(saveUrl, req).then(p => {
                console.log(p)
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    
    const editItem = useCallback((id:string, name:string) => {
        editMutation.mutate([id, name])
        // let saveUrl = `https://api.preprod.shoppingstories.org/edit_person/?` + new URLSearchParams({person_id: id}).toString();
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
        setEditOpen(false)
    }, [editMutation])
    
    const deleteMutation = useMutation({
        mutationFn: (id:string) => {
            let saveUrl = `https://api.preprod.shoppingstories.org/delete_item/?` + new URLSearchParams({ item_id: id }).toString();
            return fetch(saveUrl).then(p => {
                console.log(p)
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
    
    const deleteItem = useCallback((id:string) => {
        deleteMutation.mutate(id)
        setConfirm(false)
        setEditOpen(false)
    }, [deleteMutation])
    
    const cols: GridColDef[] = [
        // {...GRID_CHECKBOX_SELECTION_COL_DEF, width:100},
        {field: 'Item', headerName: 'Item', flex:1, hideable:false},
        // {field: 'ID', headerName: 'ID', flex:1, hideable:false, sortable:false},
        {field: 'ArchMat', headerName: 'ArchMat',},
        {field: 'Category', headerName: 'Category', flex:1},
        {field: 'Subcategory', headerName: 'SubCategory', flex:1}
    ]
    
    const initVals:EditItemForm = useMemo(()=> {
        if (selectedRow === "" || isNaN(selectedRow as number)) return {item:'', archMat:0, category:'', subcategory:''}
        const vals:EditItemForm = {
            item: items.itemMap[selectedRow].item,
            archMat: items.itemMap[selectedRow].archMat,
            category: items.itemMap[selectedRow].category,
            subcategory: items.itemMap[selectedRow].subcategory,
        }
        return vals
    }, [selectedRow, items.itemMap])
    
    const getEntryResults = useCallback( async ()=>{
        if (!selectedRow || selectedRow === "") return
        let item = items.itemMap[selectedRow].item
        if (!item) return
        searchDispacth({
            type: "FUZZY_ADVANCED",
            payload: new URLSearchParams({item:item}).toString()
        })
    }, [searchDispacth, selectedRow, items.itemMap])
    
    const entriesRedirect = () => {
        getEntryResults().then(()=>router.push('/entries'))
    }
    
    if (loading) {
        return <LoadingPage />;
    }
    
    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <form onSubmit={searchForm.handleSubmit}>
                                <Stack spacing={2}>
                                    <div>
                                        <Typography
                                            sx={{ textAlign: 'center' }}
                                            variant="h4"
                                        >
                                            Items
                                        </Typography>
                                    </div>
        
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="search"
                                        fieldName="search"
                                        label="Search"
                                        variant={'filled'}
                                        formikForm={searchForm}
                                    />
                                    <Stack direction={'row'} spacing={1}>
                                        <LoadingButton
                                            loading={isFetching}//{isLoading}
                                            variant="contained"
                                            type="submit"
                                            fullWidth
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
                        </Grid>
                {/*</Paper>*/}
                {/*<Paper sx={PaperStylesSecondary}>*/}
                {/*    <Stack spacing={2}>*/}
                {/*        {isAdmin ? (*/}
                {/*            <div>*/}
                {/*                <Button*/}
                {/*                    startIcon={<AddCircle />}*/}
                {/*                    variant="contained"*/}
                {/*                    onClick={() => setEditOpen(true)}*/}
                {/*                >*/}
                {/*                    Create*/}
                {/*                </Button>*/}
                {/*            </div>*/}
                {/*        ) : null}*/}
                        <Grid item xs={12} sx={{height:"80vh", width:'100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                            <Paper sx={{height: '100%',width: '100%', flexDirection: 'column', display: 'flex', alignItems: 'stretch'}}>
                                <Stack sx={{ borderBottom: 1, borderColor: 'divider', p: 1, }}>
                                    <Stack spacing={1} direction='row'>
                                        {isAdminOrModerator &&
                                            (<>
                                                {/*<Button*/}
                                                {/*    onClick={() => setRelationOpen(true)}*/}
                                                {/*    variant="contained"*/}
                                                {/*    startIcon={<AddCircle sx={{color: "secondary.contrastText"}} />}*/}
                                                {/*    hidden={!isAdminOrModerator}*/}
                                                {/*>*/}
                                                {/*    <Typography fontWeight={"500"} color="secondary.contrastText">*/}
                                                {/*        Add Relationship*/}
                                                {/*    </Typography>*/}
                                                {/*</Button>*/}
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
                                                    onClick={()=> setEditOpen(selectedRow !== '')}
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
                                                    onClick={() => deleteItem(selectedRow as string)}
                                                    variant={"contained"}
                                                    color={'error'}
                                                  >
                                                    Confirm ?
                                                  </Button>
                                                }
                                            </>)
                                        }
                                    </Stack>
                                </Stack>
                                <DataGrid
                                    // autoHeight
                                    autoPageSize
                                    pagination
                                    columns={cols}
                                    rows={items.rows}
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
            </DashboardPageSkeleton>
        
            {/* Edit Dialog */}
            <Dialog open={editOpen}>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initVals}
                        onSubmit={(v)=>editItem(selectedRow as string, v.item)}
                    >{({
                          values,
                          // touched,
                          // errors,
                          handleChange,
                          handleBlur,
                      }) => (
                      <Form>
                          <Grid container mt={1}>
                              <Grid item xs={12}>
                                  <TextField
                                      fullWidth
                                      name={'item'}
                                      label={'Name'}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      defaultValue={values.item}
                                      sx={{marginBottom: "1vh"}}
                                  />
                                  <TextField
                                      fullWidth
                                      name={'archMat'}
                                      label={'ArchMat'}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      defaultValue={values.archMat}
                                      sx={{marginBottom: "1vh"}}
                                  />
                                  <TextField
                                      fullWidth
                                      name={'category'}
                                      label={'Category'}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      defaultValue={values.category}
                                      sx={{marginBottom: "1vh"}}
                                  />
                                  <TextField
                                      fullWidth
                                      name={'subcategory'}
                                      label={'Subcategory'}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      defaultValue={values.subcategory}
                                      sx={{marginBottom: "1vh"}}
                                  />
                              </Grid>
                              <Grid item xs={12}>
                                  <DialogActions>
                                      {/*<Stack direction={'row'} spacing={2}>*/}
                                      <Button
                                          type={"submit"}
                                          variant={'contained'}
                                          color={'success'}
                                      >
                                          Submit
                                      </Button>
                                      <Button
                                          variant={'contained'}
                                          color={'error'}
                                          onClick={()=>setEditOpen(false)}
                                      >
                                          Cancel
                                      </Button>
                                      {/*</Stack>*/}
                                  </DialogActions>
                              </Grid>
                          </Grid>
                      </Form>
                    )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </ColorBackground>
    );
};

export default ManageItemsPage;



// <PaginationTable
//     queryDef={SearchItemsDef}
//     search={search}
//     setRows={setRows}
//     reQuery={reQuery}
//     setReQuery={setReQuery}
//     setIsLoading={setIsLoading}
//     headerRow={
//         <PaginationTableHead
//             isAdmin={isAdmin}
//             isAdminOrModerator={isAdminOrModerator}
//             labels={['Item', 'Variants']}
//         />
//     }
//     bodyRows={rows.map((row, i: number) => (
//         <PaginationTableRow
//             key={i}
//             row={row}
//             isAdmin={isAdmin}
//             cellValues={[row.item, row.variants]}
//             isAdminOrModerator={isAdminOrModerator}
//             onEditClick={(row) => {
//                 updateForm.setValues(
//                     cloneWithoutTypename(row),
//                 );
//                 handleOpenUpdate();
//             }}
//             onDeleteClick={async (row) => {
//                 setItemToDelete(row);
//                 handleOpenDelete();
//             }}
//         />
//     ))}
// />


// {/* Create Dialog */}
// <ActionDialog
//     isOpen={openCreate}
//     onClose={handleCloseCreate}
//     isSubmitting={creating}
//     onSubmit={createForm.handleSubmit}
//     title={`Create Item`}
// >
//     <DialogContentText>Create a new Item</DialogContentText>
//     <TextFieldWithFormikValidation
//         fullWidth
//         autoFocus
//         name="item"
//         label="Item"
//         fieldName="item"
//         formikForm={createForm}
//     />
//     <TextFieldWithFormikValidation
//         fullWidth
//         name="variants"
//         label="Variants"
//         fieldName="variants"
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
//     title={`Confirm Delete of ${itemToDelete?.item || ''}`}
// >
//     Are you sure you want to delete{' '}
//     {itemToDelete && itemToDelete.item}
// </ActionDialog>

// const [_createItemResult, createItem] = useMutation<Item>(CreateItemDef);
// const [_updateItemResult, updateItem] = useMutation<Item>(UpdateItemDef);
// const [_deleteItemResult, deleteItem] = useMutation<Item>(DeleteItemDef);
//
// // const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
// //
// // const [reQuery, setReQuery] = useState(false);
// // const [isLoading, setIsLoading] = useState(false);
// const [creating, setCreating] = useState(false);
// const [deleting, setDeleting] = useState(false);
// const [updating, setUpdating] = useState(false);
// const [rows, setRows] = useState<Item[]>([]);
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
// const handleOpenCreate = () => setOpenCreate(true);
// const handleCloseCreate = () => {
//     setOpenCreate(false);
//     createForm.resetForm();
// };

// const handleItemDelete = async (
//     e?: FormEvent<HTMLFormElement> | undefined,
// ) => {
//     if (e) {
//         e.preventDefault();
//     }
//     if (itemToDelete) {
//         setDeleting(true);
//         const id = itemToDelete.id;
//         const res = await deleteItem({ id });
//         if (res.error) {
//             console.error(res.error);
//         } else {
//             setReQuery(true);
//             handleCloseDelete();
//         }
//         setDeleting(false);
//     }
// };

// const createForm = useFormik<Omit<Item, 'id'>>({
//     initialValues: {
//         item: '',
//         variants: '',
//     },
//     validationSchema: createItemSchema,
//     onSubmit: async (values, { resetForm }) => {
//         setCreating(true);
//         const res = await createItem({
//             item: values,
//         });
//         if (res.error) {
//             console.error(res.error);
//         } else {
//             setReQuery(true);
//             handleCloseCreate();
//             resetForm();
//         }
//         setCreating(false);
//     },
// });
//
// const updateForm = useFormik<Item>({
//     initialValues: {
//         id: '',
//         item: '',
//         variants: '',
//     },
//     validationSchema: updateItemSchema,
//     onSubmit: async (values, { resetForm }) => {
//         setUpdating(true);
//         const res = await updateItem({
//             id: values.id,
//             updates: {
//                 item: values.item,
//                 variants: values.variants,
//             },
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