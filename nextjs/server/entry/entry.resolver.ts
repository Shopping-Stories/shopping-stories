import 'reflect-metadata';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Entry, EntrySchema } from './entry.schema';
import { EntryService } from './entry.service';
import { CreateEntryInput } from './input/create-entry.input';

@Resolver((of) => Entry)
export default class EntryResolver {
	constructor(private entryService: EntryService) {
		this.entryService = new EntryService(EntrySchema);
	}

	// @UseMiddleware(Auth, ResolveTime)
	@UseMiddleware(ResolveTime, ConnectDB)
	@Query((returns) => [Entry], {
		nullable: true,
		description: 'Find all Cats in the database',
	})
	async findEntries() {
		return this.entryService.findAllEntries();
	}

	@UseMiddleware(ResolveTime, ConnectDB)
	@Query((returns) => Entry, {
		nullable: true,
		description: 'Find an entry by id',
	})
	async findEntry(@Arg('id') id: string) {
		return this.entryService.findOneEntry(id);
	}

	@UseMiddleware(ResolveTime, ConnectDB)
	@Mutation((returns) => Entry)
	async createEntry(
		@Arg('createEntryInput') createEntryInput: CreateEntryInput,
	) {
		return this.entryService.createEntry(createEntryInput);
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
