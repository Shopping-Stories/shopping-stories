import {
    filterObject,
    getMongoTextSearchObject,
    optimizedMongoCount,
} from '../config/utils';
import { EntryModel, Entry } from './entry.schema';
import { CreateEntryInput } from './input/createEntry.input';
import { UpdateEntryInput } from './input/updateEntry.input';

export class EntryService {
    static async create(createEntryInput: CreateEntryInput): Promise<Entry> {
        const createdEntry = new EntryModel(createEntryInput);
        return createdEntry.save();
    }

    static async createEntries(
        createEntries: CreateEntryInput[],
    ): Promise<Entry[]> {
        const createdEntries = EntryModel.insertMany(createEntries);
        return createdEntries;
    }

    static async findAll(
        skip: number,
        limit: number,
        selectedFields: Object,
        search?: string,
    ): Promise<Entry[]> {
        if (!!search) {
            console.log('thing');
            return EntryModel.find(getMongoTextSearchObject(search), {
                ...selectedFields,
                score: { $meta: 'textScore' },
            })
                .skip(skip)
                .limit(limit)
                .sort({ score: { $meta: 'textScore' } })
                .lean<Entry[]>()
                .exec();
        }
        return EntryModel.find(getMongoTextSearchObject(search), selectedFields)
            .skip(skip)
            .limit(limit)
            .lean<Entry[]>()
            .exec();
    }

    static async count(search?: string): Promise<number> {
        return optimizedMongoCount(EntryModel, search);
    }

    static async findOne(id: string): Promise<Entry | null> {
        return EntryModel.findById(id).lean<Entry>().exec();
    }

    static async updateOne(
        id: string,
        updateFields: UpdateEntryInput,
        selectedFields: Object,
    ): Promise<Entry | null> {
        return EntryModel.findOneAndUpdate(
            { _id: id },
            {
                $set: filterObject(
                    updateFields,
                    (val: any, _key: any) => val !== undefined,
                ),
            },
            { new: true }, // returns new document
        )
            .select(selectedFields)
            .exec();
    }

    static async deleteOne(
        id: string,
        selectedFields: Object,
    ): Promise<Entry | null> {
        return EntryModel.findOneAndDelete({ _id: id })
            .select(selectedFields)
            .exec();
    }
}
