import { CognitoUser } from '@aws-amplify/auth';
import Amplify, { Auth } from 'aws-amplify';
import { useState } from 'react';
import { CognitoConfig } from '../server/config/env.config';

Amplify.configure({
	Auth: {
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
	},

	//  // OPTIONAL - Hosted UI configuration
	// oauth: {
	//     domain: 'your_cognito_domain',
	//     scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
	//     redirectSignIn: 'http://localhost:3000/',
	//     redirectSignOut: 'http://localhost:3000/',
	//     responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
	// }
});

// You can get the current config object
const currentConfig = Auth.configure();

const Congito3 = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const onSubmit = async (event: any) => {
		event.preventDefault();
		try {
			const user = await Auth.signIn(username, password);
			(user as CognitoUser).getSession((err: any, session: any) => {
				console.log(session.getAccessToken().getJwtToken());
			});
		} catch (error) {
			console.log('error signing in', error);
		}
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<label htmlFor="email">Username</label>
				<input
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				></input>
				<label htmlFor="password">Password</label>
				<input
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				></input>

				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Congito3;
