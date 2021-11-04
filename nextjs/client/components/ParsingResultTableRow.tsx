import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import ItemEntriesTable from './ItemEntriesTable';
import RegularEntryTable from './RegularEntryTable';
import TobaccoEntryTable from './TobaccoEntryTable';

interface EntryTableRowProps {
    row: any;
    index?: number;
    onEditClick?: any;
    onDeleteClick?: any;
}
const ParsingResultTableRow = (props: EntryTableRowProps) => {
    const { row, index, onEditClick, onDeleteClick } = props;
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
        row?.accountHolder?.accountHolderID,
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
        <>
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
                {index && (
                    <TableCell component="td" scope="row">
                        {index}
                    </TableCell>
                )}
                {onEditClick && (
                    <TableCell>
                        <Button
                            variant="contained"
                            onClick={() => onEditClick(row)}
                        >
                            Edit entry
                        </Button>
                    </TableCell>
                )}
                {onDeleteClick && (
                    <TableCell>
                        <Button
                            variant="contained"
                            onClick={() => onDeleteClick(row)}
                        >
                            Delete entry
                        </Button>
                    </TableCell>
                )}
                {columnValues.map((value, i: number) => (
                    <TableCell key={i} align="right">
                        {value}
                    </TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
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
            </TableRow>
        </>
    );
};

export default ParsingResultTableRow;
