import 'reflect-metadata';
import { Authorized, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Cat, CatModel } from './cat.schema';
import { CatService } from './cat.service';
import { Roles } from '../middleware/auth.middleware';
import { MyContext } from '../../pages/api/graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';

@Resolver((of) => Cat)
export default class CatResolver {
	private catService: CatService;

	constructor() {
		this.catService = new CatService(CatModel);
	}

	@Authorized([Roles.Admin, Roles.Moderator])
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((returns) => [Cat], { nullable: true })
	async findCats(@Ctx() context: MyContext): Promise<Cat[]> {
		return this.catService.findAll();
	}
}
