import HideOnScroll from '@components/HideOnScroll';
import MuiNextLink from '@components/MuiNextLink';
import Navbar from '@components/Navbar';
import SideDrawer from '@components/SideDrawer';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/system';
import { NavLink } from 'client/types';
import { Roles } from 'config/constants.config';
import { isEqual, uniqWith } from 'lodash';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';

const defaultNavLinks: NavLink[] = [
    { title: `home`, path: `/` },
    { title: `about`, path: `/about` },
    { title: `search`, path: `/entries` },
    { title: `glossary`, path: `/glossary/items` },
];

const adminNavLinks: NavLink[] = [
    { title: `transcripts`, path: `/documents` },
    { title: `settings`, path: `/dashboard/settings` },
];

const Offset = styled('div')(
    ({ theme }: { theme?: any }) => theme.mixins.toolbar,
);

const Header = () => {
    const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);
    const { groups, isLoggedIn } = useAuth();
    const authLinks = isLoggedIn ? adminNavLinks : [];
    const uniqueNavLinks = uniqWith([...navLinks, ...authLinks], isEqual);

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
            <HideOnScroll>
                <AppBar position="fixed">
                    <Toolbar>
                        <Container
                            maxWidth="lg"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Fab aria-label="home">
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
            </HideOnScroll>
            <Offset />
        </Fragment>
    );
};

export default Header;
