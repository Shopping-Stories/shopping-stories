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
// import theme from '../styles/theme';
import '../styles/amplifyTheme.css';
import { createTheme, PaletteMode, useMediaQuery } from '@mui/material';
// import { amber, deepOrange, grey } from '@mui/material/colors';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		// ...(mode === 'light'
		// 	? {
		// 			// palette values for light mode
		// 			primary: amber,
		// 			divider: amber[200],
		// 			text: {
		// 				primary: grey[900],
		// 				secondary: grey[800],
		// 			},
		// 	  }
		// 	: {
		// 			// palette values for dark mode
		// 			primary: deepOrange,
		// 			divider: deepOrange[700],
		// 			background: {
		// 				default: deepOrange[900],
		// 				paper: deepOrange[900],
		// 			},
		// 			text: {
		// 				primary: '#fff',
		// 				secondary: grey[500],
		// 			},
		// 	  }),
	},
});

const ColorModeContext = createContext<{ toggleColorMode: () => void }>({
	toggleColorMode: () => undefined,
});

export const useColorMode = () => {
	return useContext(ColorModeContext);
};

function App({
	Component,
	emotionCache = clientSideEmotionCache,
	pageProps: { session, ...pageProps },
}: AppProps & { emotionCache: any }) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const [mode, setMode] = useState<PaletteMode>(
		prefersDarkMode ? 'dark' : 'light',
	);

	useEffect(() => {
		// @ts-ignore
		setMode(document.querySelector(':root')!.dataset.theme);
	}, []);

	useEffect(() => {
		// @ts-ignore
		document.querySelector(':root')!.dataset.theme = mode;
		window.localStorage.setItem('mode', mode);
	}, [mode]);

	const colorMode = useMemo(
		() => ({
			// The dark mode switch would invoke this method
			toggleColorMode: () => {
				setMode((prevMode: PaletteMode) =>
					prevMode === 'light' ? 'dark' : 'light',
				);
			},
		}),
		[],
	);

	// Update the theme only if the mode changes
	const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>Shopping Stories</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<Provider value={client}>
				<ColorModeContext.Provider value={colorMode}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Component {...pageProps} />
					</ThemeProvider>
				</ColorModeContext.Provider>
			</Provider>
		</CacheProvider>
	);
}

export default App;
