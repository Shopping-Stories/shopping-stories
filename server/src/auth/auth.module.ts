import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
	providers: [AuthConfig, AuthService, AuthResolver],
})
export class AuthModule {}
