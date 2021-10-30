import 'reflect-metadata';
import {
	Arg,
	Info,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { getMongooseFromFields } from '../config/utils';
import { FindAllLimitAndSkip } from '../glossaryItem/input/findAllArgs.input';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { CreateTobaccoMarkInput } from './input/createTobaccoMark.input';
import { UpdateTobaccoMarkInput } from './input/updateTobaccoMark.input';
import { TobaccoMark } from './tobaccoMark.schema';
import TobaccoMarkService from './tobaccoMark.service';

@Resolver((_of) => TobaccoMark)
export default class TobaccoMarkResolver {
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [TobaccoMark], { nullable: true })
	async findTobaccoMarks(
		@Arg('options', { nullable: true }) { limit, skip }: FindAllLimitAndSkip,
		@Arg('search', { nullable: true }) search: string,
		@Info() info: any,
	): Promise<TobaccoMark[]> {
		return TobaccoMarkService.findAll(
			skip,
			limit,
			getMongooseFromFields(info),
			search,
		);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => Number)
	async countTobaccoMarks(
		@Arg('search', { nullable: true }) search: string,
	): Promise<number> {
		return TobaccoMarkService.count(search);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => TobaccoMark, { nullable: true })
	async findOneTobaccoMark(
		@Arg('id') id: string,
		@Info() info: any,
	): Promise<TobaccoMark | null> {
		return TobaccoMarkService.findOne(id, getMongooseFromFields(info));
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => TobaccoMark)
	async createTobaccoMark(
		@Arg('tobaccoMark') newTobaccoMark: CreateTobaccoMarkInput,
	): Promise<TobaccoMark> {
		return TobaccoMarkService.create(newTobaccoMark);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => TobaccoMark, { nullable: true })
	async updateTobaccoMark(
		@Arg('id') id: string,
		@Arg('updatedFields') updatedFields: UpdateTobaccoMarkInput,
		@Info() info: any,
	): Promise<TobaccoMark | null> {
		return TobaccoMarkService.updateOne(
			id,
			updatedFields,
			getMongooseFromFields(info),
		);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => TobaccoMark, { nullable: true })
	async deleteTobaccoMark(
		@Arg('id') id: string,
		@Info() info: any,
	): Promise<TobaccoMark | null> {
		return TobaccoMarkService.deleteOne(id, getMongooseFromFields(info));
	}
}
