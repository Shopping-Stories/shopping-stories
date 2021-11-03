import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import { JWTAuthChecker } from '../middleware/auth.middleware';
import { DocToObject } from '../middleware/misc.middleware';
import CatResolver from './cat.resolver';
import CatService from './cat.service';
import { GraphQLJSONObject } from 'graphql-type-json';

jest.mock('./cat.service');

jest.mock('../middleware/auth.middleware', () => {
    const originalModule = jest.requireActual('../middleware/auth.middleware');
    return {
        __esModule: true,
        ...originalModule,
        JWTAuthChecker: jest.fn(async () => true),
    };
});

jest.mock('../middleware/misc.middleware', () => {
    const originalModule = jest.requireActual('../middleware/misc.middleware');
    return {
        __esModule: true,
        ...originalModule,
        ConnectDB: async (_: any, next: any) => {
            return next();
        },
    };
});

describe('Cat.Resolver', () => {
    it('Mutation.findCats', async () => {
        (CatService.findAll as any) = jest.fn(async () => {
            return Promise.resolve([
                {
                    _id: '123',
                    name: 'Meow',
                },
            ]);
        });

        let server: ApolloServer;

        const schema = await buildSchema({
            resolvers: [CatResolver],
            scalarsMap: [{ type: Object, scalar: GraphQLJSONObject }],
            authChecker: JWTAuthChecker,
            globalMiddlewares: [DocToObject],
        });
        server = new ApolloServer({
            schema,
        });

        let res = await server.executeOperation({
            query: gql`
                {
                    findCatsAuth {
                        id
                        name
                    }
                }
            `,
        });

        expect((res as any).data.findCatsAuth[0].name).toEqual('Meow');
        expect((res as any).data.findCatsAuth.length).toEqual(1);
        expect(JWTAuthChecker).toBeCalledTimes(1);
        expect(CatService.findAll).toBeCalledTimes(1);
    });
});
