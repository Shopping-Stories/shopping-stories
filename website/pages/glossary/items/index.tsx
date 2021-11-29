import GlossaryItemIndexCard from '@components/GlossaryItemIndexCard';
import Header from '@components/Header';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FetchGlossaryItemsDef } from 'client/graphqlDefs';
import { GlossaryItem, OptionsType } from 'client/types';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useQuery } from 'urql';
import * as yup from 'yup';

const validationSchema = yup.object({
    search: yup.string(),
});

const ItemGlossaryIndexPage: NextPage = () => {
    const router = useRouter();
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const formik = useFormik<{ search: string }>({
        initialValues: {
            search: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: any) => {
            setSearch(values.search);
        },
    });

    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const [options, setOptions] = useState<OptionsType>({
        limit: rowsPerPage,
        skip: null,
    });

    interface GlossaryItemsQueryResult {
        rows: GlossaryItem[];
        count: number;
    }

    const [{ data, stale }] = useQuery<GlossaryItemsQueryResult>({
        query: FetchGlossaryItemsDef,
        variables: { options, search },
        requestPolicy: 'cache-and-network',
    });

    useEffect(() => {
        setPage(0);
        updateQuery(0);
    }, [search]);

    useEffect(() => {
        if (!router.query.page) {
            return;
        }
        const pageNum = parseInt(router.query.page as string, 10);
        if (Number.isInteger(pageNum) && pageNum > 0) {
            setPage(pageNum - 1);
            fetchItemsPage(pageNum - 1);
        }
    }, [router.query.page]);

    const rows = data?.rows ?? [];
    const count = data?.count ?? 0;

    const updateQuery = (page: number) => {
        router.push({
            pathname: router.pathname,
            query: {
                search: encodeURI(search),
                page: encodeURI(page + 1 + ''),
            },
        });
    };

    useEffect(() => {
        if (stale) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [stale]);

    const fetchItemsPage = (newPage: number) => {
        setOptions((prevOpts: any) => ({
            ...prevOpts,
            limit: rowsPerPage,
            skip: newPage * rowsPerPage,
        }));
        setPage(newPage);
        updateQuery(newPage);
    };

    return (
        <div className={backgrounds.colorBackground}>
            <Header />

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper
                        sx={{
                            backgroundColor: `var(--secondary-bg)`,
                            margin: '3rem',
                            padding: '1rem',
                        }}
                    >
                        <div>
                            <Typography
                                sx={{ textAlign: 'center' }}
                                variant="h2"
                            >
                                Item Glossary
                            </Typography>
                        </div>
                        <FormGroup>
                            <form onSubmit={formik.handleSubmit}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="search"
                                    label="Search"
                                    fieldName="search"
                                    formikForm={formik}
                                />
                                <LoadingButton
                                    variant="contained"
                                    loading={loading}
                                    fullWidth
                                    type="submit"
                                >
                                    Search
                                </LoadingButton>
                            </form>
                        </FormGroup>
                    </Paper>
                </Grid>
            </Grid>

            <Paper
                sx={{
                    backgroundColor: `var(--secondary-bg)`,
                    margin: '3rem',
                    padding: '1rem',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            {rows.map((row, index) => (
                                <Grid key={index} item xs={12} sm={6} md={3}>
                                    <GlossaryItemIndexCard item={row} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Container maxWidth="xs">
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <LoadingButton
                                        disabled={page < 1}
                                        variant="contained"
                                        loading={loading}
                                        onClick={() => fetchItemsPage(page - 1)}
                                    >
                                        Prev
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={4}>
                                    {page + 1} of{' '}
                                    {Math.ceil(count / rowsPerPage)}
                                </Grid>
                                <Grid item xs={4}>
                                    <LoadingButton
                                        disabled={
                                            page ===
                                            Math.ceil(count / rowsPerPage) - 1
                                        }
                                        variant="contained"
                                        loading={loading}
                                        onClick={() => fetchItemsPage(page + 1)}
                                    >
                                        Next
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </Container>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default ItemGlossaryIndexPage;
