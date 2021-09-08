import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { __prod__ } from './util/constants';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core/dist/plugin/landingPage/default';
import { PersonModule } from './person/person.module';
import { EntryModule } from './entry/entry.module';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config/.env.${__prod__ ? 'production' : 'development'}`,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				return {
					uri: configService.get<string>('MONGODB_URI2'),
				};
			},
			inject: [ConfigService],
		}),
		GraphQLModule.forRoot({
			// autoSchemaFile: true,
			autoSchemaFile: './src/schema.gql', // join(process.cwd(), 'src/schema.gql')
			// playground: false,
			// plugins: [ApolloServerPluginLandingPageLocalDefault()],
			// sortSchema: true,
			context: ({ req, res }) => ({ req, res }),
			// cors: {
			// 	origin: 'http://localhost:3000',
			// 	credentials: true,
			// },
		}),
		CatsModule,
		EntryModule,
		AuthModule,
		PersonModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
