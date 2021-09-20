import { Query, Resolver } from 'type-graphql';

@Resolver()
export default class HelloResolver {
	@Query((_returns) => String)
	async hello() {
		return 'hello';
	}
}
