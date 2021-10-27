import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useQuery } from "urql";
import ItemGlossaryTableRow from "./ItemGlossaryTableRow";
import TablePaginationActions from "./TablePaginationActions";

const ItemGlossaryQuery = `
query glossaryItemsQuery($options: FindAllLimitAndSkip) {
  rows: findGlossaryItems(options: $options) {
  	...glossaryitemfields
  }
  count: countGlossaryItems
}

fragment glossaryitemfields on  GlossaryItem {
  id
  name
  imageKey
  description
  category
  subCategory
  originalPrice
  relatedItems
  relatedPurchases
}
`;

const ItemGlossaryPaginationTable = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	interface OptionsType {
		limit: number | null;
		skip: number | null;
	}

	const [options, setOptions] = useState<OptionsType>({
		limit: rowsPerPage,
		skip: null,
	});

	const [{ data }, _reexecuteQuery] = useQuery({
		query: ItemGlossaryQuery,
		variables: { options },
	});

	const rows = data?.rows ?? [];
	const count = data?.count ?? 0;

	// const [_parseResponse, parseSheet] = useMutation(parseSheetDef);

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

	const handleChangePage = (
		_event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		setOptions({ limit: rowsPerPage, skip: newPage * rowsPerPage });
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const newRowsPerPage = parseInt(event.target.value, 10);
		setRowsPerPage(newRowsPerPage);
		setPage(0);
		setOptions({ limit: newRowsPerPage, skip: 0 });
	};

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Item Name</TableCell>
						<TableCell align="right">Item Key</TableCell>
						<TableCell align="right">Item Description</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* {rows.map((row: any) => (
						<TableRow key={row.id}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.imageKey}</TableCell>
							<TableCell align="right">{row.description}</TableCell>
						</TableRow>
					))} */}
					{rows.map((row:any) => (
						<ItemGlossaryTableRow key={row.id} row={row} />
					))}
					{emptyRows > 0 && (
						<TableRow style={{ height: 53 * emptyRows }}>
							<TableCell colSpan={6} />
						</TableRow>
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, 50]}
							colSpan={3}
							count={count}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									'aria-label': 'rows per page',
								},
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}

export default ItemGlossaryPaginationTable;