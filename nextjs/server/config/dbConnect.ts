import mongoose from 'mongoose';
import { __prod__, __test__ } from './constants.config';
import { logger } from './logger';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!__test__ && !MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local',
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: any = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(uri?: string) {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: false,
			bufferMaxEntries: 0,
			useFindAndModify: false,
			useCreateIndex: true,
		};
		cached.promise = mongoose
			.connect(uri ? uri : MONGODB_URI, opts)
			.then((mongoose) => {
				logger.info(`Database successfully connected`);
				if (!__prod__) {
					logger.info(`Connection URI: ${uri ? uri : MONGODB_URI}`);
				}
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export const dbClose = async () => {
	let cached = (global as any).mongoose;

	if (!cached) {
		return await cached.conn.close();
	}
};

export default dbConnect;
