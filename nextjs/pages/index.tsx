// import { Storage } from 'aws-amplify';
import Header from '@components/Header';
import Link from '@components/MuiNextLink';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useColorMode } from './_app';

const Home: NextPage = () => {
	const get = () => {
		// Storage.get('test.txt')
		// 	.then((result) => console.log(result))
		// 	.catch((err) => console.log(err));
	};
	const submit = () => {
		// Storage.put('test2.txt', 'Hello')
		// 	.then((result) => console.log(result))
		// 	.catch((err) => console.log(err));
	};
	const [toggleOn, setToggle] = useState<boolean>(false);
	const { toggleColorMode } = useColorMode();

	return (
		<>
			<Head>
				<title>Shopping Stories</title>
				<meta name="description" content="Revealing Colonial History" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />
			<Container>
				<div className={styles.container}>
					<main className={styles.main}>
						<h1 className={styles.title}>
							Welcome to <a href="https://nextjs.org">Next.js!</a>
						</h1>
						<p className={styles.description}>
							Get started by editing{' '}
							<code className={styles.code}>pages/index.js</code>
						</p>

						<Button variant="outlined" onClick={submit}>
							hello
						</Button>
						<Switch
							checked={toggleOn}
							onChange={() => {
								setToggle(!toggleOn);
								toggleColorMode();
							}}
						/>
						<Button variant="outlined" onClick={get}>
							get
						</Button>
						<Link aria-label="Link to Sign In page" href="/auth">
							Login
						</Link>
						<div className={styles.grid}>
							<a href="https://nextjs.org/docs" className={styles.card}>
								<h2>Documentation &rarr;</h2>
								<p>Find in-depth information about Next.js features and API.</p>
							</a>

							<a href="https://nextjs.org/learn" className={styles.card}>
								<h2>Learn &rarr;</h2>
								<p>
									Learn about Next.js in an interactive course with quizzes!
								</p>
							</a>

							<a
								href="https://github.com/vercel/next.js/tree/master/examples"
								className={styles.card}
							>
								<h2>Examples &rarr;</h2>
								<p>Discover and deploy boilerplate example Next.js projects.</p>
							</a>

							<a
								href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
								className={styles.card}
							>
								<h2>Deploy &rarr;</h2>
								<p>
									Instantly deploy your Next.js site to a public URL with
									Vercel.
								</p>
							</a>
						</div>
					</main>

					<footer className={styles.footer}>
						<a
							href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							Powered by{' '}
							<span className={styles.logo}>
								<Image
									src="/vercel.svg"
									alt="Vercel Logo"
									width={72}
									height={16}
								/>
							</span>
						</a>
					</footer>
				</div>
			</Container>
		</>
	);
};

export default Home;
