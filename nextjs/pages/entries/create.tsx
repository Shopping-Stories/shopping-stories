import { entryFields } from 'client/graphqlDefs';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useMutation } from 'urql';
import * as yup from 'yup';

const createEntryDef = `
mutation createEntry($entry: CreateEntryInput!) {
  createEntry(createEntryInput: $entry) {
    ...entryFields
  }
}
${entryFields}
`;

const createEntrySchema = yup.object({
    location: yup.string().required('Location is required'),
    alias: yup.string().typeError('Alias must be a string').strict(true),
    descriptor: yup
        .string()
        .typeError('Descriptor must be a string')
        .strict(true),
});

const CreateEntryPage: NextPage = () => {
    const [_createEntryResult, createEntry] = useMutation(createEntryDef);
    const createForm = useFormik({
        initialValues: {
            location: '',
            alias: '',
            descriptor: '',
        },
        validationSchema: createEntrySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createEntry({
                place: values,
            });
            if (res.error) {
            } else {
                resetForm();
            }
        },
    });

    console.log(createForm);

    return <div>hello</div>;
};

export default CreateEntryPage;
