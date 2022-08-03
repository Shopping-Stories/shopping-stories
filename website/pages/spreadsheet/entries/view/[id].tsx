import ParsedEntryUpdateForm from '@components/ParsedEntryUpdateForm';
import LoadingPage from '@components/LoadingPage';
import useAuth from '@hooks/useAuth.hook';
import { entryInitialValues } from 'client/formikSchemas';
import { ParsedEntryFields } from 'client/graphqlDefs';
import { ParsedEntry } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { merge } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { Roles } from 'config/constants.config';

const findEntryDef = `
query parsedEntryQuery($id: String!, $populate: Boolean!) {
  entry: findParsedEntry(id: $id) {
  	...entryFields
  }
}
${ParsedEntryFields}
`;

const ViewEntryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    useAuth('/', [Roles.Admin]);
    interface FetchEntry {
        entry: ParsedEntry & { id: string };
    }

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [initialValues, setInitialValues] = useState<ParsedEntry | null>(
        null,
    );

    const [findParsedEntryResult, _findParsedEntry] = useQuery<FetchEntry>({
        query: findEntryDef,
        variables: { id, populate: false },
        requestPolicy: 'cache-and-network',
    });
    const entry = findParsedEntryResult?.data?.entry;

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

    if (findParsedEntryResult.stale || findParsedEntryResult.fetching) {
        return <LoadingPage />;
    } else if (
        findParsedEntryResult.error ||
        findParsedEntryResult.data?.entry === null
    ) {
        console.error(findParsedEntryResult.error);
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
                        disabled
                    />
                ) : null}
            </div>
        );
    }
};

export default ViewEntryPage;
