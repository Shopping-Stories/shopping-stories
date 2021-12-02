---
sidebar_position: 1
---

# Layout and Quick Start

The basic layout for the backend files is `*.schema.*` files have the GraphQL Schema and MongoDB model for an object. For example, we have a basic cat endpoint that was made very early on when we where first learning GraphQL. The schema file for the Cat Object is the following

```ts
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type CatDocument = Cat & Document;

@ObjectType({ description: 'Cat Object' })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Cat {
    @Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    readonly _id?: ObjectId;

    @prop({ required: true })
    @Field({ description: 'Name of the Cat' })
    name?: string;

    @prop({ required: true })
    @Field({ description: 'Age of the Cat' })
    age?: number;

    @prop({ required: true })
    @Field({ description: 'Breed of the Cat' })
    breed?: string;
}

export const CatModel = mongoose.models.Cat || getModelForClass(Cat);
```

Here the `@prop` decorator defined a field for a Mongoose object and the `@Field` decorator determines the GraphQL object. If you have field you want to exclude from being returned from the API is simply don't have the `@Field` decorator above it.

I will not be explaining every line of code because the documentation and GraphQL links given on the [overview page](../intro/high-level-overview) do a fairly good job of that.

The build of the logic for all over our APIs are contained in the respective `.service.*` file. Using our cat example the logic for interacting with the database is contained in the `cat.service.ts` file and it's contents are the following.

```ts
import { Cat, CatModel } from './cat.schema';
import { CreateCatDto } from './input/create-cat.input';

export default class CatService {
    static async create(createCatDto: CreateCatDto): Promise<Cat> {
        const createdCat = new CatModel(createCatDto);
        return (await createdCat.save()).toObject();
    }

    static async findAll(selectedFields: Object): Promise<Cat[]> {
        return CatModel.find().select(selectedFields).lean<Cat[]>().exec();
    }

    static async findOne(
        id: string,
        selectedFields: Object,
    ): Promise<Cat | null> {
        return CatModel.findById(id).select(selectedFields).lean<Cat>().exec();
    }
}
```

Here you can see how we encapsulate our business logic in it's own file and class. This makes it easier to set up unit testing and cleanly splits our code into files.

The `.resolver.ts` files contain the GraphQL resolver which is the actual resolver that handles the requests made to the API and applies any middleware needed for the endpoint. I will not be explaining the middle ware syntax because the Typegraphql documentation does that.

```ts
import graphqlFields from 'graphql-fields';
import 'reflect-metadata';
import {
    Arg,
    Authorized,
    Info,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { Roles } from '../../config/constants.config';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Cat } from './cat.schema';
import CatService from './cat.service';
import { CreateCatDto } from './input/create-cat.input';

function getMongooseFromFields(info: any, fieldPath = null) {
    const selections = graphqlFields(info);
    const mongooseSelection = Object.keys(
        fieldPath ? selections[fieldPath] : selections,
    ).reduce((a, b) => ({ ...a, [b]: 1 }), {});
    return mongooseSelection;
}

@Resolver((_of) => Cat)
export default class CatResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => [Cat], { nullable: true })
    async findCatsAuth(
        @Info() info: any,
    ): Promise<Cat[]> {
        return CatService.findAll(getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => [Cat], { nullable: true })
    async findCats(@Info() info: any): Promise<Cat[]> {
        return CatService.findAll(getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Cat, { nullable: true })
    async findCat(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Cat | null> {
        return CatService.findOne(id, getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation((_returns) => Cat)
    async createCat(@Arg('newCat') newCat: CreateCatDto): Promise<Cat> {
        return CatService.create(newCat);
    }
}
```

This same layout strategy is used for all the API endpoints. This should make it fairly easy to navigate and understand the API.

The last thing I want to mention is GraphQL Playground. Once you have your local development environment set up you can run the server by running the `npm run dev` command in the `website` folder of the project. After the local server is running you can navigate to `localhost:3000/api/graphql/` and will be able to see this page.

![GraphQL Playground](/img/GraphQL-Playground.png)

The above image shows the GraphQL Playground page and show how you can write queries and provide and authorization JWT to make API request. This is similar to tools like Postman that allow you to make request to REST APIs but with GraphQL you get it built in and easy to use.

:::tip
If you need a JWT token for GraphQL Playground so you can hit an authenticated endpoint you can login using the frontend and navigate to the `/auth/access-token` to get an access token.

![Access Token Page](/img/Access-Token-Page.png)
:::

File layout in the server folder for your reference

```
server/
├── admin
│   ├── admin.resolver.ts
│   └── admin.service.ts
├── cat
│   ├── cat.resolver.spec.ts
│   ├── cat.resolver.ts
│   ├── cat.schema.ts
│   ├── cat.service.spec.ts
│   ├── cat.service.ts
│   └── input
│       └── create-cat.input.ts
├── category
│   ├── category.resolver.ts
│   ├── category.schema.ts
│   ├── category.service.ts
│   └── input
│       ├── createCategory.input.ts
│       └── updateCategory.input.ts
├── config
│   ├── dbConnect.ts
│   ├── test.config.ts
│   └── utils.ts
├── document
│   ├── document.resolver.ts
│   ├── document.schema.ts
│   ├── document.service.ts
│   └── input
│       ├── createDocument.input.ts
│       └── updateDocument.input.ts
├── entry
│   ├── entry.resolver.ts
│   ├── entry.schema.ts
│   ├── entry.service.ts
│   └── input
│       ├── advancedSearch.input.ts
│       ├── createEntry.input.ts
│       └── updateEntry.input.ts
├── findAllArgs.input.ts
├── glossaryItem
│   ├── glossaryItem.resolver.ts
│   ├── glossaryItem.schema.ts
│   ├── glossaryItem.service.ts
│   └── input
│       ├── createGlossaryItem.input.ts
│       └── updateGlossaryItem.input.ts
├── hello.resolver.ts
├── item
│   ├── input
│   │   ├── createItem.input.ts
│   │   └── updateItem.input.ts
│   ├── item.resolver.ts
│   ├── item.schema.ts
│   └── item.service.ts
├── middleware
│   ├── auth.middleware.ts
│   └── misc.middleware.ts
├── person
│   ├── input
│   │   ├── createPerson.input.ts
│   │   └── updatePerson.input.ts
│   ├── person.resolver.ts
│   ├── person.schema.ts
│   └── person.service.ts
├── place
│   ├── input
│   │   ├── createPlace.input.ts
│   │   └── updatePlace.input.ts
│   ├── place.resolver.ts
│   ├── place.schema.ts
│   └── place.service.ts
├── spreadsheet
│   ├── spreadsheet.resolver.ts
│   └── spreadsheet.service.ts
└── tobaccoMark
    ├── input
    │   ├── createTobaccoMark.input.ts
    │   └── updateTobaccoMark.input.ts
    ├── tobaccoMark.resolver.ts
    ├── tobaccoMark.schema.ts
    └── tobaccoMark.service.ts
```
