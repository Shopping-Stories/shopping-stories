import { ApolloServer } from 'apollo-server-micro';
import { GraphQLJSONObject } from 'graphql-type-json';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import AdminResolver from '../admin/admin.resolver';
import CatResolver from '../cat/cat.resolver';
import EntryResolver from '../entry/entry.resolver';
import HelloResolver from '../hello.resolver';
import { JWTAuthChecker } from '../middleware/auth.middleware';
import { DocToObject } from '../middleware/misc.middleware';
import { UserResolver } from '../user/user.resolver';

const getGraphQLServer = async () => {
	const schema = await buildSchema({
		resolvers: [
			HelloResolver,
			CatResolver,
			EntryResolver,
			UserResolver,
			AdminResolver,
		],
		scalarsMap: [{ type: Object, scalar: GraphQLJSONObject }],
		emitSchemaFile: {
			path: './server/schema.gql',
			commentDescriptions: true,
			sortedSchema: false,
		},
		authChecker: JWTAuthChecker,
		globalMiddlewares: [DocToObject],
	});
	return new ApolloServer({
		schema,
	});
};

export default getGraphQLServer;
