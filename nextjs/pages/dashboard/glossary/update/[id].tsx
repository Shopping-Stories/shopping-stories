import GlossaryItemForm from '@components/GlossaryImageForm';
import Header from '@components/Header';
import TextAreaWithFormikValidation from '@components/TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { glossaryItemSchema } from 'client/formikSchemas';
import { findGlossaryItemDef, updateGlossaryItemDef } from 'client/graphqlDefs';
import { cloneWithoutTypename } from 'client/util';
import { useFormik } from 'formik';
import { merge } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';

const UpdateGlossaryItem: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const [findGlossaryItemResult, _findGlossaryItem] = useQuery({
        query: findGlossaryItemDef,
        variables: { id },
    });
    const glossaryItem = findGlossaryItemResult?.data?.findGlossaryItem;
    const [_updateGlossaryItemResult, updateGlossaryItem] = useMutation(
        updateGlossaryItemDef,
    );

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
        images: [],
        examplePurchases: [],
    };

    useEffect(() => {
        if (glossaryItem) {
            const cleanFields = cloneWithoutTypename(glossaryItem);
            delete cleanFields.id;
            updateForm.setValues(merge(initialValues, cleanFields));
        }
    }, [glossaryItem]);

    const updateForm = useFormik({
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
            images: [],
            examplePurchases: [],
        },
        validationSchema: glossaryItemSchema,
        onSubmit: async (values, { resetForm }) => {
            let errorUploadingImage = false;
            setIsLoading(true);
            const UploadImage = async (image: any) => {
                // find the File corresponding to the filename
                // in thumbnailImage
                const imageFile = imageFiles.find(
                    (imageFile: File) =>
                        imageFile.name === image.thumbnailImage,
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
                    router.push('/dashboard/glossary/items');
                    resetForm();
                    setIsLoading(false);
                }
            }
            setIsLoading(false);
        },
    });

    if (findGlossaryItemResult.fetching) {
        return (
            <div>
                <Header />
            </div>
        );
    } else if (findGlossaryItemResult.error) {
        router.push('/dashboard/glossary/items');
        return <>error</>;
    } else {
        return (
            <div>
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
                        <LoadingButton loading={loading} variant="contained" type="submit">
                            Submit
                        </LoadingButton>
                    </form>
                </Paper>
            </div>
        );
    }
};

export default UpdateGlossaryItem;
