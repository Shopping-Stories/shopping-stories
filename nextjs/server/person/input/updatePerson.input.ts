import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePersonInput extends Object {
	@Field({ nullable: true, description: 'Variations of given item' })
	account?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	enslaved?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	firstName?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	lastName?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	gender?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	location?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	prefix?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	profession?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	professionCategory?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	reference?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	store?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	suffix?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	variations?: string;

	@Field({ nullable: true })
	professionQualifier?: string;
}
