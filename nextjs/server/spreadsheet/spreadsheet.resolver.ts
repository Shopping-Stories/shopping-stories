import 'reflect-metadata';
import {
	Arg,
	// Authorized,
	Mutation,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
// import { Roles } from '../middleware/auth.middleware';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import parseSpreadsheetObj from './spreadsheet.service';

@Resolver()
export default class SpreadsheetResolver {
	// @Authorized([Roles.Admin, Roles.Moderator])
	@UseMiddleware(ConnectDB, ResolveTime)
	@Mutation((_returns) => [Object], { nullable: true })
	async importSpreadsheet(
		@Arg('spreadsheetObj', (_returns) => Object) sheetObj: any,
	): Promise<Object[]> {
		console.log(sheetObj);
        // let obj = JSON.parse(sheetObj);
		return parseSpreadsheetObj(sheetObj.Sheet1);
	}
}
