import Header from '@components/Header';
import LinearProgressWithLabel from '@components/LinearProgressWithLabel';
import useAuth from '@hooks/useAuth.hook';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { handlePromise } from '../client/util';
import { NextPage } from 'next';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function processStorageList(result: any[]) {
	let files: Object[] = [];
	let folders = new Set<Object>();
	result.forEach((res: any) => {
		if (res.size) {
			files.push(res);
			// sometimes files declare a folder with a / within then
			let possibleFolder = res.key.split('/').slice(0, -1).join('/');
			if (possibleFolder) folders.add(possibleFolder);
		} else {
			folders.add(res.key);
		}
	});
	return { files, folders };
}

const DocumentsPage: NextPage = () => {
	const { loading } = useAuth('/');
	const router = useRouter();
	const [files, setFiles] = useState<any>(null);

	const getFile = async (fileKey: string) => {
		const [res, err] = await handlePromise(Storage.get(fileKey));
		if (err) {
			console.log(err);
		}
		res && router.push(res);
	};

	const submit = () => {
		Storage.put('transcripts/test.txt', 'Hello')
			.then((result) => console.log(result))
			.catch((err) => console.log(err));
	};

	const onChange = async (e: any) => {
		const file = e.target.files[0];
		try {
			await Storage.put(
				`transcripts/${file.name}`,
				file,
				//     , {
				// 	contentType: 'image/png', // contentType is optional
				// }
			);
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	};

	const listFiles = async () => {
		// for listing ALL files without prefix, pass '' instead
		const [res, err] = await handlePromise(Storage.list('transcripts/'));
		if (err) {
			// TODO: trigger error pop up
			console.error(err.message);
		}
		res && setFiles(processStorageList(res).files);
	};

	useEffect(() => {
		if (!loading) {
			listFiles();
		}
	}, [loading]);

	if (loading) {
		return (
			<Box sx={{ width: '100%' }}>
				<LinearProgressWithLabel value="loading..." />
			</Box>
		);
	}

	return (
		<>
			<Header />
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.light',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Button
						aria-label="Button to List Transcript Files"
						onClick={listFiles}
					>
						List Files
					</Button>
					<Button onClick={submit}>create Files in transcripts folder</Button>
					{files &&
						files.map((file: any) => (
							<Button key={file.key} onClick={() => getFile(file.key)}>
								<Typography>{file.key.split('/')[1]}</Typography>
							</Button>
						))}
					<input type="file" onChange={onChange} />
				</Box>
			</Grid>
		</>
	);
};

export default DocumentsPage;
