import { BadRequestException } from '@nestjs/common';
import {
	Resolver,
	Query,
	Args,
	Mutation,
	Context,
	GraphQLExecutionContext,
} from '@nestjs/graphql';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from './auth.service';
import { AccessToken, LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { __prod__ } from 'src/util/constants';
import { Claim, cognitoIssuer, getPublicKeys, TokenHeader } from './auth.guard';
import jwt from 'jsonwebtoken';

interface GraphQLContextWithReqRes extends GraphQLExecutionContext {
	req: Request;
	res: Response;
}
@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation((returns) => String, { nullable: true })
	async register(
		@Args('registerDto')
		registerDto: RegisterDto,
	) {
		console.log(await this.authService.registerUser(registerDto));
		return null;
	}

	@Query((returns) => AccessToken, { nullable: true })
	async login(
		@Args('loginDto') loginDto: LoginDto,
		@Context() ctx: GraphQLContextWithReqRes,
	) {
		try {
			let userSession: CognitoUserSession = await this.authService.loginUser(
				loginDto,
			);
			ctx.res.cookie('refresh', userSession.getRefreshToken().getToken(), {
				maxAge: 1000 * 60 * 60 * 24 * 7,
				httpOnly: true,
				sameSite: 'lax' as const,
				secure: __prod__,
			});
			return { accessToken: userSession.getAccessToken().getJwtToken() };
		} catch (err) {
			throw new BadRequestException(err.message);
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
