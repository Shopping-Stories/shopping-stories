import { Cat, CatModel } from './cat.schema';
import { CreateCatDto } from './input/create-cat.input';

export default class CatService {
    static async create(createCatDto: CreateCatDto): Promise<Cat> {
        const createdCat = new CatModel(createCatDto);
        return (await createdCat.save()).toObject();
    }

    static async findAll(selectedFields: Object): Promise<Cat[]> {
        return CatModel.find().select(selectedFields).lean<Cat[]>().exec();
    }

    static async findOne(
        id: string,
        selectedFields: Object,
    ): Promise<Cat | null> {
        return CatModel.findById(id).select(selectedFields).lean<Cat>().exec();
    }
}
