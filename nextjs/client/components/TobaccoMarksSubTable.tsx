import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { RegularEntry } from 'client/types';

const TobaccoMarksRow = (props: {
    tobaccoMark: RegularEntry['tobaccoMarks'][0];
}) => {
    const { tobaccoMark } = props;

    // const columnValues = [tobaccoMark?.markName, tobaccoMark?.markID];
    const columnValues = [tobaccoMark?.markName];

    return (
        <TableRow>
            {columnValues.map((value, i) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const TobaccoMarksSubTable = (props: {
    tobaccoMarks: RegularEntry['tobaccoMarks'];
}) => {
    // const columnNames: string[] = ['Mark Name', 'Mark ID'];
    const columnNames: string[] = ['Mark Name'];
    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Tobacco Marks
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        {columnNames.map((name, i) => {
                            return <TableCell key={i}>{name}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.tobaccoMarks &&
                        props.tobaccoMarks.map((mark, i) => (
                            <TobaccoMarksRow key={i} tobaccoMark={mark} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default TobaccoMarksSubTable;
