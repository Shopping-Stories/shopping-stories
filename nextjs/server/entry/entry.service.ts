import { EntryModel, Entry } from './entry.schema';
import { CreateEntryInput } from './input/create-entry.input';

export class EntryService {
	static async createEntry(createEntryInput: CreateEntryInput): Promise<Entry> {
		const createdCat = new EntryModel(createEntryInput);
		return createdCat.save();
	}

	static async findAllEntries(): Promise<Entry[]> {
		return EntryModel.find().lean<Entry[]>().exec();
	}

	static async findOneEntry(id: string): Promise<Entry | null> {
		return EntryModel.findById(id).lean<Entry>().exec();
	}
}
