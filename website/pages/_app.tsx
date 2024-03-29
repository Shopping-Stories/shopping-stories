import { CacheProvider } from '@emotion/react';
import { createTheme, PaletteMode, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import { Auth, Storage } from 'aws-amplify';
import { ColorModeContext } from 'client/ThemeMode';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { getDesignTokens } from 'styles/theme';
import { Client, dedupExchange, fetchExchange, Provider } from 'urql';
import {useTheme} from "@mui/material";
import EntryProvider from "@components/context/EntryContext";
import SearchProvider from "@components/context/SearchContext";
import GraphItemProvider from "@components/context/GraphItemContext";
import {
    addAuthToOperation,
    didAuthError,
    getAuth,
} from '../client/urqlConfig';
import { AmplifyOptions, S3Options } from '../client/util';
import createEmotionCache from '../styles/createEmotionCache';
import '../styles/globals.css';
import Layout from "@components/Layout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//TODO: remove all header imports in pages/components
// import Header from "@components/Header";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const cache = cacheExchange({
    keys: {
        // AccHolderObject: () => null,
        // MetaObject: () => null,
        // DateObject: () => null,
        // RegularEntryObject: () => null,
        // TobaccoMarkObject: () => null,
        // TobaccoEntryObject: () => null,
        // TobaccoMoneyObject: () => null,
        // PersonObject: () => null,
        // PlaceObject: () => null,
        // MoneyObject: () => null,
        // PoundsShillingsPence: () => null,
        // ItemEntryObject: () => null,
        // ItemOrServiceObject: () => null,
        // MentionedItemsObject: () => null,
        // NoteObject: () => null,
        // ImageObject: () => null,
        // PurchaseObject: () => null,
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
    
    const theme = useTheme()
    
    // Update the theme only if the mode changes
    const customTheme = useMemo(() => createTheme({
            ...theme,
            palette: getDesignTokens(mode)
        }
    ), [mode, theme]);
    // console.log(customTheme)
    
    const queryClient = new QueryClient();
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
                <QueryClientProvider client={queryClient}>
                    <ColorModeContext.Provider value={colorMode}>
                        <ThemeProvider theme={customTheme}>
                            <CssBaseline />
                            <EntryProvider>
                                <SearchProvider>
                                    <GraphItemProvider>
                                        <Layout>
                                            <Component {...pageProps} />
                                        </Layout>
                                    </GraphItemProvider>
                                </SearchProvider>
                            </EntryProvider>
                        </ThemeProvider>
                    </ColorModeContext.Provider>
                </QueryClientProvider>
            </Provider>
        </CacheProvider>
    );
}

export default App;
