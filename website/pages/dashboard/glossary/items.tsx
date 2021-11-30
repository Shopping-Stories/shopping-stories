import ActionDialog from '@components/ActionDialog';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import PaginationTable from '@components/PaginationTable';
import PaginationTableHead from '@components/PaginationTableHead';
import PaginationTableRow from '@components/PaginationTableRow';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import AddCircle from '@mui/icons-material/AddCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { searchSchema } from 'client/formikSchemas';
import {
    DeleteGlossaryItemDef,
    FetchGlossaryItemsDef,
} from 'client/graphqlDefs';
import { GlossaryItem, SearchType } from 'client/types';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';
import { useMutation } from 'urql';

const GlossaryItemsDashboardPage: NextPage = () => {
    const router = useRouter();
    const { groups, loading } = useAuth('/', [Roles.Admin]);

    interface DeleteResult {
        deletedItem: GlossaryItem;
    }

    const [_deleteItemResult, deleteItem] = useMutation<DeleteResult>(
        DeleteGlossaryItemDef,
    );

    const [search, setSearch] = useState<string>('');
    const [itemToDelete, setItemToDelete] = useState<GlossaryItem | null>(null);

    const [reQuery, setReQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [rows, setRows] = useState<GlossaryItem[]>([]);

    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleItemDelete = async (
        e?: FormEvent<HTMLFormElement> | undefined,
    ) => {
        if (e) {
            e.preventDefault();
        }
        if (itemToDelete) {
            setDeleting(true);
            const id = itemToDelete.id;
            const res = await deleteItem({ id });
            if (res.error || !Boolean(res.data)) {
            } else {
                const images = res.data!.deletedItem.images.map(
                    (image: GlossaryItem['images'][0]) => image.imageKey,
                );
                setReQuery(true);

                for (const image of images) {
                    try {
                        await Storage.remove(`images/${image}`);
                    } catch (error: any) {
                        console.error(error.message);
                    }
                }
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
            setReQuery(true);
            setSearch(values.search);
        },
    });

    if (loading) {
        return <LoadingPage />;
    }
    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                    <form onSubmit={searchForm.handleSubmit}>
                        <Stack spacing={2}>
                            <div>
                                <Typography
                                    sx={{ textAlign: 'center' }}
                                    variant="h4"
                                >
                                    Glossary Items
                                </Typography>
                            </div>

                            <TextFieldWithFormikValidation
                                fullWidth
                                name="search"
                                fieldName="search"
                                label="Search"
                                formikForm={searchForm}
                            />

                            <LoadingButton
                                loading={isLoading}
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                Search
                            </LoadingButton>
                        </Stack>
                    </form>
                </Paper>
                <Paper sx={PaperStylesSecondary}>
                    <Stack spacing={2}>
                        <div>
                            <Button
                                startIcon={<AddCircle />}
                                variant="contained"
                                onClick={() =>
                                    router.push('/dashboard/glossary/create')
                                }
                            >
                                Create
                            </Button>
                        </div>
                        <PaginationTable
                            queryDef={FetchGlossaryItemsDef}
                            search={search}
                            setRows={setRows}
                            reQuery={reQuery}
                            setReQuery={setReQuery}
                            setIsLoading={setIsLoading}
                            headerRow={
                                <PaginationTableHead
                                    isAdmin={true}
                                    isAdminOrModerator={true}
                                    labels={[
                                        'Item Name',
                                        'Category',
                                        'Subcategory',
                                        'Qualifiers',
                                        'Description',
                                        'Origin',
                                        'Use',
                                        'Cultural Context',
                                        'Citations',
                                    ]}
                                />
                            }
                            bodyRows={rows.map((row, i) => (
                                <PaginationTableRow
                                    key={i}
                                    row={row}
                                    isAdmin={true}
                                    cellValues={[
                                        row.name,
                                        row.category,
                                        row.subcategory,
                                        row.qualifiers,
                                        `${row.description.substring(0, 20)}${
                                            row.description.length > 20
                                                ? '...'
                                                : ''
                                        }`,
                                        `${row.origin.substring(0, 20)}${
                                            row.origin.length > 20 ? '...' : ''
                                        }`,
                                        `${row.use.substring(0, 20)}${
                                            row.use.length > 20 ? '...' : ''
                                        }`,
                                        `${row.culturalContext.substring(
                                            0,
                                            20,
                                        )}${
                                            row.culturalContext.length > 20
                                                ? '...'
                                                : ''
                                        }`,
                                        `${row.citations.substring(0, 20)}${
                                            row.citations.length > 20
                                                ? '...'
                                                : ''
                                        }`,
                                    ]}
                                    isAdminOrModerator={true}
                                    onEditClick={(row) => {
                                        router.push(
                                            `/dashboard/glossary/update/${row.id}`,
                                        );
                                    }}
                                    onDeleteClick={async (row) => {
                                        setItemToDelete(row);
                                        handleOpenDelete();
                                    }}
                                />
                            ))}
                        />
                    </Stack>
                </Paper>
            </DashboardPageSkeleton>

            {/* Delete Dialog */}
            <ActionDialog
                isOpen={openDelete}
                onClose={handleCloseDelete}
                isSubmitting={deleting}
                onSubmit={handleItemDelete}
                title={`Confirm delete of ${itemToDelete?.name}`}
            >
                Are you sure you want to delete{' '}
                {itemToDelete && itemToDelete.name}
            </ActionDialog>
        </ColorBackground>
    );
};

export default GlossaryItemsDashboardPage;
