import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryResolver } from './entry.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from './entry.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
	],
	providers: [EntryService, EntryResolver],
})
export class EntryModule {}
