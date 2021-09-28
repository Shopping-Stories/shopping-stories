import {
	AmplifyAuthenticator,
	AmplifySignIn,
	AmplifySignUp,
	AmplifyAuthContainer,
} from '@aws-amplify/ui-react';

const SignUp = () => (
	<AmplifyAuthContainer>
		<AmplifyAuthenticator>
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
);

export default SignUp;
