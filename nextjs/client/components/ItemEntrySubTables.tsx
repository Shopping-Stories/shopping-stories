import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const ItemsOrServicesRow = (props: { itemsOrServices: any }) => {
    const { itemsOrServices } = props;

    const columnValues: any[] = [
        itemsOrServices?.item,
        itemsOrServices?.category,
        itemsOrServices?.subcategory,
        itemsOrServices?.qualifier,
        itemsOrServices?.quantity,
        itemsOrServices?.itemCost?.pounds,
        itemsOrServices?.itemCost?.shilling,
        itemsOrServices?.itemCost?.pence,
        itemsOrServices?.unitCost?.pounds,
        itemsOrServices?.unitCost?.shilling,
        itemsOrServices?.unitCost?.pence,
        itemsOrServices?.variants?.reduce(
            (preVariants: string, currentVariant: string) =>
                `${preVariants}; ${currentVariant}`,
            '',
        ),
    ];

    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const ItemsOrServicesTable = (props: { itemsOrServices: any }) => {
    const columnNames: string[] = [
        'Name',
        'Category',
        'Subcategory',
        'Qualifier',
        'Quantity',
        'Item Cost, Pounds',
        'Item Cost, Shillings',
        'Item Cost, Pence',
        'Unit Cost, Pounds',
        'Unit Cost, Shillings',
        'Unit Cost, Pence',
        'Variants',
    ];
    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Items or Services
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        {columnNames.map((name: string, i: number) => {
                            return <TableCell key={i}>{name}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.itemsOrServices &&
                        props.itemsOrServices.map((item: any, i: number) => (
                            <ItemsOrServicesRow
                                key={i}
                                itemsOrServices={item}
                            />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

const ItemsMentionedRow = (props: { itemMentioned: any }) => {
    const { itemMentioned } = props;

    const columnValues: any[] = [
        itemMentioned?.item,
        itemMentioned?.qualifier,
        itemMentioned?.quantity,
    ];
    return (
        <TableRow>
            {columnValues.map((value: any, i: number) => {
                return <TableCell key={i}>{value}</TableCell>;
            })}
        </TableRow>
    );
};

const ItemsMentionedTable = (props: { itemsMentioned: any }) => {
    const columnNames: string[] = ['Name', 'Qualifier', 'Quantity'];

    return (
        <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Items Mentioned
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        {columnNames.map((name: string, i: number) => {
                            return <TableCell key={i}>{name}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.itemsMentioned &&
                        props.itemsMentioned.map((item: any, i: number) => (
                            <ItemsMentionedRow key={i} itemMentioned={item} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export { ItemsMentionedTable, ItemsOrServicesTable };
