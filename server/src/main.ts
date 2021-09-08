import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { __prod__ } from './util/constants';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	// app.use(helmet());
	await app.listen(4000);
}
bootstrap();
