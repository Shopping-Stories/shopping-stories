import {
    filterObject,
    getMongoTextSearchObject,
    optimizedMongoCount,
} from '../config/utils';
import { Entry, EntryModel } from './entry.schema';
import { AdvancedSearchInput } from './input/advancedSearch.input';
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

    static async advancedSearch(
        searchObj: AdvancedSearchInput,
        limit: number,
        skip: number,
        count?: false | undefined,
    ): Promise<Entry[]>;
    static async advancedSearch(
        searchObj: AdvancedSearchInput,
        limit: number,
        skip: number,
        count: true,
    ): Promise<number>;
    static async advancedSearch(
        searchObj: AdvancedSearchInput,
        limit: number,
        skip: number,
        count?: boolean,
    ): Promise<Entry[] | number> {
        //advanced search
        //need to pull fields supplied from the search input
        //if the field is apart of the entry text index, add it to the search string, else
        //we need to create the fields to search for the entry

        //regexes to use (?i) for case insensitivity
        //regular regex to match things such as numbers for tobacco marks

        let searchString = '';
        let indexFlag = 0;
        let temp: any = {};
        if (searchObj.people) {
            searchString += searchObj.people.toString();
        }
        if (searchObj.reel) {
            temp['meta.reel'] = searchObj.reel.toString();
        }
        if (searchObj.storeOwner) {
            let owner = searchObj.storeOwner.toString();

            temp['meta.owner'] = { $regex: owner, $options: 'i' };
        }
        if (searchObj.folioYear) {
            let folioYear = searchObj.folioYear.toString();
            temp['meta.year'] = { $regex: folioYear };
        }
        if (searchObj.folioPage) {
            let folioPage = searchObj.folioPage.toString();
            temp['meta.folioPage'] = { $regex: folioPage };
        }
        if (searchObj.entryID) {
            let entryID = searchObj.entryID.toString();
            temp['meta.entryID'] = { $regex: entryID, $options: 'i' };
        }
        if (searchObj.accountHolderName) {
            searchString += searchObj.accountHolderName.trim().toString();
        }
        if (searchObj.date != undefined && searchObj.date2 != undefined) {
            let date = new Date(searchObj.date);
            let date2 = new Date(searchObj.date2);
            temp['dateInfo.fullDate'] = { $gte: date, $lt: date2 };
        }
        if (searchObj.people) {
            searchString += searchObj.people;
        }
        if (searchObj.places) {
            searchString += searchObj.places;
        }
        if (searchObj.colony) {
            let colony = searchObj.colony.toString();
            temp['money.colony'] = { $regex: new RegExp(colony, 'i') };
        }
        if (searchObj.itemEntry != null) {
            let entry = searchObj.itemEntry;
            if (entry.perOrder === 1) {
                temp['itemEntries.perOrder'] = 1;
            }
            if (entry.items) {
                let entryItems = entry.items.toString();

                temp['itemEntries.itemsOrServices.item'] = {
                    $regex: new RegExp(entryItems, 'i'),
                };
            }
            if (entry.category) {
                temp['itemEntries.itemsOrServices.category'] =
                    entry.category.toString();
            }
            if (entry.subcategory) {
                temp['itemEntries.itemsOrServices.subcategory'] =
                    entry.subcategory.toString();
            }
            if (entry.variant) {
                let variantString = entry.variant.toString();
                temp['itemEntries.itemsOrServices.variants'] = {
                    $regex: variantString,
                    $options: 'i',
                };
            }
        }
        if (searchObj.tobaccoEntry != null) {
            let entry = searchObj.tobaccoEntry;
            if (entry.description) {
                let description = entry.description.toString();
                temp['tobaccoEntry.entry'] = {
                    $regex: description,
                    $options: 'i',
                };
            }
            if (entry.tobaccoMarkName) {
                let name = entry.tobaccoMarkName.toString();
                temp['tobaccoEntry.marks.markName'] = {
                    $regex: name,
                    $options: 'ix',
                };
            }
            if (entry.noteNumber != -1) {
                temp['tobaccoEntry.notes.noteNum'] = entry.noteNumber;
            }
            if (entry.moneyType) {
                let money = entry.moneyType.toString();
                temp['tobaccoEntry.money.moneyType'] = {
                    $regex: money,
                    $options: 'ix',
                };
            }
        }
        if (searchObj.regularEntry) {
            let entry = searchObj.regularEntry;
            if (entry.entryDescription) {
                let description = entry.entryDescription.toString();
                temp['regularEntry.entry'] = {
                    $regex: description,
                    $options: 'ix',
                };
            }
            if (entry.tobaccoMarkName) {
                let name = entry.tobaccoMarkName.toString();
                temp['regularEntry.tobaccoMarks.markName'] = {
                    $regex: name,
                    $options: 'ix',
                };
            }
        }

        if (searchString !== '') {
            let searchJson = {
                $search: searchString,
            };
            temp['$text'] = searchJson;
            indexFlag = 1;
        }

        //general fields
        //fields Reel, StoreOwner, FolioYear,FolioPage,Entry ID, Account holder name (one field),
        //Date using date picker, people, places, commodity, colony

        /*for item entry forms
        per order(yes or no, 1 for yes, 0 for no), items, category, subcategory, variant
        */

        /*for tobacco entry forms
        entry discription, tobacco mark name, note number, money type
        */

        /*for regular entry
        entry discription, tobacoo mark name
        */

        //append search fields to temp like temp[tobaccoEntry.marks.markName] = "blahblah"

        if (count) {
            if (indexFlag === 1) {
                return EntryModel.countDocuments(temp).exec();
            } else {
                return EntryModel.countDocuments(temp).exec();
            }
        }

        if (indexFlag === 1) {
            return EntryModel.find(temp, {
                score: { $meta: 'textScore' },
            })
                .sort({ score: { $meta: 'textScore' } })
                .skip(skip)
                .limit(limit)
                .lean<Entry[]>();
        } else {
            return EntryModel.find(temp)
                .skip(skip)
                .limit(limit)
                .lean<Entry[]>();
        }
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
