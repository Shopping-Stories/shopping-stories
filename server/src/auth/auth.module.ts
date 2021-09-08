import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { MyJWTAuthGuard } from './auth.guard';

@Module({
	imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
	providers: [AuthConfig, AuthService, JwtStrategy, AuthResolver],
})
export class AuthModule {}
