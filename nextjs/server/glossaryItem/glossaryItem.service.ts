import { filterObject } from '../config/utils';
import { GlossaryItem, GlossaryItemModel } from './glossaryItem.schema';
import { CreateGlossaryItemInput } from './input/createGlossaryItem.input';
import { UpdateGlossaryItemInput } from './input/updateGlossaryItem.input';

export default class GlossaryItemService {
	static async create(
		glossaryItem: CreateGlossaryItemInput,
	): Promise<GlossaryItem> {
		const createdGlossaryItem = new GlossaryItemModel(glossaryItem);
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


	static async count(filter: any = {}): Promise<number> {
		return GlossaryItemModel.estimatedDocumentCount(filter).lean().exec();
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
