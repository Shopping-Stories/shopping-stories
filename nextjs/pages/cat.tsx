import { AmplifySignOut } from '@aws-amplify/ui-react';
import { useCallback } from 'react';
import { gql, useQuery } from 'urql';
import useAuth from '../client/useAuth.hook';
import { Roles } from '../config/constants.config';

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

	const { loading } = useAuth('/', [Roles.Admin]);

	const getCats = useCallback(() => {
		executeQuery();
	}, [executeQuery]);

	if (loading) {
		return <div>Loading...</div>;
	}

	console.log(result);

	const cats = result.data ? result.data.findCatsAuth : [];

	return (
		<div>
			<AmplifySignOut />
			<button onClick={getCats}>get Cats</button>
			{cats.map((cat: any) => (
				<div key={cat.id}>{cat.name}</div>
			))}
		</div>
	);
};

export default Cats;
