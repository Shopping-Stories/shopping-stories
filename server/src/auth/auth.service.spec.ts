import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { __prod__ } from '../util/constants';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	// let service: AuthService;

	// beforeEach(async () => {

	// 	const module: TestingModule = await Test.createTestingModule({

	// 		imports: [
	// 			ConfigModule.forRoot({
	// 				isGlobal: true,
	// 				envFilePath: `config/.env.${__prod__ ? 'production' : 'development'}`,
	// 			}),
	// 		],
	// 		providers: [AuthConfig, AuthService],
	// 	}).compile();

	// 	service = module.get<AuthService>(AuthService);
	// });

	it('should be defined', () => {
	// 	expect(service).toBeDefined();
	});
});
