import {
    filterObject,
    getMongoTextSearchObject,
    optimizedMongoCount,
} from '../config/utils';
import { CreateCategoryInput } from './input/createCategory.input';
import { UpdateCategoryInput } from './input/updateCategory.input';
import { CategoryModel, Category } from './category.schema';

export default class CategoryService {
    static async create(category: CreateCategoryInput): Promise<Category> {
        const createdCategory = new CategoryModel(category);
        return createdCategory.save();
    }

    static async findAll(
        skip: number,
        limit: number,
        selectedFields: Object,
        search?: string,
    ): Promise<Category[]> {
        if (!!search) {
            return CategoryModel.find(getMongoTextSearchObject(search), {
                ...selectedFields,
                score: { $meta: 'textScore' },
            })
                .skip(skip)
                .limit(limit)
                .sort({
                    score: { $meta: 'textScore' },
                    item: 'asc',
                    category: 'asc',
                    _id: 'asc',
                })
                .lean<Category[]>()
                .exec();
        }
        return CategoryModel.find(
            getMongoTextSearchObject(search),
            selectedFields,
        )
            .sort({ item: 'asc', category: 'asc', _id: 'asc' })
            .skip(skip)
            .limit(limit)
            .lean<Category[]>()
            .exec();
    }

    static async count(search?: string): Promise<number> {
        return optimizedMongoCount(CategoryModel, search);
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
