import {
    filterObject,
    getMongoTextSearchObject,
    optimizedMongoCount,
} from '../config/utils';
import { CreatePlaceInput } from './input/createPlace.input';
import { UpdatePlaceInput } from './input/updatePlace.input';
import { PlaceModel, Place } from './place.schema';

export default class PlaceService {
    static async create(place: CreatePlaceInput): Promise<Place> {
        const createdPlace = new PlaceModel(place);
        return createdPlace.save();
    }

    static async findAll(
        skip: number,
        limit: number,
        selectedFields: Object,
        search?: string,
    ): Promise<Place[]> {
        if (!!search) {
            return PlaceModel.find(getMongoTextSearchObject(search), {
                ...selectedFields,
                score: { $meta: 'textScore' },
            })
                .skip(skip)
                .limit(limit)
                .sort({
                    score: { $meta: 'textScore' },
                    location: 'asc',
                    alias: 'asc',
                    _id: 'asc',
                })
                .lean<Place[]>()
                .exec();
        }
        return PlaceModel.find(getMongoTextSearchObject(search), selectedFields)
            .sort({ location: 'asc', alias: 'asc', _id: 'asc' })
            .skip(skip)
            .limit(limit)
            .lean<Place[]>()
            .exec();
    }

    static async count(search?: string): Promise<number> {
        return optimizedMongoCount(PlaceModel, search);
    }

    static async findOne(
        id: string,
        selectedFields: Object,
    ): Promise<Place | null> {
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
