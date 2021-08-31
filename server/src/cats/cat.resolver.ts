import {
	Resolver,
	Query,
	Mutation,
	Args,
	Parent,
	ResolveField,
} from '@nestjs/graphql';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';

@Resolver((of) => Cat)
export class CatResolver {
	constructor(private catsService: CatsService) {}

	@Query((returns) => [Cat], { nullable: true })
	async findCats() {
		return this.catsService.findAll();
	}

	@Query(returns => Cat)
	async findCat(@Args('id') id: string) {
		return this.catsService.findOne(id);
	}

	@Mutation((returns) => Cat)
	async createCat(@Args('createCatDto') createCatDto: CreateCatDto) {
		return this.catsService.create(createCatDto);
	}

	@ResolveField()
	async id(@Parent() cat: Cat) {
		return cat._id + '';
	}
}
