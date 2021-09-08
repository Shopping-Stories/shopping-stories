import { Model } from 'mongoose';
import { EntryDocument, Entry } from './entry.schema';
import { CreateEntryInput } from './input/create-entry.input';

export class EntryService {
	constructor(private entryModel: Model<EntryDocument>) {
		this.entryModel = entryModel;
	}

	async createEntry(createEntryInput: CreateEntryInput): Promise<Entry> {
		const createdCat = new this.entryModel(createEntryInput);
		return createdCat.save();
	}

	async findAllEntries(): Promise<Entry[]> {
		return this.entryModel.find().exec();
	}

	async findOneEntry(id: string): Promise<Entry | null> {
		return this.entryModel.findById(id).exec();
	}
}
