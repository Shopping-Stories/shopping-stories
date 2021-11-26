import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../styles/createEmotionCache';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import { Auth, Storage } from 'aws-amplify';
import type { AppProps } from 'next/app';
import { Client, dedupExchange, fetchExchange, Provider } from 'urql';
import { AmplifyOptions, S3Options } from '../client/util';
import '../styles/globals.css';
import { createTheme, PaletteMode, useMediaQuery } from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDesignTokens } from 'styles/theme';
import {
    addAuthToOperation,
    didAuthError,
    getAuth,
} from '../client/urqlConfig';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const cache = cacheExchange({
    keys: {
        AccHolderObject: () => null,
        MetaObject: () => null,
        DateObject: () => null,
        RegularEntryObject: () => null,
        TobaccoMarkObject: () => null,
        TobaccoEntryObject: () => null,
        TobaccoMoneyObject: () => null,
        PeoplePlacesObject: () => null,
        MoneyObject: () => null,
        PoundsShillingsPence: () => null,
        ItemEntryObject: () => null,
        ItemsOrServicesObject: () => null,
        MentionedItemsObject: () => null,
        NoteObject: () => null,
        ImageObject: () => null,
        PurchaseObject: () => null,
    },
    updates: {
        Mutation: {
            deleteDocument(_result, args, cache, _info) {
                cache.invalidate({
                    __typename: 'DocumentInfo',
                    id: args.id as string,
                });
            },
        },
    },
});

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

Auth.configure(AmplifyOptions);

Storage.configure(S3Options);

const ColorModeContext = createContext<{
    toggleColorMode: () => void;
    mode: PaletteMode;
}>({
    toggleColorMode: () => undefined,
    mode: 'light',
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
            mode: mode,
        }),
        [mode],
    );

    // Update the theme only if the mode changes
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Shopping Stories</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
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
