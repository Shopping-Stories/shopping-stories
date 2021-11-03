import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { CognitoConfig } from '../../config/constants.config';
import { LoginInput } from './input/login.input';
import { RegisterInput } from './input/register.input';

export class UserService {
    private userPool: CognitoUserPool;
    constructor() {
        this.userPool = new CognitoUserPool({
            UserPoolId: CognitoConfig.UserPoolId,
            ClientId: CognitoConfig.ClientId,
        });
    }

    loginUser({ username, password }: LoginInput): Promise<CognitoUserSession> {
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

    registerUser(registerRequest: RegisterInput) {
        const { name, email, password, family_name, given_name } =
            registerRequest;
        return new Promise((resolve, reject) => {
            return this.userPool.signUp(
                name,
                password,
                [
                    new CognitoUserAttribute({ Name: 'email', Value: email }),
                    new CognitoUserAttribute({
                        Name: 'family_name',
                        Value: family_name,
                    }),
                    new CognitoUserAttribute({
                        Name: 'given_name',
                        Value: given_name,
                    }),
                ],
                // @ts-ignore
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

    // refreshTokens(refresh: string, decodedAccessToken): Promise<CognitoUserSession> {
    // 	const token = new CognitoRefreshToken({ RefreshToken: refresh })
    // 	const user = this.userPool.getCurrentUser();

    // 	this.userPool.
    // 	.makeUnauthenticatedRequest('initiateAuth', {
    // 	ClientId: this.authConfig.clientId,
    // 	AuthFlow: 'REFRESH_TOKEN_AUTH',
    // 	AuthParameters: {
    // 		'REFRESH_TOKEN': token // client refresh JWT
    // 	}
    // 	}, (err, authResult) => {
    // 	if (err) {
    // 		console.error(err);
    // 	}
    // 		console.log(authResult); // contains new session
    // 	})
    // 	console.log(user);
    // 	return new Promise((resolve, reject) => {
    // 		user.refreshSession(token, (err, session) => {
    // 			if (err) reject(err);
    // 			console.log(typeof session)
    // 			resolve(session);
    // 		});
    // 	});
    // }
}
