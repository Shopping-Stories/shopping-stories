import { Query, Resolver } from 'type-graphql';

@Resolver()
export default class HelloResolver {
	@Query((returns) => String)
	async hello() {
		return 'hello';
	}
}
