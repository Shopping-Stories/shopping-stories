import 'reflect-metadata';
import {
    Arg,
    Info,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { getMongooseFromFields } from 'server/config/utils';
import { DocumentInfo } from './document.schema';
import DocumentService from './document.service';
import { CreateDocumentInput } from './input/createDocument.input';
import { UpdateDocumentInput } from './input/updateDocument.input';
import { FindAllLimitAndSkip } from 'server/findAllArgs.input';

@Resolver(() => DocumentInfo)
export default class DocumentResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Query(() => [DocumentInfo], { nullable: true })
    async findDocuments(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ): Promise<DocumentInfo[]> {
        return DocumentService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query(() => Number)
    async countDocuments(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return DocumentService.count(search);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query(() => DocumentInfo, { nullable: true })
    async findDocument(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<DocumentInfo | null> {
        return DocumentService.findOne(id, getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation(() => DocumentInfo)
    async createDocument(
        @Arg('newDocument') newItem: CreateDocumentInput,
    ): Promise<DocumentInfo> {
        return DocumentService.create(newItem);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation(() => DocumentInfo, { nullable: true })
    async updateDocument(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdateDocumentInput,
        @Info() info: any,
    ): Promise<DocumentInfo | null> {
        return DocumentService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation(() => DocumentInfo, { nullable: true })
    async deleteDocument(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<DocumentInfo | null> {
        return DocumentService.deleteOne(id, getMongooseFromFields(info));
    }
}
