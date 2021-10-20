import { CognitoConfig } from 'config/constants.config';

export const handlePromise = async <T>(
	promise: Promise<T>,
): Promise<[T | null, Error | null]> => {
	try {
		return [await promise, null];
	} catch (err: any) {
		return [null, err];
	}
};

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
