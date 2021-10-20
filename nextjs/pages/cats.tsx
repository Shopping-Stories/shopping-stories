import { AmplifySignOut } from '@aws-amplify/ui-react';
import LinearProgressWithLabel from '@components/LinearProgressWithLabel';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { useCallback } from 'react';
import { gql, useQuery } from 'urql';
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
		return (
			<Box sx={{ width: '100%' }}>
				<LinearProgressWithLabel value="loading..." />
			</Box>
		);
	}

	console.log(result);

	const cats = result.data ? result.data.findCatsAuth : [];

	return (
		<div>
			<AmplifySignOut />
			<LoadingButton onClick={getCats} loading={result.fetching}>
				get Cats
			</LoadingButton>
			{cats.map((cat: any) => (
				<div key={cat.id}>{cat.name}</div>
			))}
		</div>
	);
};

export default Cats;
