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
import { CreateCategoryInput } from './input/createCategory.input';
import { UpdateCategoryInput } from './input/updateCategory.input';
import { Category } from './category.schema';
import CategoryService from './category.service';

@Resolver((_of) => Category)
export default class CategoryResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => [Category], { nullable: true })
    async findCategories(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ): Promise<Category[]> {
        return CategoryService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Number)
    async countCategories(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return CategoryService.count(search);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Category, { nullable: true })
    async findOneCategory(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Category | null> {
        return CategoryService.findOne(id, getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation((_returns) => Category)
    async createCategory(
        @Arg('category') newCategory: CreateCategoryInput,
    ): Promise<Category> {
        return CategoryService.create(newCategory);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation((_returns) => Category, { nullable: true })
    async updateCategory(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdateCategoryInput,
        @Info() info: any,
    ): Promise<Category | null> {
        return CategoryService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation((_returns) => Category, { nullable: true })
    async deleteCategory(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Category | null> {
        return CategoryService.deleteOne(id, getMongooseFromFields(info));
    }
}
