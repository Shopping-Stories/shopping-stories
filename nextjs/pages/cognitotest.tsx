import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { useState } from 'react';

// You can get the current config object
// const currentConfig = Auth.configure();

const CongitoTest = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState('');
	const onSubmit = async (event: any) => {
		event.preventDefault();
		try {
			const user = await Auth.signIn(username, password);
			(user as CognitoUser).getSession((err: any, session: any) => {
				if (err) {
					console.log(err);
				} else {
					setErrors(session.getAccessToken().getJwtToken());
				}
			});
		} catch (error: any) {
			setErrors(error.message);
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
				<div>{errors}</div>

				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default CongitoTest;
