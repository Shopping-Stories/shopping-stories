import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { __prod__ } from './util/constants';

@Module({
	// corss-env
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${__prod__ ? "production" : "development"}`
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			connectionName: 'cats',
			useFactory: async (configService: ConfigService) => {
				return {
					uri: configService.get<string>("MONGODB_URI"),
					connectionName: 'cats'
				}
			},
			inject: [ConfigService]
		}),
		CatsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
