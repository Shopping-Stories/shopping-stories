import { makeOperation } from '@urql/core';
import { Auth } from 'aws-amplify';
import { GlossaryItem } from './types';
import { handlePromise } from './util';

export const addAuthToOperation = ({ authState, operation }: any) => {
    if (!authState || !authState.token) {
        return operation;
    }

    const fetchOptions =
        typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

    return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
            ...fetchOptions,
            headers: {
                ...fetchOptions.headers,
                Authorization: `Bearer ${authState.token}`,
            },
        },
    });
};

export const didAuthError = ({ error }: any) => {
    return error.graphQLErrors.some(
        (e: any) => e.extensions?.code === 'FORBIDDEN',
    );
};

// initial load, fetch from storage and
// triggered after an auth error has occurred
export const getAuth = async ({ authState }: any) => {
    const [session, err] = await handlePromise(Auth.currentSession());
    if (!err && session) {
        const token = session.getAccessToken().getJwtToken();
        return { token };
    }

    if (!authState) {
        return null;
    }

    // This is where auth has gone wrong and we need to clean up.
    // Also, you could redirect to a login page
    Auth.signOut();
    return null;
};

export interface GlossaryItemQueryResult {
    item: GlossaryItem;
}
