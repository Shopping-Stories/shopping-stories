import Auth from '@aws-amplify/auth';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { isLoggedIn } from '../client/components/util';

const FIND_CATS_QUERY = gql`
	{
		findCatsAuth {
			id
			name
		}
	}
`;

const Cats = () => {
	const router = useRouter();
	const [loginStatus, setLoginStatus] = useState(false);
	const [loadStatus, setLoadStatus] = useState(true);

	const [result, executeQuery] = useQuery({
		query: FIND_CATS_QUERY,
		pause: true,
	});

	const checkLogin = async () => {
		const res = await isLoggedIn(Auth);
		setLoginStatus(res);
		setLoadStatus(false);
	};

	const getCats = useCallback(() => {
		executeQuery();
	}, [executeQuery]);

	useEffect(() => {
		checkLogin();
	}, []); // All the magic is here

	if (!loginStatus && !loadStatus) {
		router.push('/');
	}

	if (loadStatus || !loginStatus) {
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
