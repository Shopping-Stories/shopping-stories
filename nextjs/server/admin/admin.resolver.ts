import 'reflect-metadata';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Roles } from '../middleware/auth.middleware';
import AdminService from './admin.service';

@Resolver()
export default class AdminResolver {
	@Authorized([Roles.Admin])
	@Mutation((_returns) => Object, { nullable: true })
	async signUserOut(@Arg('username') username: string): Promise<Object> {
		return AdminService.signUserOut(username);
	}

	@Authorized([Roles.Admin])
	@Mutation((_returns) => Object, { nullable: true })
	async confirmUserSignUp(@Arg('username') username: string): Promise<Object> {
		return AdminService.confirmUserSignUp(username);
	}

	@Authorized([Roles.Admin])
	@Mutation((_returns) => Object, { nullable: true })
	async disableUser(@Arg('username') username: string): Promise<Object> {
		return AdminService.disableUser(username);
	}

	@Authorized([Roles.Admin])
	@Mutation((_returns) => Object, { nullable: true })
	async enableUser(@Arg('username') username: string): Promise<Object> {
		return AdminService.enableUser(username);
	}

	@Authorized([Roles.Admin])
	@Query((_returns) => Object, { nullable: true })
	async getUser(@Arg('username') username: string): Promise<Object> {
		return AdminService.getUser(username);
	}

	@Authorized([Roles.Admin])
	@Query((_returns) => Object, { nullable: true })
	async listUsers(
		@Arg('limit', { nullable: true, defaultValue: undefined }) limit?: number,
		@Arg('paginationToken', { nullable: true, defaultValue: undefined })
		paginationToken?: string,
	): Promise<Object> {
		return AdminService.listUsers(limit, paginationToken);
	}

	@Authorized([Roles.Admin])
	@Query((_returns) => Object, { nullable: true })
	async listGroups(
		@Arg('limit', { nullable: true, defaultValue: undefined }) limit: number,
		@Arg('paginationToken', { nullable: true, defaultValue: undefined })
		paginationToken: string,
	): Promise<Object> {
		return AdminService.listGroups(limit, paginationToken);
	}

	@Authorized([Roles.Admin])
	@Query((_returns) => Object, { nullable: true })
	async listGroupsForUser(
		@Arg('username') username: string,
		@Arg('limit', { nullable: true, defaultValue: undefined }) limit: number,
		@Arg('nextToken', { nullable: true, defaultValue: undefined })
		nextToken: string,
	): Promise<Object> {
		return AdminService.listGroupsForUser(username, limit, nextToken);
	}

	@Authorized([Roles.Admin])
	@Query((_returns) => Object, { nullable: true })
	async listUsersInGroup(
		@Arg('groupname') groupname: string,
		@Arg('limit', { nullable: true, defaultValue: undefined }) limit: number,
		@Arg('nextToken', { nullable: true, defaultValue: undefined })
		nextToken: string,
	): Promise<Object> {
		return AdminService.listGroupsForUser(groupname, limit, nextToken);
	}

	@Authorized([Roles.Admin])
	@Mutation((_returns) => Object, { nullable: true })
	async addUserToGroup(
		@Arg('username') username: string,
		@Arg('groupname') groupname: string,
	): Promise<Object> {
		return AdminService.addUserToGroup(username, groupname);
	}

	@Authorized([Roles.Admin])
	@Mutation((_returns) => Object, { nullable: true })
	async removeUserFromGroup(
		@Arg('username') username: string,
		@Arg('groupname') groupname: string,
	): Promise<Object> {
		return AdminService.removeUserFromGroup(username, groupname);
	}
}
