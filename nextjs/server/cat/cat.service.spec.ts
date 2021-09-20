import { MongoMemoryServer } from 'mongodb-memory-server';
import dbConnect from '../config/dbConnect';
import { CatModel } from './cat.schema';
import CatService from './cat.service';

let mongod: MongoMemoryServer;

describe('Cat.Service', () => {
	beforeAll(async () => {
		// This will create an new instance of "MongoMemoryServer" and automatically start it
		mongod = await MongoMemoryServer.create();
		await dbConnect(mongod.getUri());
	});

	afterAll(async () => {
		// The Server can be stopped again with
		await mongod.stop();
	});

	it('CatService.create', async () => {
		await CatService.create({ name: 'Meow', age: 3, breed: 'Russian Blue' });
		const cats = await CatModel.find();
		expect(cats.length).toEqual(1);
	});
});
