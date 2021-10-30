import {
	filterObject,
	getMongoTextSearchObject,
	optimizedMongoCount,
} from '../config/utils';
import { CreateItemInput } from './input/createItem.input';
import { UpdateItemInput } from './input/updateItem.input';
import { ItemModel, Item } from './item.schema';

export default class ItemService {
	static async create(item: CreateItemInput): Promise<Item> {
		const createdItem = new ItemModel(item);
		return createdItem.save();
	}

	static async findAll(
		skip: number,
		limit: number,
		selectedFields: Object,
		search?: string,
	): Promise<Item[]> {
		return ItemModel.find(getMongoTextSearchObject(search), selectedFields)
			.skip(skip)
			.limit(limit)
			.lean<Item[]>()
			.exec();
	}

	static async count(search?: string): Promise<number> {
		return optimizedMongoCount(ItemModel, search);
	}

	static async findOne(
		id: string,
		selectedFields: Object,
	): Promise<Item | null> {
		return ItemModel.findOne({ _id: id })
			.select(selectedFields)
			.lean<Item>()
			.exec();
	}

	static async updateOne(
		id: string,
		updateFields: UpdateItemInput,
		selectedFields: Object,
	): Promise<Item | null> {
		return ItemModel.findOneAndUpdate(
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
	): Promise<Item | null> {
		return ItemModel.findOneAndDelete({ _id: id })
			.select(selectedFields)
			.exec();
	}
}
