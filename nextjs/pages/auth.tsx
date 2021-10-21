import {
	AmplifyAuthenticator,
	AmplifySignIn,
	AmplifySignUp,
	AmplifyAuthContainer,
} from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Header from '@components/Header';

const AuthPage: NextPage = () => {
	const router = useRouter();

	const [authState, setAuthState] = useState<any>();
	const [user, setUser] = useState<any>();
	useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			setAuthState(nextAuthState);
			setUser(authData);
		});
	}, []);
	const _thing = authState === AuthState.SignedIn && user;

	const handleAuthStateChange = (state: string) => {
		console.log(_thing);
		if (state === 'signedin') {
			/* Do something when the user has signed-in */
			router.push('/');
		}
	};

	return (
		<>
			<Header />
			<AmplifyAuthContainer>
				<AmplifyAuthenticator handleAuthStateChange={handleAuthStateChange}>
					<AmplifySignUp
						slot="sign-up"
						formFields={[
							{
								type: 'username',
								label: 'Username',
								placeholder: 'Custom username placeholder',
								inputProps: { required: true, autocomplete: 'username' },
							},
							{
								type: 'email',
								label: 'Custom Email Label',
								placeholder: 'Custom email placeholder',
								inputProps: { required: true, autocomplete: 'email' },
							},
							{
								type: 'password',
								label: 'Password',
								placeholder: 'Custom password placeholder',
								inputProps: { required: true, autocomplete: 'new-password' },
							},
							{
								type: 'given_name',
								label: 'First Name',
								placeholder: 'John',
								inputProps: { required: true, autocomplete: 'first name' },
							},
							{
								type: 'family_name',
								label: 'Last Name',
								placeholder: 'Doe',
								inputProps: { required: true, autocomplete: 'last name' },
							},
						]}
					/>
					<AmplifySignIn slot="sign-in" />
				</AmplifyAuthenticator>
			</AmplifyAuthContainer>
		</>
	);
};
export default AuthPage;
