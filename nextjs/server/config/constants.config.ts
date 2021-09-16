export const __prod__ = process.env.NODE_ENV === 'production';

export class CognitoConfig {
	public static readonly UserPoolId = process.env
		.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string;
	public static readonly ClientId = process.env
		.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;
	public static readonly Region = process.env
		.NEXT_PUBLIC_COGNITO_REGION as string;
	public static readonly IdentityPoolId = process.env
		.NEXT_PUBLIC_IDENTITY_POOL_ID as string;
	public static readonly Domain = process.env
		.NEXT_PUBLIC_COGNITO_DOMAIN as string;
	public static readonly ClientID2 = process.env
		.NEXT_PUBLIC_COGNITO_CLIENT_ID_2 as string;
	public static readonly clientSecret = process.env
		.NEXT_PUBLIC_COGNITO_CLIENT_SECRET as string;
}
