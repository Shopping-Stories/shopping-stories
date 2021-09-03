import { Injectable } from '@nestjs/common';
import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth.config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	private userPool: CognitoUserPool;
	constructor(private readonly authConfig: AuthConfig) {
		this.userPool = new CognitoUserPool({
			UserPoolId: this.authConfig.userPoolId,
			ClientId: this.authConfig.clientId,
		});
	}

	authenticateUser({ username, password }: LoginDto) {
		const name = username;

		const authenticationDetails = new AuthenticationDetails({
			Username: name,
			Password: password,
		});
		const userData = {
			Username: name,
			Pool: this.userPool,
		};

		const newUser = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			return newUser.authenticateUser(authenticationDetails, {
				onSuccess: (result) => {
					resolve(result);
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}

	registerUser(registerRequest: RegisterDto) {
		const { name, email, password, family_name, given_name } = registerRequest;
		return new Promise((resolve, reject) => {
			return this.userPool.signUp(
				name,
				password,
				[
					new CognitoUserAttribute({ Name: 'email', Value: email }),
					new CognitoUserAttribute({ Name: 'family_name', Value: family_name }),
					new CognitoUserAttribute({ Name: 'given_name', Value: given_name }),
				],
				null,
				(error, result) => {
					if (!result) {
						reject(error);
					} else {
						resolve(result.user);
					}
				},
			);
		});
	}
}
