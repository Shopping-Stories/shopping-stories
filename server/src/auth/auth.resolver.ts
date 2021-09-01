import { BadRequestException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation((returns) => String, { nullable: true })
	async register(
		@Args('registerDto')
		registerDto: RegisterDto,
	) {
		console.log(await this.authService.registerUser(registerDto));
		return null;
	}

	@Query((returns) => String, { nullable: true })
	async login(@Args('loginDto') loginDto: LoginDto) {
		try {
			console.log(await this.authService.authenticateUser(loginDto));
			return null;
		} catch (err) {
			throw new BadRequestException(err.message);
		}
	}
}
