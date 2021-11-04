import { entryFields } from 'client/graphqlDefs';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import * as yup from 'yup';

const findEntryDef = `
query entryQuery($id: String!) {
  findEntry(id: $id) {
  	...entryFields
  }
}
${entryFields}
`;

const updateEntryDef = `
mutation updateEntry($id: String!, $updates: UpdateEntryInput!) {
  updateEntry(id: $id, updatedFields: $updates) {
    ...entryFields
  }
}
${entryFields}
`;

const updateEntrySchema = yup.object({
    item: yup.string(),
    category: yup.string(),
    subcategory: yup.string(),
});

const UpdateEntryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const [findEntryResult, _findEntry] = useQuery({
        query: findEntryDef,
        variables: { id },
    });
    const entry = findEntryResult?.data?.findEntry;
    const [_updatePlaceResult, updatePlace] = useMutation(updateEntryDef);
    const updateForm = useFormik({
        initialValues: {
            id: '',
            location: '',
            alias: '',
            descriptor: '',
        },
        validationSchema: updateEntrySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await updatePlace({
                id: values.id,
                updates: {
                    location: values.location,
                    alias: values.alias,
                    descriptor: values.descriptor,
                },
            });
            if (res.error) {
            } else {
                resetForm();
            }
        },
    });

    if (updateForm.values.id) {
        console.log("");
    }

    if (findEntryResult.fetching) {
        return <div>Fetching {router.query.id}</div>;
    } else if (findEntryResult.error) {
        console.log(findEntryResult.error);
        return <>error</>;
    } else {
        return <div>{entry.id} yay</div>;
    }
};

export default UpdateEntryPage;
