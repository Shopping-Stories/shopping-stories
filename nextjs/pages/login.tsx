import React, { useState, useContext } from 'react';
import { AccountContext } from './cognito2';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	let context = useContext(AccountContext);
	if (context === undefined) return <div></div>;

	const { authenticate } = context;

	const onSubmit = (event: any) => {
		event.preventDefault();
		console.log(AccountContext);
		authenticate(email, password)
			.then((data: any) => {
				console.log('Logged in!', data);
			})
			.catch((err: any) => {
				console.error('Failed to login', err);
			});
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<label htmlFor="email">Email</label>
				<input
					value={email}
					onChange={(event) => setEmail(event.target.value)}
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

export default Login;
