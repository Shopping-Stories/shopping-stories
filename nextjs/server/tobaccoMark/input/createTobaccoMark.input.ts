import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateTobaccoMarkInput {
	@Field({ description: 'TODO: Fill this in' })
	description: string;

	@Field({ description: 'TODO: Fill this in' })
	image: string;

	@Field({ description: 'TODO: Fill this in' })
	netWeight: string;

	@Field({ description: 'TODO: Fill this in' })
	note: string;

	@Field({ description: 'TODO: Fill this in' })
	notes: string;

	@Field({ description: 'TODO: Fill this in' })
	tobaccoMarkId: string;

	@Field({ description: 'TODO: Fill this in' })
	warehouse: string;

	@Field({ description: 'TODO: Fill this in' })
	where: string;

	@Field({ description: 'TODO: Fill this in' })
	whoRepresents: string;

	@Field({ description: 'TODO: Fill this in' })
	whoUnder: string;
}
