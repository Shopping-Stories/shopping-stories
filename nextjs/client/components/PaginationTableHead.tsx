import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface HeaderRowProps {
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    labels: string[];
}

const PaginationTableHead = (props: HeaderRowProps) => {
    const { isAdmin, isAdminOrModerator, labels } = props;
    return (
        <TableRow>
            {isAdminOrModerator ? <TableCell /> : null}
            {isAdmin ? <TableCell /> : null}
            {labels.map((name, i) => (
                <TableCell key={i}>{name}</TableCell>
            ))}
        </TableRow>
    );
};

export default PaginationTableHead;
