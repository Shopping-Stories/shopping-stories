import Header from '@components/Header';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import { useColorMode } from './_app';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import backgrounds from 'styles/backgrounds.module.css';

const Home: NextPage = () => {
	const [toggleOn, setToggle] = useState<boolean>(false);
	const { toggleColorMode } = useColorMode();

	return (
		<Fragment>
			<div className={backgrounds.imageBackground}>
				<Head>
					<title>Shopping Stories</title>
					<meta name="description" content="Revealing Colonial History" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<Header />

				<Grid
					container
					spacing={0}
					direction="column"
					alignItems="center"
					justifyContent="center"
					style={{ minHeight: '100vh' }}
				>
					<Box
						sx={{
							width: '60%',
							backgroundColor: 'primary.main',
							textAlign: 'center',
							// opacity: [0.9, 0.8, 0.7],
							// '&:hover': {
							// backgroundColor: 'primary.main',
							// opacity: [0.9, 0.8, 0.7],
							// },
						}}
					>
						<Typography variant="h2" component="h1">
							Welcome to
						</Typography>
						<Typography
							alignContent={'center'}
							variant="h1"
							component="h2"
							gutterBottom
						>
							Shopping Stories
						</Typography>
					</Box>
					<Switch
						checked={toggleOn}
						onChange={() => {
							setToggle(!toggleOn);
							toggleColorMode();
						}}
					/>
				</Grid>
			</div>
		</Fragment>
	);
};

export default Home;
