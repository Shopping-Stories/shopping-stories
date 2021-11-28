import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { ItemMentioned, ItemOrService } from 'client/types';
import { Fragment } from 'react';

const ItemsOrServicesRow = (props: { itemOrService: ItemOrService }) => {
    const { itemOrService } = props;
    const variants = itemOrService?.variants?.reduce(
        (preVariants: string, currentVariant: string) =>
            `${preVariants}; ${currentVariant}`,
        '',
    );

    const columnValues = [
        itemOrService?.item,
        itemOrService?.category,
        itemOrService?.subcategory,
        itemOrService?.qualifier,
        itemOrService?.quantity,
        itemOrService?.itemCost?.pounds,
        itemOrService?.itemCost?.shilling,
        itemOrService?.itemCost?.pence,
        itemOrService?.unitCost?.pounds,
        itemOrService?.unitCost?.shilling,
        itemOrService?.unitCost?.pence,
        variants && variants.substring(0, variants.length - 1),
    ];

    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const ItemsOrServicesTable = (props: { itemsOrServices: ItemOrService[] }) => {
    const columnNames = [
        'Name',
        'Category',
        'Subcategory',
        'Qualifier',
        'Quantity',
        'Pounds',
        'Shillings',
        'Pence',
        'Pounds',
        'Shillings',
        'Pence',
        'Variants',
    ];
    return (
        <Fragment>
            {props.itemsOrServices ? (
                <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                        Items or Services
                    </Typography>
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5} />
                                <TableCell align="center" colSpan={3}>
                                    Item Cost
                                </TableCell>
                                <TableCell align="center" colSpan={3}>
                                    Unit Cost
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {columnNames.map((name, i) => {
                                    return (
                                        <TableCell key={i}>{name}</TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.itemsOrServices &&
                                props.itemsOrServices.map((item, i) => (
                                    <ItemsOrServicesRow
                                        key={i}
                                        itemOrService={item}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            ) : null}
        </Fragment>
    );
};

const ItemsMentionedRow = (props: { itemMentioned: ItemMentioned }) => {
    const { itemMentioned } = props;

    const columnValues = [
        itemMentioned?.item,
        itemMentioned?.qualifier,
        itemMentioned?.quantity,
    ];
    return (
        <TableRow>
            {columnValues.map((value, i) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const ItemsMentionedTable = (props: { itemsMentioned: ItemMentioned[] }) => {
    const columnNames = ['Name', 'Qualifier', 'Quantity'];

    return (
        <Fragment>
            {props.itemsMentioned ? (
                <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                        Items Mentioned
                    </Typography>
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow>
                                {columnNames.map((name, i) => {
                                    return (
                                        <TableCell key={i}>{name}</TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.itemsMentioned &&
                                props.itemsMentioned.map((item, i) => (
                                    <ItemsMentionedRow
                                        key={i}
                                        itemMentioned={item}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            ) : null}
        </Fragment>
    );
};

export { ItemsMentionedTable, ItemsOrServicesTable };
