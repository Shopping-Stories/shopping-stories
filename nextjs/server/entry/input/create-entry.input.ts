import { Field, InputType, Int } from 'type-graphql';

@InputType('InputMoney')
export class InputMoney {
	@Field({ description: 'Number of pounds' })
	L: number;

	@Field({ description: 'Number of shillings' })
	S: number;

	@Field({ description: 'Number of Pence' })
	D: number;
}

@InputType('InputItem')
export class InputItem {
	@Field({ description: 'Quantity of item' })
	ItemQuantity: number;

	@Field({ description: 'Item descriptors' })
	Qualifier: string;

	@Field({ description: 'Item name' })
	Item: string;

	@Field({ description: 'Price per unit' })
	UnitPrice: string;

	@Field({ description: '' })
	TransactionCost: string;

	@Field((_type) => InputMoney, { description: 'Money used in transaction' })
	Money: InputMoney;
}

@InputType('InputNote')
export class InputNote {
	@Field({ description: '' })
	NoteNum: number;

	@Field({ description: '' })
	TotalWeight: number;

	@Field({ description: '' })
	BarrelWeight: number;

	@Field({ description: '' })
	TobaccoWeight: number;
}

@InputType('InputTobaccoRate')
export class InputTobaccoRate {
	@Field({ description: '' })
	MoneyType: string;

	@Field({ description: '' })
	TobaccoAmount: number;

	@Field((_type) => InputMoney, { description: '' })
	RateForTobacco: InputMoney;

	@Field({ description: '' })
	CaskInTransaction: number;

	@Field({ description: '' })
	CasksSoldFor: InputMoney;
}

@InputType('InputTobaccoEntry')
export class InputTobaccoEntry {
	@Field({ description: 'words' })
	Entry: string;

	@Field({
		description: 'Signifies which person is represented in the exchange',
	})
	Mark: string;

	@Field((_type) => [InputNote], { description: '' })
	Notes: InputNote[];

	@Field((_type) => [InputTobaccoRate], { description: '' })
	Money: InputTobaccoRate[];
}
@InputType()
export class InputDate {
	@Field((_type) => Int, { description: 'day of date' })
	day: number;

	@Field((_type) => Int, { description: 'month of date' })
	month: number;

	@Field((_type) => Int, { description: 'year of date' })
	year: number;

	@Field((_type) => Date, { description: 'complete date' })
	date: Date;
}

@InputType()
export class CreateEntryInput {
	@Field((_type) => Int)
	Reel: number;

	@Field((_type) => String, { description: 'Store Owner' })
	Owner: string;

	@Field((_type) => String, { description: 'Name of Store' })
	Store: string;

	@Field((_type) => [Int], { description: 'Year the entry was made' })
	Year: [number];

	@Field((_type) => Int, { description: 'Folio the entry is contained in' })
	FolioPage: number;

	@Field((_type) => String, { description: 'ID of entry within Folio' })
	EntryID: string;

	@Field((_type) => String, { description: "Prefix of account holder's name" })
	Prefix: string;

	@Field((_type) => String, { description: 'First name of account holder' })
	AccountFirstName: string;

	@Field((_type) => String, { description: 'Last name of account holder' })
	AccountLastName: string;

	@Field((_type) => String, { description: 'Suffix of account holder' })
	Suffix: string;

	@Field((_type) => String, { description: 'Profession of account holder' })
	Profession: string;

	@Field((_type) => String, { description: 'Location?' })
	Location: string;

	@Field((_type) => String, { description: 'Reference?' })
	Reference: string;

	@Field((_type) => String, { description: 'Debt or Credit transaction' })
	DrCr: string;

	@Field((_type) => InputDate, { description: 'Date of entry' })
	Date: InputDate;

	@Field((_type) => [InputItem], { nullable: true })
	ItemEntry?: InputItem[];

	@Field((_type) => InputTobaccoEntry, { nullable: true })
	TobaccoEntry?: InputTobaccoEntry;

	@Field((_type) => [String], { description: 'People referenced in this entry' })
	People: [string];

	@Field((_type) => [String], { description: 'Places referenced in this entry' })
	Places: [string];

	@Field((_type) => Int, { description: 'Reference to another Folio page' })
	FolioReference: number;

	@Field((_type) => Int, { description: 'Type of Entry' })
	EntryType: number;

	@Field((_type) => String, { description: 'Ledger containing this Entry' })
	Ledger: string;

	@Field((_type) => Int, { description: 'Quantity of commodity purchased' })
	Quantity: number;

	@Field((_type) => String, { description: 'Commodity being purchased' })
	Commodity: string;

	@Field((_type) => Int, { description: 'Sterling pounds used in transaction' })
	L1: number;

	@Field((_type) => Int, {
		description: 'Sterling shillings used in transaction',
	})
	S1: number;

	@Field((_type) => Int, { description: 'Sterling pence used in transaction' })
	D1: number;

	@Field((_type) => String, { description: 'Type of Colonial currency' })
	Colony: string;

	@Field((_type) => Int, { description: 'Colonial pounds used in transaction' })
	L2: number;

	@Field((_type) => Int, {
		description: 'Colonial shillings used in transaction',
	})
	S2: number;

	@Field((_type) => Int, { description: 'Colonial pence used in transaction' })
	D2: number;

	@Field((_type) => Int, {
		description: 'Indicates if item would survive till today',
	})
	ArchMat: number;

	@Field((_type) => Int, {
		description: 'Indicates if someone or someplace is mentioned in the entry',
	})
	GenMat: number;

	@Field((_type) => String, { description: 'comments on the entry' })
	Final: string;
}
