import { Roles } from 'config/constants.config';
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
import { getMongooseFromFields } from '../config/utils';
import { FindAllLimitAndSkip } from '../findAllArgs.input';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { CreateItemInput } from './input/createItem.input';
import { UpdateItemInput } from './input/updateItem.input';
import { Item } from './item.schema';
import ItemService from './item.service';

@Resolver((_of) => Item)
export default class ItemResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => [Item], { nullable: true })
    async findItems(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ): Promise<Item[]> {
        return ItemService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Number)
    async countItems(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return ItemService.count(search);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Item, { nullable: true })
    async findOneItem(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Item | null> {
        return ItemService.findOne(id, getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => Item)
    async createItem(@Arg('item') newItem: CreateItemInput): Promise<Item> {
        return ItemService.create(newItem);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin, Roles.Moderator])
    @Mutation((_returns) => Item, { nullable: true })
    async updateItem(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdateItemInput,
        @Info() info: any,
    ): Promise<Item | null> {
        return ItemService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => Item, { nullable: true })
    async deleteItem(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Item | null> {
        return ItemService.deleteOne(id, getMongooseFromFields(info));
    }
}
