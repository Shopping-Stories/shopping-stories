import { UseGuards } from '@nestjs/common';
import {
	Resolver,
	Query,
	Mutation,
	Args,
	Parent,
	ResolveField,
	Context,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/current-user';
import { GqlAuthGuard } from '../gqlAuthGuard';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat, CatSchema } from './cat.schema';

@Resolver((of) => Cat)
export class CatResolver {
	constructor(private catsService: CatsService) {}

	@Query((returns) => [Cat], {
		nullable: true,
		description: 'Find all Cats in the database',
	})
	// @UseGuards(GqlAuthGuard)
	async findCats(@CurrentUser() user: any) {
		return this.catsService.findAll();
	}

	@Query((returns) => Cat, {
		nullable: true,
		description: 'Find a Cat by their ID',
	})
	async findCat(@Args('id') id: string) {
		return this.catsService.findOne(id);
	}

	@Mutation((returns) => Cat)
	async createCat(@Args('createCatDto') createCatDto: CreateCatDto) {
		return this.catsService.create(createCatDto);
	}

	// @ResolveField()
	// async id(@Parent() cat: Cat) {
	// 	return cat._id + '';
	// }
}
