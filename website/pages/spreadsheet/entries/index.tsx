import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import EntryPaginationTable from '@components/EntryPaginationTable';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ParsedEntryFields, SearchParsedEntryDef } from 'client/graphqlDefs';
import { Entry } from 'client/types';
import { cloneWithoutTypename, flatten } from 'client/util';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { PaperStyles } from 'styles/styles';
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

const ManagePlacesPage: NextPage = () => {
    console.log('got here');
    const { groups, loading } = useAuth();
    const router = useRouter();
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isModerator = isInGroup(Roles.Moderator, groups);
    const isAdminOrModerator = isAdmin || isModerator;
    const [_deletePlaceResult, deletePlace] = useMutation(deleteParsedEntryDef);
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
                                            router.push(`/spreadsheet/entries/`)
                                        }
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
                            </Stack>
                        ) : null}
                        <EntryPaginationTable
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
                            search={''}
                            reQuery={reQuery}
                            setRows={setRows}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            advanced={null}
                            isAdvancedSearch={false}
                        />
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
        </ColorBackground>
    );
};

export default ManagePlacesPage;
