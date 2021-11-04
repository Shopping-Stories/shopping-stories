import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import TablePaginationActions from './TablePaginationActions';

const CategoryTableRow = (props: any) => {
    const { row, onEditClick, onDeleteClick } = props;
    const rowValues = [row.item, row.category, row.subcategory];
    return (
        <>
            <TableRow>
                <TableCell>
                    <Button
                        variant="contained"
                        onClick={() => onEditClick(row)}
                    >
                        Edit Category
                    </Button>
                </TableCell>
                <TableCell>
                    <Button
                        variant="contained"
                        onClick={() => onDeleteClick(row)}
                    >
                        Delete Category
                    </Button>
                </TableCell>
                {rowValues.map((value: any, i: number) => (
                    <TableCell key={i}>{value}</TableCell>
                ))}
            </TableRow>
        </>
    );
};

const CategoryPaginationTable = (props: any) => {
    const {
        queryDef,
        search,
        onEditClick,
        onDeleteClick,
        setReQuery,
        reQuery,
    } = props;
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

    const [{ data }, executeQuery] = useQuery({
        query: queryDef,
        variables: { options, search },
    });

    useEffect(() => {
        if (reQuery) {
            executeQuery({ requestPolicy: 'network-only' });
            setReQuery(false);
        }
    }, [reQuery]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    const rows = data?.rows ?? [];
    const count = data?.count ?? 0;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setOptions((prevOpts: any) => ({
            ...prevOpts,
            limit: rowsPerPage,
            skip: newPage * rowsPerPage,
        }));
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setOptions((prevOpts: any) => ({
            ...prevOpts,
            limit: newRowsPerPage,
            skip: 0,
        }));
    };

    const columnNames = ['Item', 'Category', 'Subcategory'];

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell />
                        {columnNames.map((name: string, i: number) => (
                            <TableCell key={i}>{name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: any) => (
                        <CategoryTableRow
                            onDeleteClick={onDeleteClick}
                            onEditClick={onEditClick}
                            key={row.id}
                            row={row}
                        />
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
};

export default CategoryPaginationTable;
