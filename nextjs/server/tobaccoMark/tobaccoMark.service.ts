import { filterObject } from '../config/utils';
import { CreateTobaccoMarkInput } from "./input/createTobaccoMark.input"
import { UpdateTobaccoMarkInput } from "./input/updateTobaccoMark.input";
import { TobaccoMarkModel, TobaccoMark } from "./tobaccoMark.schema";

export default class TobaccoMarkService {
	static async create(
		tobaccoMark: CreateTobaccoMarkInput,
	): Promise<TobaccoMark> {
		const createdPlace = new TobaccoMarkModel(tobaccoMark);
		return createdPlace.save();
	}

	static async findAll(
		skip: number,
		limit: number,
		selectedFields: Object,
	): Promise<TobaccoMark[]> {
		return TobaccoMarkModel.find({}, selectedFields)
			.skip(skip)
			.limit(limit)
			.lean<TobaccoMark[]>()
			.exec();
	}


	static async count(filter: any = {}): Promise<number> {
		return TobaccoMarkModel.estimatedDocumentCount(filter).lean().exec();
	}

	static async findOne(
		id: string,
		selectedFields: Object,
	): Promise<TobaccoMark| null> {
		return TobaccoMarkModel.findOne({ _id: id })
			.select(selectedFields)
			.lean<TobaccoMark>()
			.exec();
	}

	static async updateOne(
		id: string,
		updateFields: UpdateTobaccoMarkInput,
		selectedFields: Object,
	): Promise<TobaccoMark | null> {
		return TobaccoMarkModel.findOneAndUpdate(
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
	): Promise<TobaccoMark | null> {
		return TobaccoMarkModel.findOneAndDelete({ _id: id })
			.select(selectedFields)
			.exec();
	}
}
