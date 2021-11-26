import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { TobaccoEntry } from 'client/types';

const MarksRow = (props: { mark: TobaccoEntry['marks'][0] }) => {
    const { mark } = props;

    // const columnValues: any[] = [mark?.markName, mark?.markID];
    const columnValues: any[] = [mark?.markName];
    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const MarksTable = (props: { marks: TobaccoEntry['marks'] }) => {
    // const columnNames = ['Mark', 'Mark ID'];
    const columnNames = ['Mark'];

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Marks
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead component="td">
                    <TableRow>
                        {columnNames.map((name: string, i: number) => {
                            return <TableCell key={i}>{name}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.marks &&
                        props.marks.map((mark, i) => (
                            <MarksRow key={i} mark={mark} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const MoneyRow = (props: { money: TobaccoEntry['money'][0] }) => {
    const { money } = props;

    const columnValues = [
        money?.moneyType,
        money?.tobaccoAmount,
        money.casksInTransaction,
        money?.tobaccoSold?.pounds,
        money?.tobaccoSold?.shilling,
        money?.tobaccoSold?.pence,
        money?.rateForTobacco?.pounds,
        money?.rateForTobacco?.shilling,
        money?.rateForTobacco?.pence,
        money?.casksSoldForEach?.pounds,
        money?.casksSoldForEach?.shilling,
        money?.casksSoldForEach?.pence,
    ];
    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const MoneyTable = (props: { money: TobaccoEntry['money'] }) => {
    const columnNames: string[] = [
        'Money Type',
        'Tobacco Amount',
        'Casks in Transactions',
        'Pounds',
        'Shilling',
        'Pence',
        'Pounds',
        'Shilling',
        'Pence',
        'Pounds',
        'Shilling',
        'Pence',
    ];

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Money
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead component="td">
                    <TableRow>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell colSpan={3} align="center">
                            Tobacco Sold
                        </TableCell>
                        <TableCell colSpan={3} align="center">
                            Rate for Tobacco
                        </TableCell>
                        <TableCell colSpan={3} align="center">
                            Casks each sold For
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {columnNames.map((name: string, i: number) => {
                            return <TableCell key={i}>{name}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.money &&
                        props.money.map((money: any, i: number) => (
                            <MoneyRow key={i} money={money} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const NoteRow = (props: { note: TobaccoEntry['notes'][0] }) => {
    const { note } = props;

    const columnValues = [
        note?.noteNum,
        note?.totalWeight,
        note?.barrelWeight,
        note?.tobaccoWeight,
    ];
    return (
        <TableRow>
            {columnValues.map((value, i) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const NotesTable = (props: { notes: TobaccoEntry['notes'] }) => {
    const columnNames: string[] = [
        'Note number',
        'Total Weight',
        'Barrel Weight',
        'Tobacco Weight',
    ];

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Notes
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead component="td">
                    <TableRow>
                        {columnNames.map((name: string, i: number) => {
                            return <TableCell key={i}>{name}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.notes &&
                        props.notes.map((note: any, i: number) => (
                            <NoteRow key={i} note={note} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export { MarksTable, MoneyTable, NotesTable };
