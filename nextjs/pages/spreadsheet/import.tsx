// import DataGrid from '@components/DataGrid';
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
import backgrounds from 'styles/backgrounds.module.css';

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
						{parseSheetResult.data && (
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: "20%" }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>Entry</TableCell>
											<TableCell align="right">Entry.item</TableCell>
											<TableCell align="right">Entry.tobacco</TableCell>
											<TableCell align="right">
												Account Holder First Name
											</TableCell>
											<TableCell align="right">
												Account Holder Last Name
											</TableCell>
											<TableCell align="right">Debt or Credit</TableCell>
											<TableCell align="right">Location</TableCell>
											<TableCell align="right">
												Account Holder Profession
											</TableCell>
											<TableCell align="right">
												Account Holder Reference
											</TableCell>
											<TableCell align="right">Account Holder Prefix</TableCell>
											<TableCell align="right">Account Holder Suffix</TableCell>
											<TableCell align="right">Account Holder ID</TableCell>
											<TableCell align="right">Day</TableCell>
											<TableCell align="right">Month</TableCell>
											<TableCell align="right">Year</TableCell>
											<TableCell align="right">Date</TableCell>
											<TableCell align="right">EntryID (Meta)</TableCell>
											<TableCell align="right">Ledger (Meta)</TableCell>
											<TableCell align="right">Reel (Meta)</TableCell>
											<TableCell align="right">FolioPage (Meta)</TableCell>
											<TableCell align="right">Owner</TableCell>
											<TableCell align="right">Store</TableCell>
											<TableCell align="right">Year</TableCell>
											<TableCell align="right">Money.Colony</TableCell>
											<TableCell align="right">Money.Quantity</TableCell>
											<TableCell align="right">Money.Commodity</TableCell>
											<TableCell align="right">Money.Currency.Pounds</TableCell>
											<TableCell align="right">
												Money.Currency.Shilling
											</TableCell>
											<TableCell align="right">Money.Currency.Pence</TableCell>
											<TableCell align="right">Money.Currency.Pence</TableCell>
											<TableCell align="right">Money.Sterling.Pounds</TableCell>
											<TableCell align="right">
												Money.Sterling.Shilling
											</TableCell>
											<TableCell align="right">Money.Sterling.Pence</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{entries.map((row: any, i: number) => (
											<TableRow
												key={i.toString()}
												sx={{
													'&:last-child td, &:last-child th': { border: 0 },
												}}
											>
												<TableCell component="th" scope="row">
													{Boolean(row.NewEntry.regEntry)}
												</TableCell>
												<TableCell align="right">
													{Boolean(row.NewEntry.itemEntry)}
												</TableCell>
												<TableCell align="right">
													{Boolean(row.NewEntry.tobaccoEntry)}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.AccountFirstName}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.AccountLastName}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.DrCr}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.Location}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.Profession}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.Reference}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.Prefix}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.Suffix}
												</TableCell>
												<TableCell align="right">
													{row?.AccHolder?.accHolderID}
												</TableCell>
												<TableCell align="right">
													{row?.DateInfo?.Day}
												</TableCell>
												<TableCell align="right">
													{row?.DateInfo?.Month}
												</TableCell>
												<TableCell align="right">
													{row?.DateInfo?.Year}
												</TableCell>
												<TableCell align="right">
													{row?.DateInfo?.Date}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.EntryID}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.Ledger}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.Owner}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.Reel}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.Owner}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.Store}
												</TableCell>
												<TableCell align="right">
													{row?.Meta?.Year}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Colony}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Quantity}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Commodity}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Currency.Pounds}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Currency.Shilling}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Currency.Pence}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Currency.Pence}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Sterling.Pounds}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Sterling.Shilling}
												</TableCell>
												<TableCell align="right">
													{row?.Money?.Sterling.Pence}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						)}
						{/* <DataGrid /> */}
					</Grid>
				</Grid>
			</div>
		</>
	);
};

export default ImportPage;
