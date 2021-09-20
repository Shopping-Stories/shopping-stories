export const __prod__ = process.env.NODE_ENV === 'production';

export const CognitoConfig = {
	UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
	ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
	Region: process.env.NEXT_PUBLIC_COGNITO_REGION as string,
	IdentityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID as string,
	Domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN as string,
	ClientID2: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID_2 as string,
	clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET as string,
};
