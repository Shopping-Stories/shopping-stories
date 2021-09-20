import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { useState } from 'react';

// You can get the current config object
// const currentConfig = Auth.configure();

const Congito3 = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const onSubmit = async (event: any) => {
		event.preventDefault();
		try {
			const user = await Auth.signIn(username, password);
			(user as CognitoUser).getSession((err: any, session: any) => {
				if (err) {
					console.log(err);
				} else {
					console.log(session.getAccessToken().getJwtToken());
				}
			});
		} catch (error) {
			console.log('error signing in', error);
		}
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<label htmlFor="email">Username</label>
				<input
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				></input>
				<label htmlFor="password">Password</label>
				<input
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				></input>

				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Congito3;
