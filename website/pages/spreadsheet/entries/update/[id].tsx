import ParsedEntryUpdateForm from '@components/ParsedEntryUpdateForm';
import LoadingPage from '@components/LoadingPage';
import useAuth from '@hooks/useAuth.hook';
import { entryInitialValues } from 'client/formikSchemas';
import { ParsedEntryFields } from 'client/graphqlDefs';
import { ParsedEntry } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { Roles } from 'config/constants.config';
import { merge } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';

const findParsedEntryDef = `
query parsedEntryQuery($id: String!, $populate: Boolean!) {
  entry: findParsedEntry(id: $id) {
  	...entryFields
  }
}
${ParsedEntryFields}
`;

const UpdateEntryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const { loading } = useAuth('/spreadsheet/entries', [Roles.Admin]);

    interface FetchEntry {
        entry: ParsedEntry & { id: string };
    }

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [initialValues, setInitialValues] = useState<ParsedEntry | null>(
        null,
    );

    const [findEntryResult, _findEntry] = useQuery<FetchEntry>({
        query: findParsedEntryDef,
        variables: { id, populate: false },
        requestPolicy: 'cache-and-network',
    });
    const entry = findEntryResult?.data?.entry;

    useEffect(() => {
        if (entry !== undefined && Boolean(entry)) {
            const { id: _, ...fields } = entry;
            const cleanedFields = cloneWithoutTypename(fields);
            const values = merge(entryInitialValues, cleanedFields);
            values.dateInfo.fullDate = values.dateInfo.fullDate
                ? values.dateInfo.fullDate.substring(0, 10)
                : new Date(100, 0, 1).toISOString().substring(0, 10);

            if (values.itemEntries) {
                setTabIndex(0);
            }
            if (values.tobaccoEntry) {
                setTabIndex(1);
            }
            if (values.regularEntry) {
                setTabIndex(2);
            }
            setInitialValues(values);
        }
    }, [entry]);

    if (findEntryResult.stale || loading) {
        return <LoadingPage />;
    } else if (findEntryResult.error || findEntryResult.data?.entry === null) {
        console.error(findEntryResult.error);
        router.replace('/404');
        return <>error</>;
    } else {
        return (
            <div>
                {initialValues !== null && typeof id === 'string' ? (
                    <ParsedEntryUpdateForm
                        id={id}
                        initialValues={initialValues}
                        tabIndex={tabIndex}
                    />
                ) : null}
            </div>
        );
    }
};

export default UpdateEntryPage;
