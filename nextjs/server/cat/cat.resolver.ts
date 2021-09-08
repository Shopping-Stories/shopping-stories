import 'reflect-metadata';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Cat, CatModel } from './cat.schema';
import { CatService } from './cat.service';
import {
	AuthGuard,
	Auth,
	ResolveTime,
	ConnectDB,
	ConnectDB2,
} from '../auth/AuthGuard';
import { MyContext } from '../../pages/api/graphql';

@Resolver((of) => Cat)
export default class CatResolver {
	private catService: CatService;

	constructor() {
		this.catService = new CatService(CatModel);
	}

	// @UseMiddleware(Auth, ResolveTime)
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((returns) => [Cat], { nullable: true })
	async findCats(@Ctx() context: MyContext): Promise<Cat[]> {
		return this.catService.findAll();
	}
}
