import { Remove } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import { Storage } from 'aws-amplify';
import { handlePromise } from 'client/util';
import { isArray } from 'lodash';
import { useEffect, useState } from 'react';
import FileInput from './FileInput';
import TextAreaWithFormikValidation from './TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface GlossaryImageFormBody {
    index: number;
    arrayHelpers: any;
    formikForm: any;
    handleImage: (file: File) => void;
    removeImage: (fileKey: string) => void;
}

const GlossaryImageFormBody = (props: GlossaryImageFormBody) => {
    const { index, formikForm, arrayHelpers } = props;
    const prefix = 'images';
    const fieldNames = {
        name: `${prefix}[${index}].name`,
        imageKey: `${prefix}[${index}].imageKey`,
        material: `${prefix}[${index}].material`,
        dimensions: `${prefix}[${index}].dimensions`,
        date: `${prefix}[${index}].date`,
        caption: `${prefix}[${index}].caption`,
        collectionCitation: `${prefix}[${index}].collectionCitation`,
        url: `${prefix}[${index}].url`,
        license: `${prefix}[${index}].license`,
    };

    const [image, setImage] = useState<string | null>(null);

    const onImageChange = (input: { files: File | File[] }) => {
        if (!isArray(input.files)) {
            const prevImage: string = formikForm.values.images[index].imageKey;
            props.removeImage(prevImage);

            const image = input.files;

            const newImage = new File(
                [image],
                `${Date.now().toString()}-${input.files.name}`,
                { type: image.type },
            );

            props.handleImage(newImage);
            setImage(URL.createObjectURL(newImage));

            formikForm.setFieldValue(fieldNames.imageKey, newImage.name);
        }
    };

    useEffect(() => {
        const getImage = async () => {
            if (formikForm.values.images[index].imageKey) {
                const key = formikForm.values.images[index].imageKey;
                if (key) {
                    try {
                        const S3image = await Storage.get(`images/${key}`);
                        const imageReq = new Request(S3image);
                        const [res, _imageNotFound] = await handlePromise(
                            fetch(imageReq),
                        );
                        if (res && res.status === 200) {
                            setImage(S3image);
                        }
                    } catch (error: any) {
                        console.error(error);
                    }
                }
            }
        };
        getImage();
    }, [formikForm.values.images[index].imageKey]);

    return (
        <Card>
            <CardHeader title={`Image ${index}`} />
            <CardContent>
                <Stack spacing={2}>
                    <TextFieldWithFormikValidation
                        fullWidth
                        label="Image Title"
                        name={fieldNames.name}
                        fieldName={fieldNames.name}
                        formikForm={formikForm}
                    />

                    <TextAreaWithFormikValidation
                        label="Caption"
                        name={fieldNames.caption}
                        fieldName={fieldNames.caption}
                        formikForm={formikForm}
                        placeholder="Caption relevant to the image"
                    />

                    <TextAreaWithFormikValidation
                        label="Collection Citation"
                        name={fieldNames.collectionCitation}
                        fieldName={fieldNames.collectionCitation}
                        formikForm={formikForm}
                    />

                    <TextAreaWithFormikValidation
                        label="Source URL"
                        name={fieldNames.url}
                        fieldName={fieldNames.url}
                        formikForm={formikForm}
                        placeholder="URL image was taken from (if applicable)"
                    />

                    <TextAreaWithFormikValidation
                        label="License"
                        name={fieldNames.license}
                        fieldName={fieldNames.license}
                        formikForm={formikForm}
                        placeholder="License information about the image"
                    />

                    <TextAreaWithFormikValidation
                        label="Material"
                        name={fieldNames.material}
                        fieldName={fieldNames.material}
                        formikForm={formikForm}
                        placeholder="Material information (if applicable)"
                    />

                    <TextAreaWithFormikValidation
                        label="Dimensions"
                        name={fieldNames.dimensions}
                        fieldName={fieldNames.dimensions}
                        formikForm={formikForm}
                        placeholder="Physical dimensions of the item"
                    />

                    <TextFieldWithFormikValidation
                        fullWidth
                        label="Date"
                        name={fieldNames.date}
                        fieldName={fieldNames.date}
                        formikForm={formikForm}
                    />

                    <FileInput
                        label="Image Upload"
                        accept="image/*"
                        onChange={onImageChange}
                        icon={true}
                    >
                        <>Upload</>
                        <UploadFileIcon />
                    </FileInput>

                    {image && (
                        <CardMedia
                            id={`image${index}`}
                            component="img"
                            image={image}
                        />
                    )}
                </Stack>
            </CardContent>
            <br />
            <CardActions>
                <Button
                    variant="contained"
                    type="button"
                    onClick={() => {
                        const prevImage: string =
                            formikForm.values.images[index].imageKey;
                        props.removeImage(prevImage);
                        arrayHelpers.remove(index);
                    }}
                >
                    Remove <Remove />
                </Button>
            </CardActions>
        </Card>
    );
};

export default GlossaryImageFormBody;
