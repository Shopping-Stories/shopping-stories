import { Roles } from 'config/constants.config';
import 'reflect-metadata';
import {
    Arg,
    Authorized,
    Mutation,
    InputType,
    Resolver,
    UseMiddleware,
    Field,
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import parseSpreadsheetObj from './spreadsheet.service';

@InputType()
class ParseObject {
    @Field()
    ledgerName: string;

    @Field(() => Object)
    entries: Object;
}

@Resolver()
export default class SpreadsheetResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => [Object], { nullable: true })
    async importSpreadsheet(
        @Arg('spreadsheetObj', () => ParseObject) sheetObj: any,
    ): Promise<Object[]> {
        console.log(sheetObj);
        const { entries, ledgerName } = sheetObj;

        if (sheetObj) {
            return parseSpreadsheetObj(
                entries[Object.keys(entries)[0]],
                ledgerName,
            );
        }
        // return parseSpreadsheetObj(sheetObj.Sheet1);
        return [];
    }
}
