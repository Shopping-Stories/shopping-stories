import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { UserService } from './user.service';
import { AccessToken, LoginInput } from './input/login.input';
import { RegisterInput } from './input/register.input';
import { __prod__ } from '../config/constants.config';
import { logger } from '@typegoose/typegoose/lib/logSettings';

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {
		this.userService = new UserService();
	}

	@Mutation((returns) => String, { nullable: true })
	async register(
		@Arg('registerInput')
		registerInput: RegisterInput,
	) {
		console.log(await this.userService.registerUser(registerInput));
		return null;
	}

	@Query((returns) => AccessToken, { nullable: true })
	async login(@Arg('loginInput') loginInput: LoginInput) {
		try {
			let userSession: CognitoUserSession = await this.userService.loginUser(
				loginInput,
			);
			return { accessToken: userSession.getAccessToken().getJwtToken() };
		} catch (err) {
			logger.error(err);
			throw new Error('Bad Request Exception');
		}
	}

	// @Query((returns) => Boolean)
	// async refreshToken(@Context() ctx: GraphQLContextWithReqRes) {
	// 	let req = ctx.req;

	// 	const authHeader = req.headers['authorization'];
	// 	const token = authHeader && authHeader.split(' ')[1];

	// 	if (token == null) return false;

	// 	let result: any;
	// 	try {
	// 		const tokenSections = (token || '').split('.');
	// 		if (tokenSections.length < 2) {
	// 			return false;
	// 		}

	// 		const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
	// 			'utf8',
	// 		);
	// 		const header = JSON.parse(headerJSON) as TokenHeader;

	// 		const keys = await getPublicKeys();
	// 		const key = keys[header.kid];
	// 		if (key === undefined) {
	// 			throw new Error('claim made for unknown kid');
	// 		}

	// 		result = await jwt.verify(token, key.pem);
	// 	} catch (error) {}

	// 	return this.authService.refreshTokens(req.cookies.refresh, result);
	// }
}
