import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import * as path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import CatResolver from '../../server/cat/cat.resolver';
import EntryResolver from '../../server/entry/entry.resolver';
import HelloResolver from '../../server/resolvers/hello';
import { UserResolver } from '../../server/user/user.resolver';

export interface MyContext {
	req: NextApiRequest;
	res: NextApiResponse;
}

let apolloServerHandler: (req: any, res: any) => Promise<void>;

const getApolloServerHandler = async () => {
	if (!apolloServerHandler) {
		const schema = await buildSchema({
			resolvers: [HelloResolver, CatResolver, EntryResolver, UserResolver],
			emitSchemaFile: {
				path: './server/schema.gql',
				commentDescriptions: true,
				sortedSchema: false,
			},
		});
		let apolloServer = new ApolloServer({
			schema,
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
			context: ({ req, res }) => ({ req, res }),
		});
		await apolloServer.start();
		apolloServerHandler = apolloServer.createHandler({
			path: '/api/graphql',
		});
	}
	return apolloServerHandler;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://studio.apollographql.com',
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers',
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD',
	);
	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}
	const apolloServerHandler = await getApolloServerHandler();
	return apolloServerHandler(req, res);
};

export const config: PageConfig = { api: { bodyParser: false } };
