import ColorBackground from '@components/ColorBackground';
import GlossaryItemForm from '@components/GlossaryImageForm';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import SnackBarCloseButton from '@components/SnackBarCloseButton';
import TextAreaWithFormikValidation from '@components/TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { glossaryItemSchema } from 'client/formikSchemas';
import {
    FetchGlossaryItemDef,
    UpdateGlossaryItemDef,
} from 'client/graphqlDefs';
import { GlossaryItem } from 'client/types';
import { GlossaryItemQueryResult } from 'client/urqlConfig';
import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { merge } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';

const UpdateGlossaryItem: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const { loading: authLoading } = useAuth('/entries', [Roles.Admin]);

    const [findGlossaryItemResult, _findGlossaryItem] =
        useQuery<GlossaryItemQueryResult>({
            query: FetchGlossaryItemDef,
            variables: { id },
            requestPolicy: 'cache-and-network',
        });
    const glossaryItem = findGlossaryItemResult?.data?.item;
    const [_updateGlossaryItemResult, updateGlossaryItem] = useMutation(
        UpdateGlossaryItemDef,
    );
    const [openSuccess, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSuccessClose = (
        _: Event | React.SyntheticEvent,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setIsLoading] = useState<boolean>(false);

    const handleImage = (image: File) => {
        setImageFiles((images: File[]) => [...images, image]);
    };

    const removeImage = (imageKey: string) => {
        setImageFiles(
            imageFiles.filter((image: File) => image.name !== imageKey),
        );
    };

    const updateForm = useFormik<UpdateGlossaryItemType>({
        enableReinitialize: true,
        initialValues: {
            name: '',
            description: '',
            origin: '',
            use: '',
            category: '',
            subcategory: '',
            qualifiers: '',
            culturalContext: '',
            citations: '',
            images: [] as any,
        },
        validationSchema: glossaryItemSchema,
        onSubmit: async (values) => {
            let errorUploadingImage = false;
            setIsLoading(true);

            const UploadImage = async (image: any) => {
                // find the File corresponding to the filename
                // in imageKey
                const imageFile = imageFiles.find(
                    (imageFile: File) => imageFile.name === image.imageKey,
                );

                try {
                    // upload image to images directory of s3 bucket
                    if (imageFile) {
                        await Storage.put(
                            `images/${imageFile.name}`,
                            imageFile,
                        );
                    }
                } catch (error: any) {
                    console.error(error.message);
                    errorUploadingImage = true;
                }
            };

            // add images to s3 bucket
            for (const image of values.images) {
                await UploadImage(image);
            }

            if (errorUploadingImage === false) {
                const res = await updateGlossaryItem({
                    id: id,
                    updates: values,
                });

                if (res.error) {
                    setIsLoading(false);
                } else {
                    setSuccessMessage(`Successfully updated the entry`);
                    setSuccessOpen(true);
                }
            }
            setIsLoading(false);
        },
    });

    useEffect(() => {
        const initialValues = {
            name: '',
            description: '',
            origin: '',
            use: '',
            category: '',
            subcategory: '',
            qualifiers: '',
            culturalContext: '',
            citations: '',
            images: [] as any,
        };
        if (glossaryItem) {
            const cleanFields = cloneWithoutTypename(glossaryItem);
            delete cleanFields.id;
            updateForm.setValues(merge(initialValues, cleanFields));
        }
    }, [glossaryItem, updateForm]);

    type UpdateGlossaryItemType = Omit<GlossaryItem, 'id'>;

    

    if (findGlossaryItemResult.fetching || authLoading) {
        return <LoadingPage />;
    } else if (findGlossaryItemResult.error) {
        router.replace('/dashboard/glossary/items');
        return <>error</>;
    } else {
        return (
            <ColorBackground>
                <Header />
                <Paper
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >
                    <form onSubmit={updateForm.handleSubmit}>
                        <Grid container justifyContent="center" spacing={4}>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    href="/dashboard/glossary/items"
                                >
                                    Back to management panel
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography component="h2">
                                    Item Details
                                </Typography>
                                <Stack spacing={2}>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="name"
                                        label="Item Name"
                                        formikForm={updateForm}
                                        fieldName="name"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="category"
                                        label="Category"
                                        fieldName="category"
                                        formikForm={updateForm}
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="subcategory"
                                        label="Subcategory"
                                        fieldName="subcategory"
                                        formikForm={updateForm}
                                    />
                                    <TextAreaWithFormikValidation
                                        name="description"
                                        label="Description"
                                        placeholder="Description of the item"
                                        formikForm={updateForm}
                                        fieldName="description"
                                    />
                                    <TextAreaWithFormikValidation
                                        name="origin"
                                        fieldName="origin"
                                        label="Origin"
                                        placeholder="Origin of the item"
                                        formikForm={updateForm}
                                    />
                                    <TextAreaWithFormikValidation
                                        name="use"
                                        fieldName="use"
                                        label="Use"
                                        placeholder="explain the use of the item"
                                        formikForm={updateForm}
                                    />
                                    <TextAreaWithFormikValidation
                                        name="culturalContext"
                                        fieldName="culturalContext"
                                        label="Cultural Context"
                                        placeholder="explain the cultural context"
                                        formikForm={updateForm}
                                    />
                                    <TextAreaWithFormikValidation
                                        name="citations"
                                        fieldName="citations"
                                        label="Citations"
                                        placeholder="Any relevant citations"
                                        formikForm={updateForm}
                                    />
                                    <TextAreaWithFormikValidation
                                        name="qualifiers"
                                        label="Qualifiers"
                                        fieldName="qualifiers"
                                        formikForm={updateForm}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <GlossaryItemForm
                                    formikForm={updateForm}
                                    handleImage={handleImage}
                                    removeImage={removeImage}
                                />
                            </Grid>
                        </Grid>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </LoadingButton>
                    </form>
                </Paper>
                <Snackbar
                    open={openSuccess}
                    autoHideDuration={6000}
                    onClose={handleSuccessClose}
                    action={SnackBarCloseButton({
                        handleClose: handleSuccessClose,
                    })}
                >
                    <Alert severity="success">{successMessage}</Alert>
                </Snackbar>
            </ColorBackground>
        );
    }
};

export default UpdateGlossaryItem;
