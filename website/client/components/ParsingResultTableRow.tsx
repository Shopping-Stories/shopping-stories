import Delete from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Entry } from 'client/types';
import { Fragment, useState } from 'react';
import ArrayTable from './ArrayTable';
import ItemEntriesTable from './ItemEntriesTable';
import RegularEntryTable from './RegularEntryTable';
import TobaccoEntryTable from './TobaccoEntryTable';

interface EntryTableRowProps {
    row: Entry;
    index?: number;
    onEditClick?: any;
    onDeleteClick?: any;
    onParseEdit?: (entry: Entry, index: number) => void;
    isAdmin?: boolean;
    isAdminOrModerator?: boolean;
}
const ParsingResultTableRow = (props: EntryTableRowProps) => {
    const {
        row,
        index,
        onEditClick,
        onParseEdit,
        onDeleteClick,
        isAdmin,
        isAdminOrModerator,
    } = props;
    const [open, setOpen] = useState(false);

    const columnValues: any[] = [
        row?.accountHolder?.accountFirstName,
        row?.accountHolder?.accountLastName,
        row?.accountHolder?.prefix,
        row?.accountHolder?.suffix,
        row?.accountHolder?.debitOrCredit,
        row?.accountHolder?.location,
        row?.accountHolder?.profession,
        row?.accountHolder?.reference,
        // row?.accountHolder?.accountHolderID,
        row?.dateInfo?.day,
        row?.dateInfo?.month,
        row?.dateInfo?.year,
        row?.dateInfo?.fullDate,
        row?.meta?.entryID,
        row?.meta?.ledger,
        row?.meta?.reel,
        row?.meta?.folioPage,
        row?.meta?.owner,
        row?.meta?.store,
        row?.meta?.year,
        row?.meta?.comments,
        row?.money?.colony,
        row?.money?.quantity,
        row?.money?.commodity,
        row?.money?.currency.pounds,
        row?.money?.currency.shilling,
        row?.money?.currency.pence,
        row?.money?.sterling.pounds,
        row?.money?.sterling.shilling,
        row?.money?.sterling.pence,
    ];

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                {onParseEdit && index !== undefined ? (
                    <TableCell>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => onParseEdit(row, index - 1)}
                        >
                            Edit
                        </Button>
                    </TableCell>
                ) : null}
                {index !== undefined ? (
                    <TableCell align="center">{index}</TableCell>
                ) : null}
                {onEditClick && isAdminOrModerator ? (
                    <TableCell>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => onEditClick(row)}
                        >
                            Edit
                        </Button>
                    </TableCell>
                ) : null}
                {onDeleteClick && isAdmin ? (
                    <TableCell>
                        <Button
                            variant="contained"
                            startIcon={<Delete />}
                            onClick={() => onDeleteClick(row)}
                        >
                            Delete
                        </Button>
                    </TableCell>
                ) : null}
                {columnValues.map((value, i: number) => (
                    <TableCell key={i} align="justify">
                        {value}
                    </TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell
                    style={{}}
                    sx={{
                        verticalAlign: 'top',
                        paddingBottom: 0,
                        paddingTop: 0,
                    }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {row.itemEntries && (
                            <ItemEntriesTable itemEntries={row.itemEntries} />
                        )}
                        {row.regularEntry && (
                            <RegularEntryTable
                                regularEntry={row.regularEntry}
                            />
                        )}
                        {row.tobaccoEntry && (
                            <TobaccoEntryTable
                                tobaccoEntry={row.tobaccoEntry}
                            />
                        )}
                    </Collapse>
                </TableCell>
                {row.people && row.people.length > 0 && (
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <ArrayTable
                                headerName="People"
                                headRowLabel="Name"
                                values={row.people}
                            />
                        </Collapse>
                    </TableCell>
                )}
                {row.places && row.places.length > 0 && (
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <ArrayTable
                                headerName="Places"
                                headRowLabel="Name"
                                values={row.places}
                            />
                        </Collapse>
                    </TableCell>
                )}
                {row.ledgerRefs && row.ledgerRefs.length > 0 && (
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <ArrayTable
                                headRowLabel="Ledger References"
                                values={row.ledgerRefs}
                            />
                        </Collapse>
                    </TableCell>
                )}
                {row.folioRefs && row.folioRefs.length > 0 && (
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <ArrayTable
                                headRowLabel="Folio References"
                                values={row.folioRefs}
                            />
                        </Collapse>
                    </TableCell>
                )}
            </TableRow>
        </Fragment>
    );
};

export default ParsingResultTableRow;
