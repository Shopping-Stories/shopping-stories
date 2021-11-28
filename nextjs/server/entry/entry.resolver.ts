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
    AccHolderObject,
    Entry,
    PersonObject,
    PlaceObject,
    TobaccoMarkObject,
} from './entry.schema';
import { EntryService } from './entry.service';
import { AdvancedSearchInput } from './input/advancedSearch.input';
import { CreateEntryInput } from './input/createEntry.input';
import { UpdateEntryInput } from './input/updateEntry.input';

@Resolver(AccHolderObject)
export class AccountHolderResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => Person, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() accountHolder: AccHolderObject,
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

@Resolver(PersonObject)
export class EntryPersonResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => Person, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() person: PersonObject,
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

@Resolver(PlaceObject)
export class EntryPlaceResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => Place, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() place: PlaceObject,
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

@Resolver(TobaccoMarkObject)
export class EntryMarkResolver {
    @Authorized([Roles.Admin, Roles.Moderator])
    @FieldResolver(() => TobaccoMark, {
        nullable: true,
    })
    populate(
        @Info() info: any,
        @Root() mark: TobaccoMarkObject,
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

@Resolver((_of) => Entry)
export default class EntryResolver {
    // @UseMiddleware(Auth, ResolveTime)
    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => [Entry], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async findEntries(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ) {
        return EntryService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => [Entry], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedFindEntries(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: AdvancedSearchInput,
    ): Promise<Entry[]> {
        return EntryService.advancedSearch(search, limit, skip);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Number, {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedCountEntries(
        @Arg('search', { nullable: true }) search: AdvancedSearchInput,
    ): Promise<number> {
        return EntryService.advancedSearch(search, 1, 1, true);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Number)
    async countEntries(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return EntryService.count(search);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query(() => Entry, {
        nullable: true,
        description: 'Find an entry by id',
    })
    async findEntry(@Arg('id') id: string) {
        return EntryService.findOne(id);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Authorized([Roles.Admin])
    @Mutation(() => Entry)
    async createEntry(
        @Arg('createEntryInput') createEntryInput: CreateEntryInput,
    ) {
        return EntryService.create(createEntryInput);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Authorized([Roles.Admin])
    @Mutation(() => [Entry])
    async createEntries(
        @Arg('entries', (_type) => [CreateEntryInput], { nullable: 'items' })
        entries: CreateEntryInput[],
    ) {
        return EntryService.createEntries(entries);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin, Roles.Moderator])
    @Mutation(() => Entry, { nullable: true })
    async updateEntry(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdateEntryInput,
        @Info() info: any,
    ): Promise<Entry | null> {
        return EntryService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation(() => Entry, { nullable: true })
    async deleteEntry(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Entry | null> {
        return EntryService.deleteOne(id, getMongooseFromFields(info));
    }
}
