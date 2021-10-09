import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import Amplify, { Auth, Storage } from 'aws-amplify';
import type { AppProps } from 'next/app';
import {
	Client,
	dedupExchange,
	fetchExchange,
	makeOperation,
	Provider,
} from 'urql';
import { handlePromise } from '../client/components/util';
import { CognitoConfig } from '../server/config/constants.config';
import '../styles/globals.css';

const cache = cacheExchange({});

const addAuthToOperation = ({ authState, operation }: any) => {
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

const didAuthError = ({ error }: any) => {
	return error.graphQLErrors.some(
		(e: any) => e.extensions?.code === 'FORBIDDEN',
	);
};

const getAuth = async ({ authState }: any) => {
	if (!authState) {
		const [session, err] = await handlePromise(Auth.currentSession());
		if (!err) {
			const token = session!.getAccessToken().getJwtToken();
			return { token };
		}
		return null;
	}
	return null;
};

const client = new Client({
	url: '/api/graphql',
	exchanges: [
		dedupExchange,
		cache,
		authExchange({
			/* config */
			getAuth: getAuth,
			addAuthToOperation: addAuthToOperation,
			didAuthError: didAuthError,
		}),
		fetchExchange,
	],
});
Auth.configure({
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

	// REQUIRED - Cookie domain (only required if cookieStorage is provided)
	domain: 'localhost:3000',
	// OPTIONAL - Cookie path
	path: '/',
	// OPTIONAL - Cookie expiration in days
	expires: 365,
	// OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
	sameSite: 'lax',
	// OPTIONAL - Cookie secure flag
	// Either true or false, indicating if the cookie transmission requires a secure protocol (https).
	secure: true,
});

Storage.configure({
	AWSS3: {
		bucket: CognitoConfig.Bucket, //REQUIRED -  Amazon S3 bucket
		region: CognitoConfig.Region, //OPTIONAL -  Amazon service region
	},
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<Provider value={client}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default App;
