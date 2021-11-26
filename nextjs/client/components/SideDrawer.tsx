import MuiNextLink from '@components/MuiNextLink';
import Menu from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { NavLink } from 'client/types';
import { signOut } from 'client/util';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ButtonStyles } from 'styles/styles';
import { ThemeSwitch } from './ThemeSwitch';

interface SideDrawerProps {
    navLinks: NavLink[];
    isLoggedIn?: boolean;
}

const SideDrawer = ({ navLinks, isLoggedIn }: SideDrawerProps) => {
    const router = useRouter();
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
                <ThemeSwitch />
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
                {isLoggedIn ? (
                    <Button
                        sx={ButtonStyles}
                        variant="contained"
                        onClick={() => signOut(router)}
                    >
                        Sign out
                    </Button>
                ) : (
                    <Button
                        sx={ButtonStyles}
                        variant="contained"
                        onClick={() => router.push('/auth/signin')}
                    >
                        Sign In
                    </Button>
                )}
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
