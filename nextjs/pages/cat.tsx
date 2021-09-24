import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useQuery } from 'urql';

const FIND_CATS_QUERY = gql`
	{
		findCatsAuth {
			id
			name
		}
	}
`;

const Cats = () => {
	const [result, executeQuery] = useQuery({
		query: FIND_CATS_QUERY,
		pause: true,
	});

	const getCats = useCallback(() => {
		executeQuery();
	}, [executeQuery]);

	console.log(result);

	const cats = result.data ? result.data.findCatsAuth : [];

	return (
		<div>
			<button onClick={getCats}>get Cats</button>
			{cats.map((cat: any) => (
				<div key={cat.id}>{cat.name}</div>
			))}
		</div>
	);
};

export default Cats;
