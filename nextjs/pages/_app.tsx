import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../styles/createEmotionCache';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import { Auth, Storage } from 'aws-amplify';
import type { AppProps } from 'next/app';
import {
	Client,
	dedupExchange,
	fetchExchange,
	makeOperation,
	Provider,
} from 'urql';
import { handlePromise } from '../client/util';
import { CognitoConfig } from '../config/constants.config';
import '../styles/globals.css';
import theme from '../styles/theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

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

// initial load, fetch from storage and
// triggered after an auth error has occurred
const getAuth = async ({ authState }: any) => {
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
});

Storage.configure({
	AWSS3: {
		bucket: CognitoConfig.Bucket, //REQUIRED -  Amazon S3 bucket
		region: CognitoConfig.Region, //OPTIONAL -  Amazon service region
	},
});

function App({
	Component,
	emotionCache = clientSideEmotionCache,
	pageProps: { session, ...pageProps },
}: AppProps & { emotionCache: any }) {
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>Shopping Stories</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<Provider value={client}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</Provider>
		</CacheProvider>
	);
}

export default App;
