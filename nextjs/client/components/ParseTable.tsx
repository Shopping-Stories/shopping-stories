import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface ParseTableProps {
	entries: null | any[];
	handleOpen: (index: number) => any;
}

const ParseTable = (props: ParseTableProps) => {
	const { entries, handleOpen } = props;

	const columnNames = [
		'Entry',
		'Entry.item',
		'Entry.tobacco',
		'Account Holder First Name',
		'Account Holder Last Name',
		'Debt or Credit',
		'Location',
		'Account Holder Profession',
		'Account Holder Reference',
		'Account Holder Prefix',
		'Account Holder Suffix',
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
				<TableContainer component={Paper}>
					<Table stickyHeader sx={{ minWidth: '20%' }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Index</TableCell>
								<TableCell align="right"></TableCell>
								{columnNames.map((name: string, i: number) => (
									<TableCell key={i} align="right">{name}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{entries.map((row: any, i: number) => {
								const columnValues: any[] = [
									Boolean(row?.regularEntry),
									Boolean(row?.itemEntry),
									Boolean(row?.tobaccoEntry),
									row?.accountHolder?.accountFirstName,
									row?.accountHolder?.accountLastName,
									row?.accountHolder?.debitOrCredit,
									row?.accountHolder?.location,
									row?.accountHolder?.profession,
									row?.accountHolder?.reference,
									row?.accountHolder?.prefix,
									row?.accountHolder?.suffix,
									row?.accountHolder?.accountHolderID,
									row?.dateInfo?.day,
									row?.dateInfo?.month,
									row?.dateInfo?.year,
									row?.dateInfo?.fullDate,
									row?.meta?.entryID,
									row?.meta?.ledger,
									row?.meta?.reel,
									row?.meta?.folioPage,
									row?.meta?.owner,
									row?.meta?.store,
									row?.meta?.year,
									row?.money?.colony,
									row?.money?.quantity,
									row?.money?.commodity,
									row?.money?.currency.pounds,
									row?.money?.currency.shilling,
									row?.money?.currency.pence,
									row?.money?.sterling.pounds,
									row?.money?.sterling.shilling,
									row?.money?.sterling.pence,
								];

								return (
									<TableRow
										key={i.toString()}
										sx={{
											'&:last-child td, &:last-child th': { border: 0 },
										}}
									>
										<TableCell component="th" scope="row">
											{i}
										</TableCell>
										<TableCell align="right">
											<Button onClick={() => handleOpen(i)}>View Entry</Button>
										</TableCell>
										{columnValues.map((value: any, i: number) => (
											<TableCell key={i} align="right">{value}</TableCell>
										))}
									</TableRow>
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
