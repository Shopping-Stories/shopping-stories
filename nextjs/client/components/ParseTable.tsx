import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ParsingResultTableRow from './ParsingResultTableRow';

interface ParseTableProps {
	entries: null | any[];
	handleOpen: (index: number) => any;
}

const ParseTable = (props: ParseTableProps) => {
	const { entries, handleOpen: _ } = props;

	const columnNames = [
		'Account Holder First Name',
		'Account Holder Last Name',
		'Account Holder Prefix',
		'Account Holder Suffix',
		'Debt or Credit',
		'Location',
		'Account Holder Profession',
		'Account Holder Reference',
		'Account Holder ID',
		'Day',
		'Month',
		'Year',
		'Date',
		'EntryID (Meta)',
		'Ledger (Meta)',
		'Reel (Meta)',
		'FolioPage (Meta)',
		'Owner',
		'Store',
		'Year',
		'Comments',
		'Money.Colony',
		'Money.Quantity',
		'Money.Commodity',
		'Money.Currency.Pounds',
		'Money.Currency.Shilling',
		'Money.Currency.Pence',
		'Money.Sterling.Pounds',
		'Money.Sterling.Shilling',
		'Money.Sterling.Pence',
	];

	return (
		<>
			{entries && (
				<TableContainer component={Paper} sx={{ maxHeight: '80%'}}>
					<Table stickyHeader sx={{ minWidth: '20%' }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell/>
								<TableCell>Index</TableCell>
								{columnNames.map((name: string, i: number) => (
									<TableCell key={i} align="right">{name}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{entries.map((row: any, i: number) => {
								return (
									<ParsingResultTableRow index={i} row={row} key={i} />
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
};

export default ParseTable;
