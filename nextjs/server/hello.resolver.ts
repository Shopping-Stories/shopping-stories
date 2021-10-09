import { Query, Resolver } from 'type-graphql';

@Resolver()
export default class HelloResolver {
	@Query((_returns) => String, { description: 'Return the greeting "hello"' })
	async hello() {
		return 'hello';
	}
}
