import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
// import EntryPaginationTable from '@components/EntryPaginationTable';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import Delete from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    EntryFields,
    ParsedEntryFields,
    // SearchParsedEntryDef,
} from 'client/graphqlDefs';
import { Entry } from 'client/types';
import { cloneWithoutTypename, flatten } from 'client/util';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { PaperStyles, PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';
import xlsx from 'xlsx';

const deleteParsedEntryDef = `
mutation deleteParsedEntry($id: String!, $populate: Boolean!) {
  deleteParsedEntry(id: $id) {
    ...entryFields
  }
}
${ParsedEntryFields}
`;

const createEntryDef = `
mutation createEntry($entry: CreateEntryInput!, $populate: Boolean!) {
  createEntry(createEntryInput: $entry) {
    ...entryFields
  }
}
${EntryFields}
`;

const ManagePlacesPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    // const isModerator = isInGroup(Roles.Moderator, groups);
    // const isAdminOrModerator = isAdmin || isModerator;
    const [_deletePlaceResult, deletePlace] = useMutation(deleteParsedEntryDef);
    const [_createEntryResult, createEntry] = useMutation(createEntryDef);
    const [placeToDelete, ] = useState<{
        id: string;
    } | null>(null);
    const [, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDeleteAll, setOpenDeleteAll] = useState(false);
    const [uploadAll, setUploadAll] = useState(false);
    const [rows, ] = useState<Entry[]>([]);
    const [deleting, setDeleting] = useState(false);

    const { documentName } = router.query;
    // const handleOpenDelete = () => {
    //     setOpenDelete(true);
    // };

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

    const exportRowsToSpreadSheet = () => {
        const XLSX = xlsx;
        const fileName = `export-${Date.now()}`;
        const flatRows = rows.map((row) => flatten(cloneWithoutTypename(row)));
        const workSheet = XLSX.utils.json_to_sheet(flatRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, workSheet, fileName);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    const handleDatabaseUpload = async () => {
        setIsLoading(true);
        const rowsCopy = [...rows];
        console.log(rowsCopy);
        rowsCopy.forEach(async (row) => {
            const entry = JSON.parse(JSON.stringify(row));
            //const entry = row;
            entry.people.map((person: any) => {
                if (!Boolean(person.id)) {
                    delete person.id;
                }
                return person;
            });

            entry.places.map((place: any) => {
                if (!Boolean(place.id)) {
                    delete place.id;
                }
                return place;
            });

            if (entry.regularEntry) {
                entry.regularEntry.tobaccoMarks.map((mark: any) => {
                    if (!Boolean(mark.markID)) {
                        delete mark.markID;
                    }
                    return mark;
                });
            }

            if (entry.tobaccoEntry) {
                delete entry.tobaccoEntry.__typename;
                entry.tobaccoEntry.marks.map((mark: any) => {
                    if (!Boolean(mark.markID)) {
                        delete mark.markID;
                    }
                    return mark;
                });
            }

            if (!Boolean(entry.dateInfo.fullDate)) {
                delete entry.dateInfo.fullDate;
            }

            if (entry.money) {
                delete entry.money.__typename;
                delete entry.money.currency.__typename;
                delete entry.money.sterling.__typename;
                delete entry.money.currency.__typename;
            }
            delete entry.documentName;
            delete entry.id;
            delete entry.__typename;
            delete entry.accountHolder.__typename;
            delete entry.dateInfo.__typename;
            delete entry.meta.__typename;

            const res = await createEntry({
                entry,
                populate: true,
            });

            if (res.error) {
                console.error(res.error);
            }
        });
        setIsLoading(false);
        router.push(`/spreadsheet/newimport`);
    };

    const handleDeleteAll = async () => {
        setDeleting(true);
        rows.forEach(async (row) => {
            let entry = JSON.parse(JSON.stringify(row));
            let id = entry.id;
            let res = await deletePlace({ id, populate: false });
            if (res.error) {
                console.error(res.error);
            }
        });
        setDeleting(false);
        router.push(`/spreadsheet/newimport`);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <Container>
                <Paper sx={PaperStylesSecondary}>
                    <div>
                        <Typography sx={{ textAlign: 'center' }} variant="h4">
                            Viewing parsed entries for document: &apos;
                            {documentName}&apos;
                        </Typography>
                        <Typography
                            sx={{ textAlign: 'center' }}
                            variant="body1"
                        >
                            This page will allow you view/edit parsed entries
                            from the uploaded document. You can review any
                            parser errors and make corrections to the entries as
                            necessary. Modifying data here will have no effect
                            on the live website until you click the &apos;Upload
                            to Live Database&apos; button.
                            <br />
                            <br />
                            NOTE: If you would like to reupload or delete the
                            document to/from the database, you should first
                            delete all of the parsed entries from this page.
                            Failure to do so will cause the entries to appear
                            again if a document is later uploaded with the same
                            name.
                        </Typography>
                    </div>
                </Paper>
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
                                        onClick={() => setUploadAll(true)}
                                    >
                                        upload to live database
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={exportRowsToSpreadSheet}
                                    >
                                        download entries as excel
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        startIcon={<Delete />}
                                        onClick={() => setOpenDeleteAll(true)}
                                    >
                                        delete all entries
                                    </Button>
                                </div>
                            </Stack>
                        ) : null}
                        {/* <EntryPaginationTable
                            isAdmin={isAdmin}
                            isAdminOrModerator={isAdminOrModerator}
                            queryDef={SearchParsedEntryDef}
                            onEditClick={(row: any) =>
                                router.push(
                                    `/spreadsheet/entries/update/${row.id}`,
                                )
                            }
                            onDeleteClick={async (row: any) => {
                                setPlaceToDelete({
                                    id: row.id,
                                });
                                handleOpenDelete();
                            }}
                            search={'' + documentName}
                            reQuery={reQuery}
                            setRows={setRows}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            advanced={null}
                            isAdvancedSearch={false}
                        /> */}
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            type="button"
                        ></LoadingButton>
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

            {/* Delete All Dialog */}
            <ActionDialog
                isOpen={openDeleteAll}
                onClose={() => setOpenDeleteAll(false)}
                isSubmitting={deleting}
                onSubmit={handleDeleteAll}
                title={`Confirm deletion of all entries`}
            >
                <DialogContentText>
                    <p>Are you sure you want to delete all parsed entries?</p>
                    <h5>
                        Do this if you are planning on deleting the spreadsheet
                        document as well.
                    </h5>
                </DialogContentText>
            </ActionDialog>

            {/* Upload All Dialog */}
            <ActionDialog
                isOpen={uploadAll}
                onClose={() => setUploadAll(false)}
                isSubmitting={isLoading}
                onSubmit={handleDatabaseUpload}
                title={`Confirm upload of all entries`}
            >
                <DialogContentText>
                    <p>
                        Are you sure you want to upload all parsed entries to
                        the live database in the current state?
                    </p>
                    <h5>
                        Note that if you want to modify or delete the entries
                        from the live database after upload, you will need to do
                        so via the entries page.
                    </h5>
                </DialogContentText>
            </ActionDialog>
        </ColorBackground>
    );
};

export default ManagePlacesPage;
