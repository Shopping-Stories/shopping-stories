import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { __prod__ } from '../util/constants';
import { AuthConfig } from './auth.config';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
// 	let resolver: AuthResolver;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			imports: [
// 				ConfigModule.forRoot({
// 					isGlobal: true,
// 					envFilePath: `config/.env.${__prod__ ? 'production' : 'development'}`,
// 				}),
// 			],
// 			providers: [AuthConfig, AuthService, AuthResolver],
// 		}).compile();

// 		resolver = module.get<AuthResolver>(AuthResolver);
// 	});

	it('should be defined', () => {
// 		expect(resolver).toBeDefined();
	});
});
