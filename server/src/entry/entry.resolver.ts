import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cat } from 'src/cats/cat.schema';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from './entry.schema';
import { EntryService } from './entry.service';

@Resolver()
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
}
