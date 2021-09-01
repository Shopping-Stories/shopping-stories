import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path/posix';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { __prod__ } from './util/constants';
import { AuthModule } from './auth/auth.module';

@Module({
	// corss-env
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config/.env.${__prod__ ? 'production' : 'development'}`,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			connectionName: 'cats',
			useFactory: async (configService: ConfigService) => {
				return {
					uri: configService.get<string>('MONGODB_URI2'),
					connectionName: 'cats',
				};
			},
			inject: [ConfigService],
		}),
		GraphQLModule.forRoot({
			// autoSchemaFile: true,
			autoSchemaFile: './src/schema.gql', // join(process.cwd(), 'src/schema.gql')
			sortSchema: true,
		}),
		CatsModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
