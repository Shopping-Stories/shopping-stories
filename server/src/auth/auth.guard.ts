import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthConfig } from './auth.config';
import * as jwt from 'jsonwebtoken';
import { JWK } from 'jwk-to-pem';
import { promisify } from 'util';
import * as Axios from 'axios';

export class TokenHeader {
	kid: string;
	alg: string;
}

export class PublicKey {
	alg: string;
	e: string;
	kid: string;
	kty: string;
	n: string;
	use: string;
}

export class PublicKeyMeta {
	instance: PublicKey;
	pem: string;
}

export class PublicKeys {
	keys: PublicKey[];
}

export class MapOfKidToPublicKey {
	[key: string]: PublicKeyMeta;
}

export class Claim {
	token_use: string;
	auth_time: number;
	iss: string;
	exp: number;
	username: string;
	client_id: string;
}

export const cognitoIssuer = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;

export const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
	let cacheKeys: MapOfKidToPublicKey | undefined;
	if (!cacheKeys) {
		// download public keys from Amazon
		const url = `${cognitoIssuer}/.well-known/jwks.json`;
		const publicKeys = await Axios.default.get<PublicKeys>(url);

		// create a map of each key's kid to their public key
		cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
			const jwkToPem = require('jwk-to-pem');
			const pem = jwkToPem(current as JWK);
			agg[current.kid] = { instance: current, pem };
			return agg;
		}, {} as MapOfKidToPublicKey);
		return cacheKeys;
	} else {
		return cacheKeys;
	}
};

@Injectable()
export class MyJWTAuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		let req = ctx.getContext().req;

		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (token == null) return false;

		let result: any;
		try {
			console.log(`user claim verify invoked for ${JSON.stringify(token)}`);

			const tokenSections = (token || '').split('.');
			if (tokenSections.length < 2) {
				throw new Error('requested token is invalid');
			}

			//
			const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
				'utf8',
			);
			const header = JSON.parse(headerJSON) as TokenHeader;

			const keys = await getPublicKeys();
			const key = keys[header.kid];
			if (key === undefined) {
				throw new Error('claim made for unknown kid');
			}

			result = await jwt.verify(token, key.pem);
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
			console.log(JSON.stringify(result, undefined, 4));
			console.log(`claim confirmed for ${claim.username}`);
			return true;
		} catch (error) {
			// result = { userName: '', clientId: '', error, isValid: false };
			console.error(error);
			throw new UnauthorizedException('invalid token');
			return false;
		}
	}
}
