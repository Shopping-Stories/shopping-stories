import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateCatDto {
	@Field()
	name: string;
	@Field()
	age: number;
	@Field()
	breed: string;
}
