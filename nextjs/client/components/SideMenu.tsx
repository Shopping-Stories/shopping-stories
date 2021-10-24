import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import MuiNextLink from '@components/MuiNextLink';
import { NavLink } from '@components/Header';
import { isInGroup } from '@hooks/useAuth.hook';
import { Roles } from 'config/constants.config';

const adminLinks: NavLink[] = [
	{ title: `import spreadsheet`, path: `/spreadsheet/import` },
	{ title: `manage users`, path: `/admin/users` },
];

const sideLinks: NavLink[] = [
	{ title: `manage entries`, path: `/dashboard/entries` },
	{ title: `manage item glossary`, path: `/dashboard/glossary/items` },
	{ title: `manage places`, path: `/dashboard/places` },
	{ title: `manage people`, path: `/dashboard/people` },
	{ title: `manage items`, path: `/dashboard/items` },
	{ title: `manage tobacco marks`, path: `/dashboard/marks` },
];

const SideMenu = ({ groups }: any) => {
	const isAdmin = isInGroup(Roles.Admin, groups);

	const links = [
		...new Set<NavLink>(isAdmin ? [...adminLinks, ...sideLinks] : sideLinks),
	];

	return (
		<Paper
			sx={{
				backgroundColor: `var(--secondary)`,
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
							<MuiNextLink color="secondary.contrastText" href={path}>
								{title}
							</MuiNextLink>
						</Typography>
					</MenuItem>
				))}
			</MenuList>
		</Paper>
	);
};

export default SideMenu;
