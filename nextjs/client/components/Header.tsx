import HideOnScroll from '@components/HideOnScroll';
import MuiNextLink from '@components/MuiNextLink';
import Navbar from '@components/Navbar';
import SideDrawer from '@components/SideDrawer';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import Home from '@mui/icons-material/Home';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/system';
import { Roles } from 'config/constants.config';
import { Fragment, useEffect, useState } from 'react';

export interface NavLink {
	title: string;
	path: string;
}

const defaultNavLinks: NavLink[] = [
	{ title: `sign in`, path: `/auth` },
	{ title: `home`, path: `/` },
	{ title: `about us`, path: `/about-us` },
	{ title: `menu`, path: `/menu` },
];

const adminNavLinks: NavLink[] = [
	{ title: `import spreadsheet`, path: `/spreadsheet/import` },
];

const Offset = styled('div')(
	({ theme }: { theme?: any }) => theme.mixins.toolbar,
);

const Header = () => {
	// const navLinks: NavLink[] = [...defaultNavLinks];
	const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);
	const { groups } = useAuth();

	useEffect(() => {
		const updateLinks = () => {
			if (isInGroup(Roles.Admin, groups)) {
				setNavLinks((prev: NavLink[]) => [...prev, ...adminNavLinks]);
			}
		};
		updateLinks();
	}, [groups]);

	return (
		<Fragment>
			<HideOnScroll>
				<AppBar position="fixed">
					<Toolbar>
						<Container
							maxWidth="lg"
							sx={{ display: 'flex', justifyContent: 'space-between' }}
						>
							<IconButton edge="start" aria-label="home">
								<MuiNextLink activeClassName="active" href="/">
									<Home
										sx={{
											color: (theme: any) => theme.palette.common.white,
										}}
										fontSize="large"
									/>
								</MuiNextLink>
							</IconButton>
							<Navbar navLinks={navLinks} />
							<SideDrawer navLinks={navLinks} />
						</Container>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<Offset />
		</Fragment>
	);
};

export default Header;
