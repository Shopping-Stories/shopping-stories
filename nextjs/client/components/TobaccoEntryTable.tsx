import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { MarksTable, MoneyTable, NotesTable } from './TobaccoEntrySubTables';

const TobaccoEntryTable = (props: any) => {
	const { tobaccoEntry } = props;
	const columnNames = ['Entry', 'Tobacco Shaved'];

	return (
		<Box sx={{ margin: 1 }}>
			<Typography variant="h6" gutterBottom component="div">
				Tobacco Entry
			</Typography>
			<Table size="small" aria-label="purchases">
				<TableHead component="td">
					<TableCell />
					{columnNames.map((name: string, i: number) => (
						<TableCell key={i}>{name}</TableCell>
					))}
				</TableHead>
				<TableBody>
					<TobaccoEntryRow tobaccoEntry={tobaccoEntry} />
				</TableBody>
			</Table>
		</Box>
	);
};

const TobaccoEntryRow = ({ tobaccoEntry }: any) => {
	const [open, setOpen] = useState(false);

    const columnValues = [
        tobaccoEntry?.entry,
        tobaccoEntry?.tobaccoShaved,
    ]
	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{columnValues.map((value: string, i: number) => (
					<TableCell key={i}>{value}</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto">
						{!!tobaccoEntry && (
							<>
								<MarksTable marks={tobaccoEntry?.mark} />
								<MoneyTable money={tobaccoEntry?.money} />
								<NotesTable notes={tobaccoEntry?.notes} />
							</>
						)}
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default TobaccoEntryTable;
