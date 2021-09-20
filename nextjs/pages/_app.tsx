import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Auth } from 'aws-amplify/';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { CognitoConfig } from '../server/config/constants.config';

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

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return <Component {...pageProps} />;
}
export default withAuthenticator(App);
