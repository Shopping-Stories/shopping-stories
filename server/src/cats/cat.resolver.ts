import { Resolver, Query } from "@nestjs/graphql";
import { CatsService } from "./cats.service";
import { Cat } from "./schemas/cat.schema";

@Resolver(of => Cat)
export class CatResolver {
    constructor(private catsService: CatsService) {}

    @Query(returns =>  [Cat], {nullable: true})
    async findCat() {
        return this.catsService.findAll();
    }
}