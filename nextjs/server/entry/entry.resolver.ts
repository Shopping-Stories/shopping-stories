import 'reflect-metadata';
import { getMongooseFromFields } from 'server/config/utils';
import { FindAllLimitAndSkip } from 'server/findAllArgs.input';
import {
    Arg,
    Info,
    Mutation,
    Query,
    Resolver,
    UseMiddleware
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Entry } from './entry.schema';
import { EntryService } from './entry.service';
import { AdvancedSearchInput } from './input/advancedSearch.input';
import { CreateEntryInput } from './input/createEntry.input';
import { UpdateEntryInput } from './input/updateEntry.input';

@Resolver((_of) => Entry)
export default class EntryResolver {
    // @UseMiddleware(Auth, ResolveTime)
    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => [Entry], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async findEntries(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ) {
        return EntryService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => [Entry], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedFindEntries(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: AdvancedSearchInput,
    ): Promise<Entry[]> {
        return EntryService.advancedSearch(search, limit, skip);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Number, {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedCountEntries(
        @Arg('search', { nullable: true }) search: AdvancedSearchInput,
    ): Promise<number> {
        return EntryService.advancedSearch(search, 1, 1, true);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Number)
    async countEntries(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return EntryService.count(search);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Entry, {
        nullable: true,
        description: 'Find an entry by id',
    })
    async findEntry(@Arg('id') id: string) {
        return EntryService.findOne(id);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Mutation(() => Entry)
    async createEntry(
        @Arg('createEntryInput') createEntryInput: CreateEntryInput,
    ) {
        return EntryService.create(createEntryInput);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Mutation(() => [Entry])
    async createEntries(
        @Arg('entries', (_type) => [CreateEntryInput], { nullable: 'items' })
        entries: CreateEntryInput[],
    ) {
        return EntryService.createEntries(entries);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation(() => Entry, { nullable: true })
    async updateEntry(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdateEntryInput,
        @Info() info: any,
    ): Promise<Entry | null> {
        return EntryService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation(() => Entry, { nullable: true })
    async deleteEntry(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Entry | null> {
        return EntryService.deleteOne(id, getMongooseFromFields(info));
    }
}
