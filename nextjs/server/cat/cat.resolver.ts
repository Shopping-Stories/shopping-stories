import 'reflect-metadata';
import {
	Arg,
	Authorized,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { Roles } from '../middleware/auth.middleware';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Cat } from './cat.schema';
import CatService from './cat.service';
import { CreateCatDto } from './input/create-cat.input';

@Resolver((_of) => Cat)
export default class CatResolver {
	@Authorized([Roles.Admin, Roles.Moderator])
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [Cat], { nullable: true })
	async findCatsAuth(/* @Ctx() context: MyContext */): Promise<Cat[]> {
		return CatService.findAll();
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [Cat], { nullable: true })
	async findCats(/* @Ctx() context: MyContext */): Promise<Cat[]> {
		return CatService.findAll();
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => Cat, { nullable: true })
	async findCat(@Arg('id') id: string): Promise<Cat | null> {
		return CatService.findOne(id);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => Cat)
	async createCat(@Arg('newCat') newCat: CreateCatDto): Promise<Cat> {
		return CatService.create(newCat);
	}
}
