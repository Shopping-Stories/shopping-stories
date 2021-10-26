import { filterObject } from '../config/utils';
import { CreatePlaceInput } from "./input/createPlace.input"
import { UpdatePlaceInput } from "./input/updatePlace.input";
import { PlaceModel, Place } from "./place.schema";

export default class PlaceService {
	static async create(
		place: CreatePlaceInput,
	): Promise<Place> {
		const createdPlace = new PlaceModel(place);
		return createdPlace.save();
	}

	static async findAll(
		skip: number,
		limit: number,
		selectedFields: Object,
	): Promise<Place[]> {
		return PlaceModel.find({}, selectedFields)
			.skip(skip)
			.limit(limit)
			.lean<Place[]>()
			.exec();
	}


	static async count(filter: any = {}): Promise<number> {
		return PlaceModel.estimatedDocumentCount(filter).lean().exec();
	}

	static async findOne(
		id: string,
		selectedFields: Object,
	): Promise<Place| null> {
		return PlaceModel.findOne({ _id: id })
			.select(selectedFields)
			.lean<Place>()
			.exec();
	}

	static async updateOne(
		id: string,
		updateFields: UpdatePlaceInput,
		selectedFields: Object,
	): Promise<Place | null> {
		return PlaceModel.findOneAndUpdate(
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
	): Promise<Place | null> {
		return PlaceModel.findOneAndDelete({ _id: id })
			.select(selectedFields)
			.exec();
	}
}
