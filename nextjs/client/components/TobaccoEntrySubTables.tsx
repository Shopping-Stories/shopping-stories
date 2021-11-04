import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const MarksRow = (props: { mark: any }) => {
    const { mark } = props;

    const columnValues: any[] = [mark?.markString, mark?.markID];
    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const MarksTable = (props: { marks: any }) => {
    const columnNames: string[] = ['Mark', 'Mark ID'];

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
                        props.marks.map((mark: any, i: number) => (
                            <MarksRow key={i} mark={mark} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const MoneyRow = (props: { money: any }) => {
    const { money } = props;

    const columnValues: any[] = [
        money?.moneyType,
        money?.tobaccoMark,
        money.caskInTransaction,
    ];
    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const MoneyTable = (props: { money: any }) => {
    const columnNames: string[] = [
        'Money Type',
        'Tobacco Mark',
        'Cask in Transaction',
    ];

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Money
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
                    {props.money &&
                        props.money.map((money: any, i: number) => (
                            <MoneyRow key={i} money={money} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const NoteRow = (props: { note: any }) => {
    const { note } = props;

    const columnValues: any[] = [
        note?.noteNum,
        note?.totalWeight,
        note?.barrelWeight,
        note?.tobaccoWeight,
    ];
    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const NotesTable = (props: { notes: any }) => {
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
