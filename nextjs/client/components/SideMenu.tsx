import MuiNextLink from '@components/MuiNextLink';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { PaperStyles } from 'styles/styles';
import { NavLink } from '../types';

const SideMenu = ({ links }: { links: NavLink[] }) => {
    return (
        <Fragment>
            <Paper
                sx={{
                    backgroundColor: `var(--secondary)`,
                    ...PaperStyles,
                }}
            >
                <MenuList>
                    {links.map(({ title, path }, i) => (
                        <MenuItem key={`${title}-${i}`}>
                            <Typography
                                variant="button"
                                key={`${title}${i}`}
                                sx={{
                                    padding: '1%',
                                    textTransform: `uppercase`,
                                }}
                            >
                                <MuiNextLink
                                    sx={{ color: 'var(--secondary-text)' }}
                                    href={path}
                                >
                                    {title}
                                </MuiNextLink>
                            </Typography>
                        </MenuItem>
                    ))}
                </MenuList>
            </Paper>
        </Fragment>
    );
};

export default SideMenu;
