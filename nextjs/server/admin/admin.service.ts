import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CognitoConfig } from '../../config/constants.config';
import { logger } from '../config/utils';

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
	region: CognitoConfig.Region,
});
const userPoolId = CognitoConfig.UserPoolId;

const AdminService = {
	async addUserToGroup(username: string, groupname: string) {
		const params = {
			GroupName: groupname,
			UserPoolId: userPoolId,
			Username: username,
		};

		logger.info(`Attempting to add ${username} to ${groupname}`);

		try {
			// @ts-ignore _result is an unused variable
			const _result = await cognitoIdentityServiceProvider
				.adminAddUserToGroup(params)
				.promise();
			logger.info(`Success adding ${username} to ${groupname}`);
			return {
				message: `Success adding ${username} to ${groupname}`,
			};
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async removeUserFromGroup(username: string, groupname: string) {
		const params = {
			GroupName: groupname,
			UserPoolId: userPoolId,
			Username: username,
		};

		logger.info(`Attempting to remove ${username} from ${groupname}`);

		try {
			// @ts-ignore _result is an unused variable
			const _result = await cognitoIdentityServiceProvider
				.adminRemoveUserFromGroup(params)
				.promise();
			logger.info(`Removed ${username} from ${groupname}`);
			return {
				message: `Removed ${username} from ${groupname}`,
			};
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	// Confirms as an admin without using a confirmation code.
	async confirmUserSignUp(username: string) {
		const params = {
			UserPoolId: userPoolId,
			Username: username,
		};

		try {
			// @ts-ignore _result is an unused variable
			const _result = await cognitoIdentityServiceProvider
				.adminConfirmSignUp(params)
				.promise();
			logger.info(`Confirmed ${username} registration`);
			return {
				message: `Confirmed ${username} registration`,
			};
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async disableUser(username: string) {
		const params = {
			UserPoolId: userPoolId,
			Username: username,
		};

		try {
			// @ts-ignore _result is an unused variable
			const _result = await cognitoIdentityServiceProvider
				.adminDisableUser(params)
				.promise();
			logger.info(`Disabled ${username}`);
			return {
				message: `Disabled ${username}`,
			};
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async enableUser(username: string) {
		const params = {
			UserPoolId: userPoolId,
			Username: username,
		};

		try {
			// @ts-ignore _result is an unused variable
			const _result = await cognitoIdentityServiceProvider
				.adminEnableUser(params)
				.promise();
			logger.info(`Enabled ${username}`);
			return {
				message: `Enabled ${username}`,
			};
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async getUser(username: string) {
		const params = {
			UserPoolId: userPoolId,
			Username: username,
		};

		logger.info(`Attempting to retrieve information for ${username}`);

		try {
			const result = await cognitoIdentityServiceProvider
				.adminGetUser(params)
				.promise();
			return result;
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async listUsers(Limit?: number, PaginationToken?: string) {
		const params = {
			UserPoolId: userPoolId,
			...(Limit && { Limit }),
			...(PaginationToken && { PaginationToken }),
		};

		logger.info('Attempting to list users');

		try {
			const result = await cognitoIdentityServiceProvider
				.listUsers(params)
				.promise();

			// Rename to NextToken for consistency with other Cognito APIs
			(result as any).NextToken = result.PaginationToken;
			delete result.PaginationToken;

			return result;
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async listGroups(Limit?: number, PaginationToken?: string) {
		const params = {
			UserPoolId: userPoolId,
			...(Limit && { Limit }),
			...(PaginationToken && { PaginationToken }),
		};

		logger.info('Attempting to list groups');

		try {
			const result = await cognitoIdentityServiceProvider
				.listGroups(params)
				.promise();

			// Rename to NextToken for consistency with other Cognito APIs
			result.NextToken = (result as any).PaginationToken;
			delete (result as any).PaginationToken;

			return result;
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async listGroupsForUser(
		username: string,
		Limit?: number,
		NextToken?: string,
	) {
		const params = {
			UserPoolId: userPoolId,
			Username: username,
			...(Limit && { Limit }),
			...(NextToken && { NextToken }),
		};

		logger.info(`Attempting to list groups for ${username}`);

		try {
			const result = await cognitoIdentityServiceProvider
				.adminListGroupsForUser(params)
				.promise();
			/**
			 * We are filtering out the results that seem to be innapropriate for client applications
			 * to prevent any informaiton disclosure. Customers can modify if they have the need.
			 */
			result?.Groups?.forEach((val) => {
				delete val.UserPoolId,
					delete val.LastModifiedDate,
					delete val.CreationDate,
					delete val.Precedence,
					delete val.RoleArn;
			});

			return result;
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	async listUsersInGroup(
		groupname: string,
		Limit?: number,
		NextToken?: string,
	) {
		const params = {
			GroupName: groupname,
			UserPoolId: userPoolId,
			...(Limit && { Limit }),
			...(NextToken && { NextToken }),
		};

		logger.info(`Attempting to list users in group ${groupname}`);

		try {
			const result = await cognitoIdentityServiceProvider
				.listUsersInGroup(params)
				.promise();
			return result;
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},

	// Signs out from all devices, as an administrator.
	async signUserOut(username: string) {
		const params = {
			UserPoolId: userPoolId,
			Username: username,
		};

		logger.info(`Attempting to signout ${username}`);

		try {
			// @ts-ignore _result is unused
			const _result = await cognitoIdentityServiceProvider
				.adminUserGlobalSignOut(params)
				.promise();
			logger.info(`Signed out ${username} from all devices`);
			return {
				message: `Signed out ${username} from all devices`,
			};
		} catch (err) {
			logger.error(err as any);
			throw err;
		}
	},
};

export default AdminService;
