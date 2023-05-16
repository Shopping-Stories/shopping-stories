import { PaperSideMenuStyles } from "styles/styles";
import { NavLink } from '../types';
// import Grid from '@mui/material/Grid'
import MuiNextLink from '@components/MuiNextLink';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
// import { Fragment } from 'react';

const SideMenu = ({ links }: { links: NavLink[] }) => {
    return (
        // <Fragment>
            <Paper
                sx={{
                    backgroundColor: `var(--secondary)`,
                    ...PaperSideMenuStyles
                    // ...PaperHeaderStyles
                    // ...PaperStyles,
                    // ...PaperStylesSecondary
                }}
            >
                {/*<Grid container>*/}
                {/*<Stack direction={'row'}>*/}
                    <MenuList>
                    {links.map(({ title, path }, i) => (
                        // TODO: Make this not as jank, so that clicking the menu item will cause the href from muinextlink.
                        // <a href={path} key={`${title}-${i}aref`}>
                        // <Grid item xs={2} key={`${title}-${i}`}>
                        <MenuItem key={`${title}-${i}`}>
                            <Typography
                                variant="button"
                                color={"secondary.contrastText"}
                                key={`${title}${i}`}
                                sx={{
                                    padding: '1%',
                                    textTransform: `uppercase`,
                                    textDecoration: 'underline'
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
                        // </Grid>
                         // </a>
                    ))}
                {/*</Stack>*/}
                </MenuList>
                {/*</Grid>*/}
            </Paper>
        //</Fragment>
    );
};

export default SideMenu;
