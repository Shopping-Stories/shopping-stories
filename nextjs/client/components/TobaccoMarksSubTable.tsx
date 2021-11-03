import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const TobaccoMarksRow = (props: { tobaccoMark: any }) => {
	const { tobaccoMark } = props;

	const columnValues: any[] = [tobaccoMark?.markName, tobaccoMark?.markID];

	return (
		<TableRow>
			{columnValues.map((value: any, i: number) => {
				return <TableCell key={i}>{value}</TableCell>;
			})}
		</TableRow>
	);
};

const TobaccoMarksSubTable = (props: { tobaccoMarks: any }) => {
	const columnNames: string[] = ['Mark Name', 'Mark ID'];
	return (
		<Box sx={{ margin: 1 }}>
			<Typography variant="h6" gutterBottom component="div">
				TobaccoMarks
			</Typography>
			<Table size="small" aria-label="purchases">
				<TableHead>
					<TableRow>
						{columnNames.map((name: string, i: number) => {
							return <TableCell key={i}>{name}</TableCell>;
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					{props.tobaccoMarks &&
						props.tobaccoMarks.map((mark: any, i: number) => (
							<TobaccoMarksRow key={i} tobaccoMark={mark} />
						))}
				</TableBody>
			</Table>
		</Box>
	);
};

export default TobaccoMarksSubTable;
