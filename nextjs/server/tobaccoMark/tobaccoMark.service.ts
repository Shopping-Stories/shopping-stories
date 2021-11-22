import {
    filterObject,
    getMongoTextSearchObject,
    optimizedMongoCount,
} from '../config/utils';
import { CreateTobaccoMarkInput } from './input/createTobaccoMark.input';
import { UpdateTobaccoMarkInput } from './input/updateTobaccoMark.input';
import { TobaccoMarkModel, TobaccoMark } from './tobaccoMark.schema';

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
        search?: string,
    ): Promise<TobaccoMark[]> {
        if (!!search) {
            return TobaccoMarkModel.find(getMongoTextSearchObject(search), {
                ...selectedFields,
                score: { $meta: 'textScore' },
            })
                .skip(skip)
                .limit(limit)
                .sort({
                    score: { $meta: 'textScore' },
                })
                .lean<TobaccoMark[]>()
                .exec();
        }
        return TobaccoMarkModel.find(
            getMongoTextSearchObject(search),
            selectedFields,
        )
            .skip(skip)
            .limit(limit)
            .lean<TobaccoMark[]>()
            .exec();
    }

    static async count(search?: string): Promise<number> {
        return optimizedMongoCount(TobaccoMarkModel, search);
    }

    static async findOne(
        id: string,
        selectedFields: Object,
    ): Promise<TobaccoMark | null> {
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
