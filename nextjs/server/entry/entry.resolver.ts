import 'reflect-metadata';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Entry } from './entry.schema';
import { EntryService } from './entry.service';
import { CreateEntryInput } from './input/create-entry.input';

@Resolver((_of) => Entry)
export default class EntryResolver {
    // @UseMiddleware(Auth, ResolveTime)
    @UseMiddleware(ResolveTime, ConnectDB)
    @Query((_returns) => [Entry], {
        nullable: true,
        description: 'Find all Cats in the database',
    })
    async findEntries() {
        return EntryService.findAllEntries();
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query((_returns) => Entry, {
        nullable: true,
        description: 'Find an entry by id',
    })
    async findEntry(@Arg('id') id: string) {
        return EntryService.findOneEntry(id);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Mutation((_returns) => Entry)
    async createEntry(
        @Arg('createEntryInput') createEntryInput: CreateEntryInput,
    ) {
        return EntryService.createEntry(createEntryInput);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Mutation((_returns) => [Entry])
    async createEntries(
        @Arg('entries', (_type) => [CreateEntryInput], { nullable: 'items' })
        entries: CreateEntryInput[],
    ) {
        return EntryService.createEntries(entries);
    }

    // @ResolveField()
    // async Entry(@Parent() entry: Entry) {

    // 	if (typeof entry.Entry.value === "number"){
    // 		let val = new IntBox();
    // 		val.value = entry.Entry.value;
    // 		return val;
    // 	}
    // 	let val = new StringBox();
    // 	val.value = entry.Entry.value;
    // 	return val;
    // }
}
