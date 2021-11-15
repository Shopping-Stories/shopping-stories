import 'reflect-metadata';
import { getMongooseFromFields } from 'server/config/utils';
import { FindAllLimitAndSkip } from 'server/glossaryItem/input/findAllArgs.input';
import { advancedSearch } from 'server/spreadsheet/spreadsheet.service';
import {
    Arg,
    Info,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { Entry } from './entry.schema';
import { EntryService } from './entry.service';
import { AdvancedSearchInput } from './input/advancedSearch.input';
import { CreateEntryInput } from './input/createEntry.input';
import { UpdateEntryInput } from './input/updateEntry.input';

@Resolver((_of) => Entry)
export default class EntryResolver {
    // @UseMiddleware(Auth, ResolveTime)
    @UseMiddleware(ResolveTime, ConnectDB)
    @Query((_returns) => [Entry], {
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
    @Query((_returns) => [Object], {
        nullable: true,
        description: 'Search all Entries in the database',
    })
    async advancedFindEntries(
        // @Arg('options', { nullable: true })
        // { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: AdvancedSearchInput,
        // @Info() info: any,
    ): Promise<any> {
        return advancedSearch(search);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query((_returns) => Number)
    async countEntries(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return EntryService.count(search);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Query((_returns) => Entry, {
        nullable: true,
        description: 'Find an entry by id',
    })
    async findEntry(@Arg('id') id: string) {
        return EntryService.findOne(id);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Mutation((_returns) => Entry)
    async createEntry(
        @Arg('createEntryInput') createEntryInput: CreateEntryInput,
    ) {
        (createEntryInput.people as any[]).map((person: any) => {
            if (!Boolean(person.id)) {
                delete person.id;
            }
            return person;
        });
        (createEntryInput.places as any[]).map((place: any) => {
            if (!Boolean(place.id)) {
                delete place.id;
            }
            return place;
        });

        if (createEntryInput.regularEntry) {
            (createEntryInput.regularEntry as any).tobaccoMarks.map(
                (mark: any) => {
                    if (!Boolean(mark.markID)) {
                        delete mark.markID;
                    }
                    return mark;
                },
            );
        }

        if (createEntryInput.tobaccoEntry) {
            (createEntryInput.tobaccoEntry as any).marks.map((mark: any) => {
                if (!Boolean(mark.markID)) {
                    delete mark.markID;
                }
                return mark;
            });
        }

        return EntryService.create(createEntryInput);
    }

    @UseMiddleware(ResolveTime, ConnectDB)
    @Mutation((_returns) => [Entry])
    async createEntries(
        @Arg('entries', (_type) => [CreateEntryInput], { nullable: 'items' })
        entries: CreateEntryInput[],
    ) {
        return EntryService.createEntries(entries);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation((_returns) => Entry, { nullable: true })
    async updateEntry(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdateEntryInput,
        @Info() info: any,
    ): Promise<Entry | null> {
        (updatedFields.people as any[]).map((person: any) => {
            if (!Boolean(person.id)) {
                delete person.id;
            }
            return person;
        });
        (updatedFields.places as any[]).map((place: any) => {
            if (!Boolean(place.id)) {
                delete place.id;
            }
            return place;
        });

        if (updatedFields.regularEntry) {
            (updatedFields.regularEntry as any).tobaccoMarks.map(
                (mark: any) => {
                    if (!Boolean(mark.markID)) {
                        delete mark.markID;
                    }
                    return mark;
                },
            );
        }

        if (updatedFields.tobaccoEntry) {
            (updatedFields.tobaccoEntry as any).marks.map((mark: any) => {
                if (!Boolean(mark.markID)) {
                    delete mark.markID;
                }
                return mark;
            });
        }

        if (
            updatedFields.dateInfo &&
            !Boolean(updatedFields?.dateInfo?.fullDate)
        ) {
            delete updatedFields.dateInfo.fullDate;
        }

        return EntryService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Mutation((_returns) => Entry, { nullable: true })
    async deleteEntry(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Entry | null> {
        return EntryService.deleteOne(id, getMongooseFromFields(info));
    }
}
