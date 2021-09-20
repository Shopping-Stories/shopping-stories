import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import { CognitoConfig } from '../../../server/config/constants.config';
import { logger } from '../../../server/config/logger';
import * as jwt from 'jsonwebtoken';
import {
	Claim,
	cognitoIssuer,
	getPublicKeys,
	TokenHeader,
} from '../../../server/middleware/auth.middleware';

export default NextAuth({
	// Configure one or more authentication providers
	callbacks: {
		// jwt: async (token, user, account, profile, isNewUser) => {
		// 	const isSignIn = user ? true : false;
		// 	if (isSignIn) {
		// 		token.accessToken = account?.accessToken;

		// 		console.log("JWT:");
		// 		console.log(account);
		// 		console.log(profile);
		// 	}

		// 	return Promise.resolve(token);
		// },
		async jwt({ token, account, profile, user }) {
			// @ts-ignore
			const _isSignIn = !!user;

			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
				// token.id_token = account?.id_token;
				// token.refresh_token = account?.refresh_token;
				token.family_name = profile?.family_name;
				token.given_name = profile?.given_name;

				const tokenSections = (account.access_token || '').split('.');
				if (tokenSections.length < 2) {
					throw new Error('requested token is invalid');
				}

				const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
					'utf8',
				);
				const header = JSON.parse(headerJSON) as TokenHeader;

				const keys = await getPublicKeys();
				const key = keys[header.kid];
				if (key === undefined) {
					throw new Error('claim made for unknown kid');
				}

				let result: any = await jwt.verify(account.access_token || '', key.pem);
				const claim = result as Claim;
				const currentSeconds = Math.floor(new Date().valueOf() / 1000);
				if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
					throw new Error('claim is expired or invalid');
				}
				if (claim.iss !== cognitoIssuer) {
					throw new Error('claim issuer is invalid');
				}
				if (claim.token_use !== 'access') {
					throw new Error('claim use is not access');
				}
				// logger.info(JSON.stringify(result, undefined, 4));
				logger.info(`claim confirmed for ${claim.username}`);
				token.groups = result['cognito:groups'];
			}

			return Promise.resolve(token);
		},
		async session({ session, token }) {
			(session!.user as any)!.family_name = token.family_name;
			(session!.user as any)!.given_name = token.given_name;
			// token.groups
			return session;
		},
	},
	providers: [
		CognitoProvider({
			clientId: CognitoConfig.ClientID2,
			clientSecret: CognitoConfig.clientSecret,
			issuer: 'https://' + CognitoConfig.Domain + '/',
			// idToken: true,
			// @ts-ignore
			// profile(profile) {
			// 	return { ...profile } // Return the profile in a shape that is different from the built-in one.
			// },
		}),
		// ...add more providers here
	],
});
