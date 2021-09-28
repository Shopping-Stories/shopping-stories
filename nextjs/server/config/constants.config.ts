export const __prod__ = process.env.NODE_ENV === 'production';

export const __test__ = process.env.NODE_ENV === 'test';

export const __dev__ = process.env.NODE_ENV === 'development';

export const CognitoConfig = {
	UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
	ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
	Region: process.env.NEXT_PUBLIC_COGNITO_REGION as string,
	IdentityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID as string,
	Domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN as string,
};

if (!__test__) {
	let errorVars: string[] = [];
	if (!CognitoConfig.UserPoolId) {
		errorVars.push('NEXT_PUBLIC_COGNITO_USER_POOL_ID');
	}
	if (!CognitoConfig.ClientId) {
		errorVars.push('NEXT_PUBLIC_COGNITO_CLIENT_ID');
	}
	if (!CognitoConfig.Region) {
		errorVars.push('NEXT_PUBLIC_COGNITO_REGION');
	}
	if (!CognitoConfig.IdentityPoolId) {
		errorVars.push('NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID');
	}
	if (!CognitoConfig.Domain) {
		errorVars.push('NEXT_PUBLIC_COGNITO_DOMAIN');
	}
	if (errorVars.length > 0) {
		throw new Error(
			`Please define the ${errorVars.join(', ')} environment variable${
				errorVars.length > 1 ? 's' : ''
			} inside .env.local`,
		);
	}
}
