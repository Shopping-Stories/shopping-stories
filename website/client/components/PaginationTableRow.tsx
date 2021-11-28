import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface PaginationRowProps<T> {
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    row: T;
    cellValues: string[];
    onEditClick: (doc: T) => void;
    onDeleteClick: (doc: T) => void;
}

const PaginationTableRow = <T extends unknown>(
    props: PaginationRowProps<T>,
) => {
    const {
        row,
        onEditClick,
        onDeleteClick,
        isAdmin,
        isAdminOrModerator,
        cellValues,
    } = props;

    return (
        <TableRow>
            {isAdminOrModerator ? (
                <TableCell>
                    <Button
                        variant="contained"
                        onClick={() => onEditClick(row)}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                </TableCell>
            ) : null}
            {isAdmin ? (
                <TableCell>
                    <Button
                        variant="contained"
                        onClick={() => onDeleteClick(row)}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </TableCell>
            ) : null}
            {cellValues.map((val, i) => (
                <TableCell key={i}>{val}</TableCell>
            ))}
        </TableRow>
    );
};

export default PaginationTableRow;
