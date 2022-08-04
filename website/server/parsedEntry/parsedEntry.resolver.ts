import { Roles } from 'config/constants.config';
import 'reflect-metadata';
import { getMongooseFromFields } from 'server/config/utils';
import { FindAllLimitAndSkip } from 'server/findAllArgs.input';
import { Person } from 'server/person/person.schema';
import PersonService from 'server/person/person.service';
import { Place } from 'server/place/place.schema';
import PlaceService from 'server/place/place.service';
import { TobaccoMark } from 'server/tobaccoMark/tobaccoMark.schema';
import TobaccoMarkService from 'server/tobaccoMark/tobaccoMark.service';
import {
    Arg,
    Authorized,
    FieldResolver,
    Info,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import {
    ParsedAccHolderObject,
    ParsedEntry,
    ParsedPersonObject,
    ParsedPlaceObject,
    ParsedTobaccoMarkObject,
} from './parsedEntry.schema';
import { ParsedEntryService } from './parsedEntry.service';
import { ParsedAdvancedSearchInput } from './input/advancedSearch.input';
import { ParsedCreateEntryInput } from './input/createEntry.input';
import { ParsedUpdateEntryInput } from './input/updateEntry.input';

@Resolver(ParsedAccHolderObject)
export class ParsedAccountHolderResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => Person, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() accountHolder: ParsedAccHolderObject,
    ): Promise<Person | null> {
        if (accountHolder.accountHolderID) {
            return PersonService.findOne(
                `${accountHolder.accountHolderID}`,
                getMongooseFromFields(info),
            );
        }
        return Promise.resolve(null);
    }
}

@Resolver(ParsedPersonObject)
export class ParsedEntryPersonResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => Person, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() person: ParsedPersonObject,
    ): Promise<Person | null> {
        if (person.id) {
            return PersonService.findOne(
                `${person.id}`,
                getMongooseFromFields(info),
            );
        }
        return Promise.resolve(null);
    }
}

@Resolver(ParsedPlaceObject)
export class ParsedEntryPlaceResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => Place, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() place: ParsedPlaceObject,
    ): Promise<Place | null> {
        if (place.id) {
            return PlaceService.findOne(
                `${place.id}`,
                getMongooseFromFields(info),
            );
        }
        return Promise.resolve(null);
    }
}

@Resolver(ParsedTobaccoMarkObject)
export class ParsedEntryMarkResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => TobaccoMark, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() mark: ParsedTobaccoMarkObject,
    ): Promise<TobaccoMark | null> {
        if (mark.markID) {
            return TobaccoMarkService.findOne(
                `${mark.markID}`,
                getMongooseFromFields(info),
            );
        }
        return Promise.resolve(null);
    }
}

@Resolver((_of) => ParsedEntry)
export default class ParsedEntryResolver {
    // @UseMiddleware(Auth, ResolveTime)
    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => [ParsedEntry], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async findParsedEntries(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ) {
        return ParsedEntryService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => [ParsedEntry], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedFindParsedEntries(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: ParsedAdvancedSearchInput,
    ): Promise<ParsedEntry[]> {
        return ParsedEntryService.advancedSearch(search, limit, skip);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Number, {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedCountParsedEntries(
        @Arg('search', { nullable: true }) search: ParsedAdvancedSearchInput,
    ): Promise<number> {
        return ParsedEntryService.advancedSearch(search, 1, 1, true);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Number)
    async countParsedEntries(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return ParsedEntryService.count(search);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => ParsedEntry, {
        nullable: true,
        description: 'Find an entry by id',
    })
    async findParsedEntry(@Arg('id') id: string) {
        return ParsedEntryService.findOne(id);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Authorized([Roles.Admin])
    @Mutation(() => ParsedEntry)
    async createParsedEntry(
        @Arg('createEntryInput') createEntryInput: ParsedCreateEntryInput,
    ) {
        return ParsedEntryService.create(createEntryInput);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Authorized([Roles.Admin])
    @Mutation(() => [ParsedEntry])
    async createParsedEntries(
        @Arg('entries', (_type) => [ParsedCreateEntryInput], {
            nullable: 'items',
        })
        entries: ParsedCreateEntryInput[],
    ) {
        return ParsedEntryService.createEntries(entries);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin, Roles.Moderator])
    @Mutation(() => ParsedEntry, { nullable: true })
    async updateParsedEntry(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: ParsedUpdateEntryInput,
        @Info() info: any,
    ): Promise<ParsedEntry | null> {
        return ParsedEntryService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation(() => ParsedEntry, { nullable: true })
    async deleteParsedEntry(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<ParsedEntry | null> {
        return ParsedEntryService.deleteOne(id, getMongooseFromFields(info));
    }
}
