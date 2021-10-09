import { GlossaryItem, GlossaryItemModel } from './glossaryItem.schema';
import { CreateGlossaryItemInput } from './input/createGlossaryItem.input';
import { UpdateGlossaryItemInput } from './input/updateGlossaryItem.input';

const filterObject = (obj: Object, callback: any) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, val]) => callback(val, key)),
	);
};

export default class GlossaryItemService {
	static async create(
		createItemInput: CreateGlossaryItemInput,
	): Promise<GlossaryItem> {
		const createdGlossaryItem = new GlossaryItemModel(createItemInput);
		return createdGlossaryItem.save();
	}

	static async findAll(
		skip: number,
		limit: number,
		selectedFields: Object,
	): Promise<GlossaryItem[]> {
		return GlossaryItemModel.find({}, selectedFields)
			.skip(skip)
			.limit(limit)
			.lean<GlossaryItem[]>()
			.exec();
	}

	static async findOne(
		id: string,
		selectedFields: Object,
	): Promise<GlossaryItem | null> {
		return GlossaryItemModel.findOne({ _id: id })
			.select(selectedFields)
			.lean<GlossaryItem>()
			.exec();
	}

	static async updateOne(
		id: string,
		updateFields: UpdateGlossaryItemInput,
		selectedFields: Object,
	): Promise<GlossaryItem | null> {
		return GlossaryItemModel.findOneAndUpdate(
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
	): Promise<GlossaryItem | null> {
		return GlossaryItemModel.findOneAndDelete({ _id: id })
			.select(selectedFields)
			.exec();
	}
}
