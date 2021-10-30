import {
	filterObject,
	getMongoTextSearchObject,
	optimizedMongoCount,
} from '../config/utils';
import { CreatePersonInput } from './input/createPerson.input';
import { UpdatePersonInput } from './input/updatePerson.input';
import { PersonModel, Person } from './person.schema';

export default class PersonService {
	static async create(person: CreatePersonInput): Promise<Person> {
		const createdPerson = new PersonModel(person);
		return createdPerson.save();
	}

	static async findAll(
		skip: number,
		limit: number,
		selectedFields: Object,
		search?: string,
	): Promise<Person[]> {
		return PersonModel.find(getMongoTextSearchObject(search), selectedFields)
			.skip(skip)
			.limit(limit)
			.lean<Person[]>()
			.exec();
	}

	static async count(search?: string): Promise<number> {
		return optimizedMongoCount(PersonModel, search);
	}

	static async findOne(
		id: string,
		selectedFields: Object,
	): Promise<Person | null> {
		return PersonModel.findOne({ _id: id })
			.select(selectedFields)
			.lean<Person>()
			.exec();
	}

	static async updateOne(
		id: string,
		updateFields: UpdatePersonInput,
		selectedFields: Object,
	): Promise<Person | null> {
		return PersonModel.findOneAndUpdate(
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
	): Promise<Person | null> {
		return PersonModel.findOneAndDelete({ _id: id })
			.select(selectedFields)
			.exec();
	}
}
