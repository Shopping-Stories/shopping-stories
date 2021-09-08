import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from './entry.schema';
import { EntryService } from './entry.service';

@Resolver((of) => Entry)
export class EntryResolver {
	constructor(private entryService: EntryService) {}

	@Query((returns) => [Entry], {
		nullable: true,
		description: 'Find all Cats in the database',
	})
	// @UseGuards(GqlAuthGuard)
	async findEntries() {
		return this.entryService.findAllEntries();
	}

	@Query((returns) => Entry, {
		nullable: true,
		description: 'Find an entry by id',
	})
	async findEntry(@Args('id') id: string) {
		return this.entryService.findOneEntry(id);
	}

	@Mutation((returns) => Entry)
	async createEntry(@Args('createEntryDto') createEntryDto: CreateEntryDto) {
		return this.entryService.createEntry(createEntryDto);
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
