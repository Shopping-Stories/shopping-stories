import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class InputDate {
	@Field((type) => Int, {description: "day of date"})
	day: number;

	@Field((type) => Int, {description: "month of date"})
	month: number;

	@Field((type) => Int, {description: "year of date"})
	year: number;

	@Field((type) => Date, {description: "complete date"})
	date: Date;
}

@InputType()
export class CreateEntryDto {
	@Field((type) => Int)
	Reel: number;

	@Field((type) => String, { description: 'Store Owner' })
	Owner: string;

	@Field((type) => String, { description: 'Name of Store' })
	Store: string;

	@Field((type) => Int, { description: 'Year the entry was made' })
	Year: [number];

	@Field((type) => Int, { description: 'Folio the entry is contained in' })
	FolioPage: number;

	@Field((type) => String, { description: 'ID of entry within Folio' })
	EntryID: string;

	@Field((type) => String, { description: 'Prefix of account holder\'s name' })
	Prefix: string;

	@Field((type) => String, { description: 'First name of account holder' })
	AccountFirstName: string;

	@Field((type) => String, { description: 'Last name of account holder' })
	AccountLastName: string;

	@Field((type) => String, { description: 'Suffix of account holder' })
	Suffix: string;

	@Field((type) => String, { description: 'Profession of account holder' })
	Profession: string;

	@Field((type) => String, { description: 'Location?' })
	Location: string;

	@Field((type) => String, { description: 'Reference?' })
	Reference: string;

	@Field((type) => String, { description: 'Debt or Credit transaction' })
	DrCr: string;

	@Field((type) => InputDate, { description: 'Date of entry' })
	Date: InputDate;

	// Entry: Object;

	@Field((type) => [String], { description: 'People referenced in this entry' })
	People: [string];

	@Field((type) => [String], { description: 'Places referenced in this entry' })
	Places: [string];

	@Field((type) => Int, { description: 'Reference to another Folio page' })
	FolioReference: number;

	@Field((type) => Int, { description: 'Type of Entry' })
	EntryType: number;

	@Field((type) => String, { description: 'Ledger containing this Entry' })
	Ledger: string;

	@Field((type) => Int, { description: 'Quantity of commodity purchased' })
	Quantity: number;

	@Field((type) => String, { description: 'Commodity being purchased' })
	Commodity: string

	@Field((type) => Int, { description: 'Sterling pounds used in transaction' })
	L1: number;

	@Field((type) => Int, { description: 'Sterling shillings used in transaction' })
	S1: number;

	@Field((type) => Int, { description: 'Sterling pence used in transaction' })
	D1: number;

	@Field((type) => String, { description: 'Type of Colonial currency' })
	Colony: string;

	@Field((type) => Int, { description: 'Colonial pounds used in transaction' })
	L2: number;

	@Field((type) => Int, { description: 'Colonial shillings used in transaction' })
	S2: number;

	@Field((type) => Int, { description: 'Colonial pence used in transaction' })
	D2: number;

	@Field((type) => Int, { description: 'Indicates if item would survive till today' })
	ArchMat: number;

	@Field((type) => Int, { description: 'Indicates if someone or someplace is mentioned in the entry' })
	GenMat: number;

	@Field((type) => String, { description: 'comments on the entry' })
	Final: string;
}