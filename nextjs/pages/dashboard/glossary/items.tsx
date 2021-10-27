import Header from '@components/Header';
import ItemGlossaryPaginationTable from '@components/ItemGlossaryPaginationTable';
import SideMenu from '@components/SideMenu';
import useAuth from '@hooks/useAuth.hook';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { Roles } from 'config/constants.config';
import backgrounds from 'styles/backgrounds.module.css';

const GlossaryItemsDashboardPage = () => {
	const { groups, loading } = useAuth('/', [Roles.Admin]);

	if (loading) {
		return (
			<>
				<Header />
				<LinearProgress />
			</>
		);
	}

	return (
		<div className={backgrounds.colorBackground}>
			<Header />
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<SideMenu groups={groups} />
				</Grid>
				<Grid item xs={8}>
					<Paper
						sx={{
							backgroundColor: `var(--secondary-bg)`,
							margin: '3rem',
							padding: '1rem',
						}}
					>
						<Grid
							container
							spacing={0}
							direction="column"
							alignItems="center"
							justifyContent="center"
						></Grid>
						<ItemGlossaryPaginationTable />
					</Paper>
				</Grid>
			</Grid>
		</div>
	);
};

export default GlossaryItemsDashboardPage;
