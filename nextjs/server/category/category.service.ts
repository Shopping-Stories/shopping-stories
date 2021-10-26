import { filterObject } from '../config/utils';
import { CreateCategoryInput } from "./input/createCategory.input"
import { UpdateCategoryInput } from './input/updateCategory.input';
import { CategoryModel, Category } from "./category.schema";

export default class CategoryService {
	static async create(
		category: CreateCategoryInput,
	): Promise<Category> {
		const createdCategory = new CategoryModel(category);
		return createdCategory.save();
	}

	static async findAll(
		skip: number,
		limit: number,
		selectedFields: Object,
	): Promise<Category[]> {
		return CategoryModel.find({}, selectedFields)
			.skip(skip)
			.limit(limit)
			.lean<Category[]>()
			.exec();
	}


	static async count(filter: any = {}): Promise<number> {
		return CategoryModel.estimatedDocumentCount(filter).lean().exec();
	}

	static async findOne(
		id: string,
		selectedFields: Object,
	): Promise<Category | null> {
		return CategoryModel.findOne({ _id: id })
			.select(selectedFields)
			.lean<Category>()
			.exec();
	}

	static async updateOne(
		id: string,
		updateFields: UpdateCategoryInput,
		selectedFields: Object,
	): Promise<Category | null> {
		return CategoryModel.findOneAndUpdate(
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
	): Promise<Category | null> {
		return CategoryModel.findOneAndDelete({ _id: id })
			.select(selectedFields)
			.exec();
	}
}
