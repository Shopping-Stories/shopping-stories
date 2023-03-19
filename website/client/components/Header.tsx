// import HideOnScroll from '@components/HideOnScroll';
import MuiNextLink from '@components/MuiNextLink';
import Navbar from '@components/Navbar';
import SideDrawer from '@components/SideDrawer';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from 'client/types';
import { Roles } from 'config/constants.config';
import { isEqual, uniqWith } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LogoFabStyles } from 'styles/styles';
// import Box from '@mui/material/Box';
// import { styled } from '@mui/system';
// import Typography from "@mui/material/Typography";

const defaultNavLinks: NavLink[] = [
    { title: `home`, path: `/` },
    { title: `about`, path: `/about` },
    { title: `search`, path: `/entries` },
    { title: `glossary`, path: `/glossary/items` },
    { title: `parser`, path: `/reseditor`}
];

const adminNavLinks: NavLink[] = [
    { title: `documents`, path: `/documents` },
    { title: `dashboard`, path: `/dashboard/settings` },
];
// TODO: figure out why this is here
// const Offset = styled('div')(
//     ({ theme }: { theme?: any }) => theme.mixins.toolbar,
// );

interface HeaderConfig {
    title?: string;
}

const Header = ({ title }: HeaderConfig) => {
    const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);
    const { groups, isLoggedIn } = useAuth();
    const authLinks = isLoggedIn ? adminNavLinks : [];
    const uniqueNavLinks = uniqWith([...navLinks, ...authLinks], isEqual);
    const [width, setWidth] = useState("100%");
    useEffect(() => {
        // console.log(title)
        if (title && title === 'GraphView') {
            setWidth("83.34%");
            
        }
    },[title]);

    useEffect(() => {
        const updateLinks = () => {
            if (isInGroup(Roles.Admin, groups)) {
                setNavLinks((prev: NavLink[]) => [...prev, ...adminNavLinks]);
            }

            setNavLinks((prev: NavLink[]) => [...prev]);
        };
        updateLinks();
    }, [groups, isLoggedIn]);

    return (
        <>
            <AppBar
                 // position="relative"
                position="fixed"
                // position={title === 'GraphView' ? 'fixed' : 'relative'}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    // width: `calc(100% - ${width}px)`,
                    width: `${width}`,
                    ml: `calc(100% - ${width})`,
                    // ml: `${width}px`,
                }}
            >
                {/*<AppBar*/}
                {/*   position="relative"*/}
                {/*   sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}*/}
                {/*>*/}
                <Toolbar>
                    <Container
                        maxWidth="lg"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Fab sx={LogoFabStyles} aria-label="home">
                            <MuiNextLink activeClassName="active" href="/">
                                <Image
                                    alt="logo image"
                                    src={'/HR_logo.png'}
                                    layout="fill"
                                />
                            </MuiNextLink>
                        </Fab>
                        <Navbar
                            navLinks={uniqueNavLinks}
                            isLoggedIn={isLoggedIn}
                        />
                        <SideDrawer
                            navLinks={uniqueNavLinks}
                            isLoggedIn={isLoggedIn}
                        />
                    </Container>
                </Toolbar>
            </AppBar>
            {(title !== 'GraphView') && <Toolbar/>}
            </>
    );
};

export default Header;
