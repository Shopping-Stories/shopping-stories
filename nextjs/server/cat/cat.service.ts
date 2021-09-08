import { getClassForDocument } from '@typegoose/typegoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from './cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';

export class CatService {
	constructor(private catModel: Model<CatDocument>) {
		this.catModel = catModel;
	}

	async create(createCatDto: CreateCatDto): Promise<Cat> {
		const createdCat = new this.catModel(createCatDto);
		return (await createdCat.save()).toObject();
	}

	async findAll(): Promise<Cat[]> {
		return this.catModel.find().lean<Cat[]>().exec();
	}

	async findOne(id: string): Promise<Cat | null> {
		return this.catModel.findById(id).lean<Cat>().exec();
	}
}
