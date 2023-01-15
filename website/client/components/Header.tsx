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
import { Fragment, useEffect, useState } from 'react';
import { LogoFabStyles } from 'styles/styles';
// import { styled } from '@mui/system';
// import Typography from "@mui/material/Typography";

const defaultNavLinks: NavLink[] = [
    { title: `home`, path: `/` },
    { title: `about`, path: `/about` },
    { title: `search`, path: `/entries` },
    { title: `glossary`, path: `/glossary/items` },
];

const adminNavLinks: NavLink[] = [
    { title: `documents`, path: `/documents` },
    { title: `settings`, path: `/dashboard/settings` },
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
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (title && title === 'GraphView') {
            setWidth(240);
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
        <Fragment>
            {/*<HideOnScroll>*/}

             <AppBar
                //  position="relative"
                // position="fixed"
                position={title === "GraphView" ? "fixed" : "relative"}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    // width: `calc(100% - ${width}px)`,
                    width: `85%`,
                    ml: `15%`
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
            {/*{title && title === 'GraphView' && (*/}
            {/*    <AppBar*/}
            {/*        // anchor="right"*/}
            {/*        color="transparent"*/}
            {/*        position="fixed"*/}
            {/*        sx={{*/}
            {/*            zIndex: (theme) => theme.zIndex.drawer+1,*/}
            {/*            width: `calc(100% - ${width}px)`,*/}
            {/*            ml: `${width}px`*/}
            {/*            // mr: `${drawerWidth}px`*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Toolbar>*/}
            {/*        <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap component="div">*/}
            {/*            Nodes*/}
            {/*        </Typography>*/}
            {/*    </Toolbar>*/}
            {/*    </AppBar>*/}
            {/*)}*/}
            {/*</HideOnScroll>*/}
            {/*<Offset />*/}
        </Fragment>
    );
};

export default Header;
