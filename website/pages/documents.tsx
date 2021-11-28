import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { searchSchema } from 'client/formikSchemas';
import { FetchDocumentsDef } from 'client/graphqlDefs';
import { DocumentInfo, OptionsType, SearchType } from 'client/types';
import { handlePromise } from 'client/util';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import backgrounds from 'styles/backgrounds.module.css';
import { useQuery } from 'urql';

interface DocumentCardProps {
    document: DocumentInfo;
}

const getFile = async (fileKey: string) => {
    if (!fileKey || !fileKey.trim()) return null;
    try {
        const S3FileUrl = await Storage.get(`documents/${fileKey}`);
        const fileReq = new Request(S3FileUrl);
        const [res, _fileNotFound] = await handlePromise(fetch(fileReq));
        if (res && res.status === 200) {
            return S3FileUrl;
        }
    } catch (error: any) {
        console.error(error.message);
    }
    return null;
};

const DocumentCard = (props: DocumentCardProps) => {
    const { document } = props;

    const [fileUrl, setFileUrl] = useState<string>('');

    useEffect(() => {
        getFile(document.fileKey).then((url) => url && setFileUrl(url));
    }, []);

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={document.name} />
            <CardContent>{document.description}</CardContent>
            {fileUrl && (
                <CardActions>
                    <Link href={fileUrl}>Download {document.fileKey}</Link>
                </CardActions>
            )}
        </Card>
    );
};

interface QueryDocuments {
    rows: DocumentInfo[];
    count: number;
}

const DocumentsPage: NextPage = () => {
    const router = useRouter();
    const { loading: loadingAuth } = useAuth('/auth/signin');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState(0);

    const rowsPerPage = 10;

    const [options, setOptions] = useState<OptionsType>({
        limit: rowsPerPage,
        skip: null,
    });

    const [{ data, fetching }] = useQuery<QueryDocuments>({
        query: FetchDocumentsDef,
        variables: { options, search },
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
            fetchDocumentsPage(pageNum - 1);
        }
    }, [router.query.page]);

    const searchForm = useFormik<SearchType>({
        initialValues: {
            search: '',
        },
        validationSchema: searchSchema,
        onSubmit: (values: any) => {
            setSearch(values.search);
        },
    });

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
        if (fetching) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [fetching]);

    const fetchDocumentsPage = (newPage: number) => {
        setOptions((prevOpts: any) => ({
            ...prevOpts,
            limit: rowsPerPage,
            skip: newPage * rowsPerPage,
        }));
        setPage(newPage);
        updateQuery(newPage);
    };

    if (loadingAuth) {
        return <LoadingPage />;
    }

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
                                Documents
                            </Typography>
                        </div>
                        <FormGroup>
                            <form onSubmit={searchForm.handleSubmit}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="search"
                                    label="Search"
                                    fieldName="search"
                                    formikForm={searchForm}
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
                            {rows.map((doc, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <DocumentCard document={doc} />
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
                                        onClick={() =>
                                            fetchDocumentsPage(page - 1)
                                        }
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
                                        onClick={() =>
                                            fetchDocumentsPage(page + 1)
                                        }
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

export default DocumentsPage;
