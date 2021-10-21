import FileInput from '@components/FileInput';
import Header from '@components/Header';
import SideMenu from '@components/SideMenu';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { useState } from 'react';
import { useMutation } from 'urql';
import xlsx from 'xlsx';

const parseSheetDef = `
	mutation ($spreadsheet: JSONObject!) {
		importSpreadsheet(spreadsheetObj: $spreadsheet)
	}
`;

const ImportPage: NextPage = () => {
	const { groups, loading } = useAuth('/', [Roles.Admin]);
	const [parseSheetResult, parseSheet] = useMutation(parseSheetDef);
	const [file, setFile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const entries = parseSheetResult.data
		? parseSheetResult.data.importSpreadsheet
		: null;

	const convertFileToJSON = async () => {
		if (file === null || !file) {
			return;
		}
		setIsLoading(true);
		let sheets: { [name: string]: any } = {};
		const selectedFile = file;
		const fileReader = new FileReader();
		fileReader.readAsBinaryString(selectedFile);
		fileReader.onload = (event: any) => {
			let binaryData = event.target.result;
			let workbook = xlsx.read(binaryData, { type: 'binary' });
			workbook.SheetNames.forEach((sheet: string) => {
				const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], {
					defval: '',
					raw: true,
				});
				sheets[sheet] = data;
			});

			parseSheet({ spreadsheet: sheets }).then(() => setIsLoading(false));
		};
	};

	if (loading) {
		return (
			<>
				<Header />
				<LinearProgress />
			</>
		);
	}

	return (
		<>
			<Header />
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<SideMenu groups={groups} />
				</Grid>
				<Grid item xs={8}>
					<Paper
						sx={{
							backgroundColor: `camel.main`,
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
						>
							<FormGroup>
								<Stack spacing={2} direction="row">
									<FileInput
										label="import spreadsheet"
										onChange={({ file }: any) => setFile(file)}
									/>
									<LoadingButton
										loading={isLoading}
										onClick={convertFileToJSON}
										variant="contained"
										sx={{
											margin: '1rem 5rem',
										}}
									>
										Parse File
									</LoadingButton>
								</Stack>
							</FormGroup>
						</Grid>
					</Paper>
					{entries && (
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Dessert (100g serving)</TableCell>
										<TableCell align="right">Calories</TableCell>
										<TableCell align="right">Fat&nbsp;(g)</TableCell>
										<TableCell align="right">Carbs&nbsp;(g)</TableCell>
										<TableCell align="right">Protein&nbsp;(g)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{entries.map((row: any, i: number) => (
										<TableRow
											key={row.Entry + i.toString()}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.Entry}
											</TableCell>
											<TableCell align="right">{row.ErrorCode}</TableCell>
											<TableCell align="right">{row.ErrorCode}</TableCell>
											<TableCell align="right">{row.ErrorCode}</TableCell>
											<TableCell align="right">{row.ErrorCode}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default ImportPage;
