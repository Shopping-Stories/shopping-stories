import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatResolver } from './cat.resolver';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }], 'cats'),
	],
	providers: [CatsService, CatResolver],
})
export class CatsModule {}
