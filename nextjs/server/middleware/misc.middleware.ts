import { getClassForDocument } from '@typegoose/typegoose';
import { Model, Document } from 'mongoose';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../../pages/api/graphql';
import dbConnect from '../config/dbConnect';
import { logger } from '../config/logger';

/**
 * This File is a collection of various middleware
 * that can be used with the graphql server for
 * various tasks
 */

/**
 * ResolveTime logs a rough estimate of the time taken
 * to process a request that doesn't throw an Error.
 * Both parameters get provided by apollo server
 * when is uses the middleware
 * @param {object} object.info
 * @param {function} next next function to be called
 */
export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
	const start = Date.now();
	await next();
	const resolveTime = Date.now() - start;
	logger.info(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};

/**
 * Middleware to convert MongoDB documents into JavaScript Objects
 * because GraphQL will error if a MongoDB document is returned
 * directly
 * @param {object} _ object with info about the resolver and request
 * but we don't use it in this function
 * @param {function} next next function to be called
 * @returns {object} JavaScript Object of converted MongoDB Doc
 */
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

/**
 * Converts a MongoDB Doc into a JavaScript Object using
 * the toObject method
 * @param { Document } doc
 * @returns { object } JavaScript Object of converted MongoDB Doc
 */
function convertDocument(doc: Document) {
	const convertedDocument = doc.toObject();
	const DocumentClass = getClassForDocument(doc)!;
	Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
	return convertedDocument;
}

/**
 * Middleware to connected to the database if the application
 * is not already connected
 * @param _ info about the request and resolver that we don't use
 * @param next next function to be called
 * @returns whatever the next function called returns
 */
export const ConnectDB: MiddlewareFn<MyContext> = async (_, next) => {
	await dbConnect();
	return next();
};
