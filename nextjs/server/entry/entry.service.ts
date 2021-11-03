import { EntryModel, Entry } from './entry.schema';
import { CreateEntryInput } from './input/create-entry.input';

export class EntryService {
    static async createEntry(
        createEntryInput: CreateEntryInput,
    ): Promise<Entry> {
        const createdEntry = new EntryModel(createEntryInput);
        return createdEntry.save();
    }

    static async createEntries(
        createEntries: CreateEntryInput[],
    ): Promise<Entry[]> {
        const createdEntries = EntryModel.insertMany(createEntries);
        return createdEntries;
    }

    static async findAllEntries(): Promise<Entry[]> {
        return EntryModel.find().lean<Entry[]>().exec();
    }

    static async findOneEntry(id: string): Promise<Entry | null> {
        return EntryModel.findById(id).lean<Entry>().exec();
    }
}
