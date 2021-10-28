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
import { ItemsMentionedTable } from './ItemEntrySubTables';
import TobaccoMarksTable from './TobaccoMarksTable';

const RegularEntryTable = (props: any) => {
	const { regularEntry } = props;

	return (
		<Box sx={{ margin: 1 }}>
			<Typography variant="h6" gutterBottom component="div">
				Regular Entry
			</Typography>
			<Table size="small" aria-label="purchases">
				<TableHead component="td">
					<TableCell />
					<TableCell>Entry</TableCell>
				</TableHead>
				<TableBody>
					<RegularEntryRow regularEntry={regularEntry}/>
				</TableBody>
			</Table>
		</Box>
	);
};

const RegularEntryRow = ({ regularEntry }: any) => {
	const [open, setOpen] = useState(false);

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
				<TableCell>{regularEntry?.entry}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto">
						{!!regularEntry && (
							<>
								<TobaccoMarksTable tobaccoMarks={regularEntry?.tobaccoMarks} />
								<ItemsMentionedTable
									itemsMentioned={regularEntry?.itemsMentioned}
								/>
							</>
						)}
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default RegularEntryTable;
