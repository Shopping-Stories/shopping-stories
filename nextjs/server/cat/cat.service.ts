import { Cat, CatModel } from './cat.schema';
import { CreateCatDto } from './input/create-cat.input';

export default class CatService {
	static async create(createCatDto: CreateCatDto): Promise<Cat> {
		const createdCat = new CatModel(createCatDto);
		return (await createdCat.save()).toObject();
	}

	static async findAll(): Promise<Cat[]> {
		return CatModel.find().lean<Cat[]>().exec();
	}

	static async findOne(id: string): Promise<Cat | null> {
		return CatModel.findById(id).lean<Cat>().exec();
	}
}
