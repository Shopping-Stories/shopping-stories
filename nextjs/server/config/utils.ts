import graphqlFields from 'graphql-fields';
import pino from 'pino';
export const logger = pino();

export function getMongooseFromFields(info: any, fieldPath = null) {
	const selections = graphqlFields(info);
	const mongooseSelection = Object.keys(
		fieldPath ? selections[fieldPath] : selections,
	).reduce((a, b) => ({ ...a, [b]: 1 }), {});
	return mongooseSelection;
}

export function filterObject(obj: Object, callback: any) {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, val]) => callback(val, key)),
	);
};