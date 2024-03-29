import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import 'reflect-metadata';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { JWTAuthChecker } from '../../server/middleware/auth.middleware';
import CatResolver from '../../server/cat/cat.resolver';
import EntryResolver, {
    AccountHolderResolver,
    EntryMarkResolver,
    EntryPersonResolver,
    EntryPlaceResolver,
} from '../../server/entry/entry.resolver';
import ParsedEntryResolver, {
    ParsedAccountHolderResolver,
    ParsedEntryMarkResolver,
    ParsedEntryPersonResolver,
    ParsedEntryPlaceResolver,
} from '../../server/parsedEntry/parsedEntry.resolver';
import HelloResolver from '../../server/hello.resolver';
import { DocToObject } from '../../server/middleware/misc.middleware';
import AdminResolver from '../../server/admin/admin.resolver';
import { GraphQLJSONObject } from 'graphql-type-json';
import { __dev__ } from '../../config/constants.config';
import SpreadsheetResolver from '../../server/spreadsheet/spreadsheet.resolver';
import GlossaryItemResolver from '../../server/glossaryItem/glossaryItem.resolver';
import ItemResolver from 'server/item/item.resolver';
import PlaceResolver from 'server/place/place.resolver';
import PersonResolver from 'server/person/person.resolver';
import TobaccoMarkResolver from 'server/tobaccoMark/tobaccoMark.resolver';
import CategoryResolver from 'server/category/category.resolver';
import DocumentResolver from 'server/document/document.resolver';

export interface MyContext {
    req: NextApiRequest;
    res: NextApiResponse;
}

let apolloServerHandler: (req: any, res: any) => Promise<void>;

const getApolloServerHandler = async () => {
    if (!apolloServerHandler) {
        const buildSchemaOpts: BuildSchemaOptions = {
            resolvers: [
                HelloResolver,
                CatResolver,
                EntryResolver,
                DocumentResolver,
                AdminResolver,
                SpreadsheetResolver,
                GlossaryItemResolver,
                ItemResolver,
                PlaceResolver,
                PersonResolver,
                TobaccoMarkResolver,
                CategoryResolver,
                AccountHolderResolver,
                EntryPersonResolver,
                EntryPlaceResolver,
                EntryMarkResolver,
                ParsedEntryResolver,
                ParsedAccountHolderResolver,
                ParsedEntryMarkResolver,
                ParsedEntryPersonResolver,
                ParsedEntryPlaceResolver,
            ],
            scalarsMap: [{ type: Object, scalar: GraphQLJSONObject }],
            authChecker: JWTAuthChecker,
            globalMiddlewares: [DocToObject],
        };

        if (__dev__) {
            buildSchemaOpts.emitSchemaFile = {
                path: './server/schema.gql',
                commentDescriptions: true,
                sortedSchema: false,
            };
        }

        const schema = await buildSchema(buildSchemaOpts);
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
