import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import GlossaryImageFormBody from './GlossaryImageFormBody';

interface ImageFormProps {
    formikForm: any;
    handleImage: (file: File) => void;
    removeImage: (imageKey: string) => void;
}

const GlossaryItemForm = (props: ImageFormProps) => {
    const { formikForm, handleImage, removeImage } = props;

    return (
        <FormikProvider value={formikForm}>

            <FieldArray
                name="images"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values.images;

                    return (
                        <Stack spacing={2}>
                            <Typography component="h2">Images</Typography>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => (
                                      <GlossaryImageFormBody
                                      key={index}
                                      formikForm={formikForm}
                                      arrayHelpers={arrayHelpers}
                                      index={index}
                                      handleImage={handleImage}
                                      removeImage={removeImage}
                                      />
                                  ))
                                : null}
                            <Button
                                variant="contained"
                                type="button"
                                onClick={() =>
                                    arrayHelpers.push({
                                        thumbnailImage: '',
                                        name: '',
                                        material: '',
                                        width: 300,
                                        height: 300,
                                        date: '',
                                        caption: '',
                                        collectionCitation: '',
                                        url: '',
                                        license: '',
                                    })
                                }
                            >
                                Add <Add/>
                            </Button>
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default GlossaryItemForm;
