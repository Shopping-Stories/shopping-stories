import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/icons-material/Menu';
import MuiNextLink from './MuiNextLink';
import { useState } from 'react';
import { NavLink } from './Header';
import Stack from '@mui/material/Stack';

const SideDrawer = ({ navLinks }: { navLinks: NavLink[] }) => {
    const [state, setState] = useState({
        right: false,
    });

    const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor: string) => (
        <Box
            sx={{ minWidth: '10rem', marginTop: `auto`, marginBottom: `auto` }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Stack alignItems="center" spacing={2}>
                {navLinks.map(({ title, path }, i) => (
                    <Typography
                        variant="button"
                        key={`${title}${i}`}
                        sx={{
                            padding: '1%',
                            textTransform: `uppercase`,
                        }}
                    >
                        <MuiNextLink sx={{ color: 'common.white' }} href={path}>
                            {title}
                        </MuiNextLink>
                    </Typography>
                ))}
            </Stack>
        </Box>
    );

    return (
        <>
            <IconButton
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer('right', true)}
                sx={{
                    color: `common.white`,
                    display: { xs: `inline`, md: `none` },
                }}
            >
                <Menu fontSize="large" />
            </IconButton>
            <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer('right', false)}
                sx={{
                    '.MuiDrawer-paper': {
                        bgcolor: 'primary.main',
                    },
                }}
            >
                {list('right')}
            </Drawer>
        </>
    );
};

export default SideDrawer;
