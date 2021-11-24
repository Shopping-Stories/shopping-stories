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
import { CreateGlossaryItemDef } from 'client/graphqlDefs';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from 'urql';
import backgrounds from 'styles/backgrounds.module.css';

const CreateGlossaryItemPage: NextPage = () => {
    const router = useRouter();
    const [_createEntryResult, createEntry] = useMutation(
        CreateGlossaryItemDef,
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

    const createForm = useFormik({
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
        },
        validationSchema: glossaryItemSchema,
        onSubmit: async (values, { resetForm }) => {
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
                const res = await createEntry({
                    item: values,
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

    return (
        <div className={backgrounds.colorBackground}>
            <Header />
            <Paper
                sx={{
                    backgroundColor: `var(--secondary-bg)`,
                    margin: '3rem',
                    padding: '1rem',
                }}
            >
                <form onSubmit={createForm.handleSubmit}>
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography component="h2">Item Details</Typography>
                            <Stack spacing={2}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="name"
                                    label="Item Name"
                                    formikForm={createForm}
                                    fieldName="name"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="category"
                                    label="Category"
                                    fieldName="category"
                                    formikForm={createForm}
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="subcategory"
                                    label="Subcategory"
                                    fieldName="subcategory"
                                    formikForm={createForm}
                                />
                                <TextAreaWithFormikValidation
                                    name="description"
                                    label="Description"
                                    placeholder="Description of the item"
                                    formikForm={createForm}
                                    fieldName="description"
                                />
                                <TextAreaWithFormikValidation
                                    name="origin"
                                    fieldName="origin"
                                    label="Origin"
                                    placeholder="Origin of the item"
                                    formikForm={createForm}
                                />
                                <TextAreaWithFormikValidation
                                    name="use"
                                    fieldName="use"
                                    label="Use"
                                    placeholder="explain the use of the item"
                                    formikForm={createForm}
                                />
                                <TextAreaWithFormikValidation
                                    name="culturalContext"
                                    fieldName="culturalContext"
                                    label="Cultural Context"
                                    placeholder="explain the cultural context"
                                    formikForm={createForm}
                                />
                                <TextAreaWithFormikValidation
                                    name="citations"
                                    fieldName="citations"
                                    label="Citations"
                                    placeholder="Any relevant citations"
                                    formikForm={createForm}
                                />
                                <TextAreaWithFormikValidation
                                    name="qualifiers"
                                    label="Qualifiers"
                                    fieldName="qualifiers"
                                    formikForm={createForm}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <GlossaryItemForm
                                formikForm={createForm}
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
        </div>
    );
};

export default CreateGlossaryItemPage;
