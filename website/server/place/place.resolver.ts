import { Roles } from 'config/constants.config';
import 'reflect-metadata';
import {
    Arg,
    Authorized,
    Info,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { getMongooseFromFields } from '../config/utils';
import { FindAllLimitAndSkip } from '../findAllArgs.input';
import { ConnectDB, ResolveTime } from '../middleware/misc.middleware';
import { CreatePlaceInput } from './input/createPlace.input';
import { UpdatePlaceInput } from './input/updatePlace.input';
import { Place } from './place.schema';
import PlaceService from './place.service';

@Resolver((_of) => Place)
export default class PlaceResolver {
    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => [Place], { nullable: true })
    async findPlaces(
        @Arg('options', { nullable: true })
        { limit, skip }: FindAllLimitAndSkip,
        @Arg('search', { nullable: true }) search: string,
        @Info() info: any,
    ): Promise<Place[]> {
        return PlaceService.findAll(
            skip,
            limit,
            getMongooseFromFields(info),
            search,
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Number)
    async countPlaces(
        @Arg('search', { nullable: true }) search: string,
    ): Promise<number> {
        return PlaceService.count(search);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Query((_returns) => Place, { nullable: true })
    async findOnePlace(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Place | null> {
        return PlaceService.findOne(id, getMongooseFromFields(info));
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => Place)
    async createPlace(
        @Arg('place') newPlace: CreatePlaceInput,
    ): Promise<Place> {
        return PlaceService.create(newPlace);
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin, Roles.Moderator])
    @Mutation((_returns) => Place, { nullable: true })
    async updatePlace(
        @Arg('id') id: string,
        @Arg('updatedFields') updatedFields: UpdatePlaceInput,
        @Info() info: any,
    ): Promise<Place | null> {
        return PlaceService.updateOne(
            id,
            updatedFields,
            getMongooseFromFields(info),
        );
    }

    @UseMiddleware(ConnectDB, ResolveTime)
    @Authorized([Roles.Admin])
    @Mutation((_returns) => Place, { nullable: true })
    async deletePlace(
        @Arg('id') id: string,
        @Info() info: any,
    ): Promise<Place | null> {
        return PlaceService.deleteOne(id, getMongooseFromFields(info));
    }
}
