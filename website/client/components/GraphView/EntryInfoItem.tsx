import { useState } from "react";
import ListItem from '@mui/material/ListItem';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {EntryInfoProps, displayNames } from "@components/GraphView/util";

// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Drawer from '@mui/material/Drawer';
// import Box from '@mui/material/Box';
// import TableContainer from '@mui/material/TableContainer';
// import { Currency, Ledger, Entry } from "../../../new_types/api_types";
// import { ListSubheader } from "@mui/material";



const EntryInfoItem = (
    {
        currency,
        ledger,
        sterling,
        context,
        scalars,
        // _id
                           // phrases, people
    }:EntryInfoProps,
    
) => {
    
    const [open, setOpen] = useState(false)
    const [ledgerOpen, setLedgerOpen] = useState(false)
    const [currencyOpen, setCurrencyOpen] = useState(false)
    const [sterlingOpen, setSterlingOpen] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)
    const [ctxOpen, setCtxOpen] = useState(false)
    // console.log(context)
    return (
        <>
            <Divider />
            <ListItemButton>
                <ListItemText
                    primary={`${displayNames.reel}: ${
                        ledger ? ledger.reel : ''
                    }`}
                    secondary={`${displayNames.entry_id}: ${
                        ledger ? ledger.entry_id : ''
                    }`}
                />
                {open ? (
                    <ExpandLess onClick={() => setOpen(!open)} />
                ) : (
                    <ExpandMore onClick={() => setOpen(!open)} />
                )}
            </ListItemButton>
            <Collapse in={open} unmountOnExit orientation={'vertical'}>
                <Divider />
                {context && (
                    <>
                        <ListItemButton>
                            <ListItemText primary={'Context'} sx={{ml:2}} />
                            {ctxOpen ? (
                                <ExpandLess
                                    onClick={() => setCtxOpen(!ctxOpen)}
                                />
                            ) : (
                                <ExpandMore
                                    onClick={() => setCtxOpen(!ctxOpen)}
                                />
                            )}
                        </ListItemButton>
                        <Collapse
                            in={ctxOpen}
                            unmountOnExit
                            orientation={'vertical'}
                        >
                            <Divider />
                            {context.map((c,i) => (
                                <ListItem key={i}>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        // component={'span'}
                                        // variant={'body'}
                                        color={'text.secondary'}
                                    >
                                        {c.map(p=>`${p} `)}
                                    </Typography>,
                                </ListItem>
                            ))}
                        </Collapse>
                        <Divider/>
                    </>
                )}
                {ledger && (
                    <>
                        {/*<Divider/>*/}
                        {/*<ListSubheader>{displayNames.ledger}</ListSubheader>*/}
                        {/*    <ListItemButton>*/}
                        {/*    </ListItemButton>*/}
                        <ListItemButton>
                            <ListItemText primary={displayNames.ledger} sx={{ml:2}} />
                            {/*<Typography>{displayNames.ledger}</Typography>*/}
                            {/*    <Box sx={{border: "3px grey"}}>*/}
                            {/*</Box>*/}
                            {ledgerOpen ? (
                                <ExpandLess
                                    onClick={() => setLedgerOpen(!ledgerOpen)}
                                />
                            ) : (
                                <ExpandMore
                                    onClick={() => setLedgerOpen(!ledgerOpen)}
                                />
                            )}
                        </ListItemButton>
                        <Collapse
                            in={ledgerOpen}
                            unmountOnExit
                            orientation={'vertical'}
                        >
                            <Divider />
                            <Table sx={{ border: '3px grey' }} size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {displayNames.reel}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.folio_year}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.folio_page}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.entry_id}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{ledger.reel}</TableCell>
                                        <TableCell>
                                            {ledger.folio_year}
                                        </TableCell>
                                        <TableCell>
                                            {ledger.folio_page}
                                        </TableCell>
                                        <TableCell>{ledger.entry_id}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Collapse>
                        <Divider />
                    </>
                )}
                {currency && (
                    <>
                        {/*<Divider/>*/}
                        {/*<ListSubheader>{displayNames.currency}</ListSubheader>*/}
                        {/*<ListItemButton>*/}
                        {/*</ListItemButton>*/}
                        <ListItemButton>
                            <ListItemText
                                primary={displayNames.currency}
                                sx={{ml:2}}
                            />
                            {/*<Typography>{displayNames.currency}</Typography>*/}
                            {currencyOpen ? (
                                <ExpandLess
                                    onClick={() =>
                                        setCurrencyOpen(!currencyOpen)
                                    }
                                />
                            ) : (
                                <ExpandMore
                                    onClick={() =>
                                        setCurrencyOpen(!currencyOpen)
                                    }
                                />
                            )}
                        </ListItemButton>
                        <Collapse
                            in={currencyOpen}
                            unmountOnExit
                            orientation={'vertical'}
                        >
                            <Divider />
                            <Table size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {displayNames.pounds}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.shillings}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.pennies}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.farthings}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{currency.pounds}</TableCell>
                                        <TableCell>
                                            {currency.shillings}
                                        </TableCell>
                                        <TableCell>
                                            {currency.pennies}
                                        </TableCell>
                                        <TableCell>
                                            {currency.farthings}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Collapse>
                        <Divider />
                    </>
                )}
                {sterling && (
                    <>
                        {/*<Divider/>*/}
                        {/*<ListSubheader>{displayNames.sterling}</ListSubheader>*/}
                        {/*<ListItem>*/}
                        {/*</ListItem>*/}
                        <ListItem>
                            <ListItemText
                                primary={displayNames.sterling}
                                sx={{ml:2}}
                            />
                            {/*<Typography>{displayNames.currency}</Typography>*/}
                            {/*    <Box sx={{border: "1px grey"}}>*/}
                            {/*</Box>*/}
                            {sterlingOpen ? (
                                <ExpandLess
                                    onClick={() =>
                                        setSterlingOpen(!sterlingOpen)
                                    }
                                />
                            ) : (
                                <ExpandMore
                                    onClick={() =>
                                        setSterlingOpen(!sterlingOpen)
                                    }
                                />
                            )}
                        </ListItem>
                        <Collapse
                            in={sterlingOpen}
                            unmountOnExit
                            orientation={'vertical'}
                        >
                            <Divider />
                            <Table size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {displayNames.pounds}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.shillings}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.pennies}
                                        </TableCell>
                                        <TableCell>
                                            {displayNames.farthings}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{sterling.pounds}</TableCell>
                                        <TableCell>
                                            {sterling.shillings}
                                        </TableCell>
                                        <TableCell>
                                            {sterling.pennies}
                                        </TableCell>
                                        <TableCell>
                                            {sterling.farthings}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Collapse>
                        <Divider />
                    </>
                )}
                {/*<ListItem>*/}

                {/*</ListItem>*/}
                {/*<ListItem>*/}

                {/*</ListItem>*/}
                {/*<ListSubheader>*/}
                {/*    Entry Information*/}
                {/*    <Divider/>*/}
                {/*</ListSubheader>*/}
                <ListItemButton>
                    <ListItemText primary={'Entry Information'} sx={{ml:2}} />
                    {infoOpen ? (
                        <ExpandLess onClick={() => setInfoOpen(!infoOpen)} />
                    ) : (
                        <ExpandMore onClick={() => setInfoOpen(!infoOpen)} />
                    )}
                </ListItemButton>
                <Collapse in={infoOpen} unmountOnExit orientation={'vertical'}>
                    <Divider />
                    {scalars &&
                        Object.entries(scalars).filter(e=>!!e[1]).map(([k, v]) => {
                            return (
                                <ListItem key={k}>
                                    <ListItemText
                                        sx={{ml:3}}
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component={'span'}
                                                    variant={'body2'}
                                                    color={'text.primary'}
                                                >
                                                    {`${
                                                        displayNames[
                                                            k as keyof typeof displayNames
                                                        ]
                                                    }: `}
                                                </Typography>
                                                {`${v}`}
                                            </>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                </Collapse>
            </Collapse>
        </>
    );
    
}

export default EntryInfoItem