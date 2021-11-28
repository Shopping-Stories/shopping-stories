import { Roles } from 'config/constants.config';
import 'reflect-metadata';
import {
    Arg,
    Authorized,
    Mutation,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import parseSpreadsheetObj from './spreadsheet.service';

@Resolver()
export default class SpreadsheetResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => [Object], { nullable: true })
    async importSpreadsheet(
        @Arg('spreadsheetObj', () => Object) sheetObj: any,
    ): Promise<Object[]> {
        if (sheetObj) {
            return parseSpreadsheetObj(sheetObj[Object.keys(sheetObj)[0]]);
        }
        // return parseSpreadsheetObj(sheetObj.Sheet1);
        return [];
    }
}
