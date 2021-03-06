import { Roles } from 'config/constants.config';
import 'reflect-metadata';
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
import { getMongooseFromFields } from '../config/utils';
import { FindAllLimitAndSkip } from '../findAllArgs.input';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { CreatePersonInput } from './input/createPerson.input';
import { UpdatePersonInput } from './input/updatePerson.input';
import { Person } from './person.schema';
import PersonService from './person.service';

@Resolver((_of) => Person)
export default class PersonResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => [Person], { nullable: true })
    async findPeople(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ): Promise<Person[]> {
        return PersonService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Number)
    async countPeople(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return PersonService.count(search);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Person, { nullable: true })
    async findOnePerson(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Person | null> {
        return PersonService.findOne(id, getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => Person)
    async createPerson(
        @Arg('person') newPerson: CreatePersonInput,
    ): Promise<Person> {
        return PersonService.create(newPerson);
    }

    @FieldResolver(() => String)
    fullName(@Root() person: Person): string {
        return `${person.firstName || ''} ${person.lastName || ''}`.trim();
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin, Roles.Moderator])
    @Mutation((_returns) => Person, { nullable: true })
    async updatePerson(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdatePersonInput,
        @Info() info: any,
    ): Promise<Person | null> {
        return PersonService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => Person, { nullable: true })
    async deletePerson(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Person | null> {
        return PersonService.deleteOne(id, getMongooseFromFields(info));
    }
}
