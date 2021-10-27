import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const ItemGlossaryTableRow = (props: { row: any }) => {
	const { row } = props;
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
				<TableCell component="th" scope="row">
					{row.name}
				</TableCell>
				<TableCell align="right">{row.imageKey}</TableCell>
				<TableCell align="right">{row.description}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Related Entries
							</Typography>
							<Table size="small" aria-label="purchases">
								{/* <TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Customer</TableCell>
										<TableCell align="right">Amount</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.history.map((historyRow: any) => (
										<TableRow key={historyRow.date}>
											<TableCell component="th" scope="row">
												{historyRow.date}
											</TableCell>
											<TableCell>{historyRow.customerId}</TableCell>
											<TableCell align="right">{historyRow.amount}</TableCell>
										</TableRow>
									))}
								</TableBody> */}
								<TableHead>
									<TableRow>
										<TableCell>arraything</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.relatedItems.map((related: string, i: number) => (
										<TableRow key={i}>
											<TableCell>{related}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default ItemGlossaryTableRow;