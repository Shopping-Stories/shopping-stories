import mongoose from 'mongoose';
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
}

type MongoTextSearch = {} | { $text: { $search: string } };

export function getMongoTextSearchObject(search?: string): MongoTextSearch {
	return !search ? {} : { $text: { $search: search } };
}

export function optimizedMongoCount(
	model: mongoose.Model<any, {}, {}>,
	search?: string,
): Promise<number> {
	return !search
		? model.estimatedDocumentCount().exec()
		: model.countDocuments(getMongoTextSearchObject(search)).exec();
}
