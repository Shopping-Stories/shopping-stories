import graphqlFields from 'graphql-fields';
import 'reflect-metadata';
import {
	Arg,
	Info,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { GlossaryItem } from './glossaryItem.schema';
import GlossaryItemService from './glossaryItem.service';
import { CreateGlossaryItemInput } from './input/createGlossaryItem.input';
import { FindAllArgsInput } from './input/findAllArgs.input';
import { UpdateGlossaryItemInput } from './input/updateGlossaryItem.input';

function getMongooseFromFields(info: any, fieldPath = null) {
	const selections = graphqlFields(info);
	const mongooseSelection = Object.keys(
		fieldPath ? selections[fieldPath] : selections,
	).reduce((a, b) => ({ ...a, [b]: 1 }), {});
	return mongooseSelection;
}

@Resolver((_of) => GlossaryItem)
export default class GlossaryItemResolver {
	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => [GlossaryItem], { nullable: true })
	async findGlossaryItems(
		@Arg('options', { nullable: true }) { limit, skip }: FindAllArgsInput,
		@Info() info: any,
	): Promise<GlossaryItem[]> {
		return GlossaryItemService.findAll(
			skip,
			limit,
			getMongooseFromFields(info),
		);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Query((_returns) => GlossaryItem, { nullable: true })
	async findGlossaryItem(
		@Arg('id') id: string,
		@Info() info: any,
	): Promise<GlossaryItem | null> {
		return GlossaryItemService.findOne(id, getMongooseFromFields(info));
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => GlossaryItem)
	async createGlossaryItem(
		@Arg('newGlossaryItem') newItem: CreateGlossaryItemInput,
	): Promise<GlossaryItem> {
		return GlossaryItemService.create(newItem);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => GlossaryItem, { nullable: true })
	async updateGlossaryItem(
		@Arg('id') id: string,
		@Arg('updatedFields') updatedFields: UpdateGlossaryItemInput,
		@Info() info: any,
	): Promise<GlossaryItem | null> {
		return GlossaryItemService.updateOne(
			id,
			updatedFields,
			getMongooseFromFields(info),
		);
	}

	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => GlossaryItem, { nullable: true })
	async deleteGlossaryItem(
		@Arg('id') id: string,
		@Info() info: any,
	): Promise<GlossaryItem | null> {
		return GlossaryItemService.deleteOne(id, getMongooseFromFields(info));
	}
}
