import MuiNextLink from '@components/MuiNextLink';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { PaperStyles } from 'styles/styles';
import { NavLink } from '../types';
import Stack from '@mui/material/Stack';

const SideMenu = ({ links }: { links: NavLink[] }) => {
    return (
        <Fragment>
            <Paper
                sx={{
                    backgroundColor: `var(--secondary)`,
                    ...PaperStyles,
                }}
            >
                <Stack direction={'row'}>
                    {links.map(({ title, path }, i) => (
                        // TODO: Make this not as jank, so that clicking the menu item will cause the href from muinextlink.
                        // <a href={path} key={`${title}-${i}aref`}>
                        <MenuItem key={`${title}-${i}`}>
                            <Typography
                                variant="button"
                                color={"secondary.contrastText"}
                                key={`${title}${i}`}
                                sx={{
                                    padding: '1%',
                                    textTransform: `uppercase`,
                                }}
                            >
                                <MuiNextLink
                                    sx={{ color: 'secondary.contrastText' }}
                                    href={path}
                                >
                                    {title}
                                </MuiNextLink>
                            </Typography>
                        </MenuItem>
                        // </a>
                    ))}
                </Stack>
            </Paper>
        </Fragment>
    );
};

export default SideMenu;
