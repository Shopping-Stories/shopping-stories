import graphqlFields from 'graphql-fields';
import 'reflect-metadata';
import {
	Arg,
	Authorized,
	Info,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { Roles } from '../../config/constants.config';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Cat } from './cat.schema';
import CatService from './cat.service';
import { CreateCatDto } from './input/create-cat.input';

function getMongooseFromFields(info: any, fieldPath = null) {
	const selections = graphqlFields(info);
	const mongooseSelection = Object.keys(
		fieldPath ? selections[fieldPath] : selections,
	).reduce((a, b) => ({ ...a, [b]: 1 }), {});
	return mongooseSelection;
}

@Resolver((_of) => Cat)
export default class CatResolver {
	@Authorized([Roles.Admin, Roles.Moderator])
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [Cat], { nullable: true })
	async findCatsAuth(
		@Info() info: any /* @Ctx() context: MyContext */,
	): Promise<Cat[]> {
		return CatService.findAll(getMongooseFromFields(info));
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [Cat], { nullable: true })
	async findCats(@Info() info: any): Promise<Cat[]> {
		return CatService.findAll(getMongooseFromFields(info));
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => Cat, { nullable: true })
	async findCat(@Arg('id') id: string, @Info() info: any): Promise<Cat | null> {
		return CatService.findOne(id, getMongooseFromFields(info));
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => Cat)
	async createCat(@Arg('newCat') newCat: CreateCatDto): Promise<Cat> {
		return CatService.create(newCat);
	}
}
