import { S3ProviderListOutput } from '@aws-amplify/storage';
import { Auth } from 'aws-amplify';
import { CognitoConfig } from 'config/constants.config';
import { NextRouter } from 'next/router';

// Filter to remove the property __typename from an object
export const omitTypename = (key: string, value: any) =>
    key === '__typename' ? undefined : value;

// Filters out any properties with the key __typename
// from the object
export const cloneWithoutTypename = (obj: any) =>
    JSON.parse(JSON.stringify(obj), omitTypename);

/**
 * Takes a promise and resolves it returning
 * a tuple with the resolved promise
 * or and error
 *
 * This function can be used to help
 * prevent try catch hell
 * @param promise
 * @returns
 */
export const handlePromise = async <T>(
    promise: Promise<T>,
): Promise<[T | null, Error | null]> => {
    try {
        return [await promise, null];
    } catch (err: any) {
        return [null, err];
    }
};

/**
 * Takes the list resulting from listing files in an S3 bucket
 * and processes them into files and folders.
 *
 * This code was found in the Amplify documentation here:
 * https://docs.amplify.aws/lib/storage/list/q/platform/js/#public-level-list
 * @param result List from the Amplify's Storage.list method
 * @returns
 */
export const processStorageList = (result: S3ProviderListOutput) => {
    let files: any[] = [];
    let folders = new Set<any>();
    result.forEach((res) => {
        if (res.size) {
            files.push(res);
            // sometimes files declare a folder with a / within then
            let possibleFolder = res.key!.split('/').slice(0, -1).join('/');
            if (possibleFolder) folders.add(possibleFolder);
        } else {
            folders.add(res.key);
        }
    });
    return { files, folders };
};

/**
 * Settings used for S3 and cognito
 */

export const S3Options: any = {
    AWSS3: {
        bucket: CognitoConfig.Bucket, //REQUIRED -  Amazon S3 bucket
        region: CognitoConfig.Region, //OPTIONAL -  Amazon service region
    },
};

export const AmplifyOptions: any = {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: CognitoConfig.IdentityPoolId,

    // REQUIRED - Amazon Cognito Region
    region: CognitoConfig.Region,

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: CognitoConfig.Region,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: CognitoConfig.UserPoolId,
    userPoolWebClientId: CognitoConfig.ClientId,
    accessKeyId: CognitoConfig.accessKeyId,
    secretAccessKey: CognitoConfig.secretAccessKey

    // cookieStorage: {
    // 	// REQUIRED - Cookie domain (only required if cookieStorage is provided)
    // 	domain: 'localhost',
    // 	// OPTIONAL - Cookie path
    // 	path: '/',
    // 	// OPTIONAL - Cookie expiration in days
    // 	expires: 365,
    // 	// OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    // 	sameSite: 'lax',
    // 	// OPTIONAL - Cookie secure flag
    // 	// Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    // 	secure: false,
    // },
};

/**
 * Sign user out of application
 * @param router Router to redirect after sign out
 */
export const signOut = (router: NextRouter) => {
    Auth.signOut()
        .then(() => (window.location = router.asPath as any))
        .catch(() => (window.location = router.asPath as any));
};

/**
 * This code was found in one of the comments here
 * https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
 *
 * Flattens a nested object
 * @param data
 * @returns flattened object
 */
export const flatten = (data: any) => {
    var result: any = {};
    function recurse(cur: any, prop: any) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + '[' + i + ']');
            if (l == 0) result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + '.' + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
    recurse(data, '');
    return result;
};

export const unflatten = (data: any) => {
    'use strict';
    if (Object(data) !== data || Array.isArray(data)) return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder: any = {};
    for (var p in data) {
        var cur = resultholder,
            prop = '',
            m;
        while ((m = regex.exec(p))) {
            cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[''] || resultholder;
};
