import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from '@components/Header';
import MuiNextLink from '@components/MuiNextLink';

const Navbar = ({ navLinks }: { navLinks: NavLink[] }) => {
	return (
		<Toolbar
			component="nav"
			sx={{
				display: { xs: `none`, md: `flex` },
			}}
		>
			<Stack direction="row" spacing={4}>
				{navLinks.map(({ title, path }: NavLink, i: number) => (
					<MuiNextLink
						key={`${title}${i}`}
						href={path}
						variant="button"
						sx={{ color: `white`, opacity: 0.7 }}
					>
						{title}
					</MuiNextLink>
				))}
			</Stack>
		</Toolbar>
	);
};

export default Navbar;
