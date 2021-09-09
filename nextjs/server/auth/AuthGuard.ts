import * as Axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { JWK } from 'jwk-to-pem';
import {
	MiddlewareFn,
	MiddlewareInterface,
	NextFn,
	ResolverData,
} from 'type-graphql';
import { MyContext } from '../../pages/api/graphql';
import dbConnect from '../config/dbConnect';
import { logger } from '../config/logger';

export const AuthGuard: MiddlewareFn<MyContext> = async ({ context }, next) => {
	if (!context.req.headers) {
		throw new Error('Not Authorized!');
	}
	console.log(context.req.headers);
	return next();
};

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
	const start = Date.now();
	await next();
	const resolveTime = Date.now() - start;
	logger.info(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};

export class TokenHeader {
	kid!: string;
	alg!: string;
}

export class PublicKey {
	alg!: string;
	e!: string;
	kid!: string;
	kty!: string;
	n!: string;
	use!: string;
}

export class PublicKeyMeta {
	instance!: PublicKey;
	pem!: string;
}

export class PublicKeys {
	keys!: PublicKey[];
}

export class MapOfKidToPublicKey {
	[key: string]: PublicKeyMeta;
}

export class Claim {
	token_use!: string;
	auth_time!: number;
	iss!: string;
	exp!: number;
	username!: string;
	client_id!: string;
}

export const cognitoIssuer = `https://cognito-idp.${CognitoConfig.Region}.amazonaws.com/${CognitoConfig.UserPoolId}`;

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

export const Auth: MiddlewareFn<MyContext> = async ({ context }, next) => {
	let req = context.req;

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		throw new Error('No Access Token Detected');
	}

	let result: any;
	try {
		logger.info(`user claim verify invoked for ${JSON.stringify(token)}`);

		const tokenSections = (token || '').split('.');
		if (tokenSections.length < 2) {
			throw new Error('requested token is invalid');
		}

		const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
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
		// console.log(JSON.stringify(result, undefined, 4));
		logger.info(`claim confirmed for ${claim.username}`);
		(req as any).user = result;
		return next();
	} catch (error: any) {
		// result = { userName: '', clientId: '', error, isValid: false };
		logger.error(error);
		throw new Error('Unauthorized: invalid token');
	}
};

export const ConnectDB: MiddlewareFn<MyContext> = async (_, next) => {
	await dbConnect();
	return next();
};

export class ConnectDB2 implements MiddlewareInterface<MyContext> {
	async use({ context, info }: ResolverData<MyContext>, next: NextFn) {
		await dbConnect();
		return next();
	}
}

import { Model, Document } from 'mongoose';
import { getClassForDocument } from '@typegoose/typegoose';
import { CognitoConfig } from '../config/constants.config';

export const DocToObject: MiddlewareFn = async (_, next) => {
	const result = await next();

	if (Array.isArray(result)) {
		return result.map((item) =>
			item instanceof Model ? convertDocument(item) : item,
		);
	}

	if (result instanceof Model) {
		return convertDocument(result);
	}

	return result;
};

function convertDocument(doc: Document) {
	const convertedDocument = doc.toObject();
	const DocumentClass = getClassForDocument(doc)!;
	Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
	return convertedDocument;
}
