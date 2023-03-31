import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { OptionsType } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import * as React from 'react';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from 'urql';
import TablePaginationActions from './TablePaginationActions';


interface PaginationTableProps<T> {
    queryDef: string;
    search: string;
    setRows: Dispatch<SetStateAction<T[]>>;
    reQuery?: boolean;
    setIsLoading?: Dispatch<SetStateAction<boolean>>;
    setReQuery?: Dispatch<SetStateAction<boolean>>;
    headerRow: JSX.Element;
    bodyRows: JSX.Element[];
}

const PaginationTable = <T extends unknown>(props: PaginationTableProps<T>) => {
    const { queryDef, search, setRows, headerRow, bodyRows, setIsLoading } =
        props;

    const [page, setPage] = useState(0);
    const perPageOptions = [10, 25, 50, 100];
    const [rowsPerPage, setRowsPerPage] = useState(perPageOptions[0]);

    const [options, setOptions] = useState<OptionsType>({
        limit: rowsPerPage,
        skip: null,
    });

    interface QueryType {
        rows: T[];
        count: number;
    }

    const [{ data, stale, fetching }, updateQuery] = useQuery<QueryType>({
        query: queryDef,
        variables: { options, search },
        requestPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (props.reQuery && props.setReQuery !== undefined) {
            updateQuery({ requestPolicy: 'network-only' });
            props.setReQuery(false);
        }
    }, [props.reQuery]);

    useEffect(() => {
        if (setIsLoading !== undefined) {
            setIsLoading(stale || fetching);
        }
    }, [stale, fetching]);

    useEffect(() => {
        setPage(0);
        setOptions((prevOpts) => ({
            ...prevOpts,
            skip: 0,
        }));
    }, [search]);

    const count = data?.count ?? 0;

    useEffect(() => {
        if (data && data.rows) {
            setRows(cloneWithoutTypename(data.rows));
        }
    }, [data?.rows]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

    const handleChangePage = (
        _: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setOptions((prevOpts) => ({
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
        setOptions((prevOpts) => ({
            ...prevOpts,
            limit: newRowsPerPage,
            skip: 0,
        }));
    };
    
    // console.log(bodyRows)
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '100vh' }}>
                <Table sx={{ minWidth: '100vh' }} stickyHeader>
                    <TableHead>{headerRow}</TableHead>
                    <TableBody>
                        {bodyRows.map((row) => row)}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {stale || fetching ? <LinearProgress /> : null}
            <TablePagination
                rowsPerPageOptions={perPageOptions}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                }}
                component="div"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
        </Paper>
    );
};

export default PaginationTable;
