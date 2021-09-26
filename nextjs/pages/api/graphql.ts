import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { JWTAuthChecker } from '../../server/middleware/auth.middleware';
import CatResolver from '../../server/cat/cat.resolver';
import EntryResolver from '../../server/entry/entry.resolver';
import HelloResolver from '../../server/hello.resolver';
import { UserResolver } from '../../server/user/user.resolver';
import { DocToObject } from '../../server/middleware/misc.middleware';
import AdminResolver from '../../server/admin/admin.resolver';
import { GraphQLJSONObject } from 'graphql-type-json';

export interface MyContext {
	req: NextApiRequest;
	res: NextApiResponse;
}

let apolloServerHandler: (req: any, res: any) => Promise<void>;

const getApolloServerHandler = async () => {
	if (!apolloServerHandler) {
		const schema = await buildSchema({
			resolvers: [
				HelloResolver,
				CatResolver,
				EntryResolver,
				UserResolver,
				AdminResolver,
			],
			scalarsMap: [{ type: Object, scalar: GraphQLJSONObject }],
			// emitSchemaFile: {
				// path: './server/schema.gql',
				// commentDescriptions: true,
				// sortedSchema: false,
			// },
			authChecker: JWTAuthChecker,
			globalMiddlewares: [DocToObject],
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

export default async function handleGraphQLServer(
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<Boolean | void> {
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
}

export const config: PageConfig = { api: { bodyParser: false } };
