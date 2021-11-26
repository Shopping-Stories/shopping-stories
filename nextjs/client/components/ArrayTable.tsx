import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Entry } from 'client/types';
import { isString } from 'lodash';

interface ArrayTableProps {
    headerName?: string;
    headRowLabel: string;
    values: Entry['people'] | Entry['places'] | string[];
}

const ArrayTable = (props: ArrayTableProps) => {
    return (
        <Box sx={{ margin: 1 }}>
            {props.headerName ? (
                <Typography variant="h6" gutterBottom component="div">
                    {props.headerName}
                </Typography>
            ) : null}
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        <TableCell>{props.headRowLabel}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.values.map((value, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {isString(value) ? value : value!.name}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default ArrayTable;
