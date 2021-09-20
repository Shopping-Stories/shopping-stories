import 'reflect-metadata';
import { Authorized, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Roles } from '../middleware/auth.middleware';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Cat } from './cat.schema';
import CatService from './cat.service';

@Resolver((_of) => Cat)
export default class CatResolver {
	@Authorized([Roles.Admin, Roles.Moderator])
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [Cat], { nullable: true })
	async findCats(/* @Ctx() context: MyContext */): Promise<Cat[]> {
		return CatService.findAll();
	}
}
