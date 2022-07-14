import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface PaginationRowUsersProps<T> {
    isAdmin: boolean;
    isAdminOrModerator: boolean;
    row: T;
    cellValues: string[];
    onEditClick: (doc: T) => void;
    onEnableDisableClick: (doc: T) => void;
}

const PaginationTableRowUsers = <T extends unknown>(
    props: PaginationRowUsersProps<T>,
) => {
    const {
        row,
        onEditClick,
        onEnableDisableClick: onEnableDisableClick,
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
                        onClick={() => onEnableDisableClick(row)}
                    >
                        Enable/Disable
                    </Button>
                </TableCell>
            ) : null}
            {cellValues.map((val, i) => (
                <TableCell key={i}>{val}</TableCell>
            ))}
        </TableRow>
    );
};

export default PaginationTableRowUsers;
