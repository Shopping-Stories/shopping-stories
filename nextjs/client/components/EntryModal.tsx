import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Container from '@mui/material/Container';

const Item = styled(Paper)(({ theme }: any) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

const style = {};

export default function EntryModal(props: {
	entry: any;
	isOpen: boolean;
	handleClose: () => any;
	index?: number;
}) {
	const { entry, isOpen, handleClose, index } = props;

	const [checked, setChecked] = useState([0]);

	const labels = [
		'First Name:',
		'Last Name:',
		'Debit or Credit:',
		'Location:',
		'Profession:',
		'Reference:',
		'Prefix:',
		'Suffix:',
		'Account ID:',
		'Day:',
		'Month:',
		'Year:',
		'Date:',
		'Entry ID:',
		'Ledger:',
		'Reel:',
		'FolioPage:',
		'Owner:',
		'Store:',
		'Year:',
		"Money's Colony:",
		"Money's Quantity:",
		'Money.Commodity:',
		'Currency.Pounds:',
		'Currency.Shilling:',
		'Currency.Pence:',
		'Sterling.Pounds:',
		'Sterling.Shilling:',
		'Sterling.Pence:',
	];

	const entryValues: any[] = [
		entry?.accountHolder?.accountFirstName,
		entry?.accountHolder?.accountLastName,
		entry?.accountHolder?.debitOrCredit,
		entry?.accountHolder?.location,
		entry?.accountHolder?.profession,
		entry?.accountHolder?.reference,
		entry?.accountHolder?.prefix,
		entry?.accountHolder?.suffix,
		entry?.accountHolder?.accountHolderID,
		entry?.dateInfo?.day,
		entry?.dateInfo?.month,
		entry?.dateInfo?.year,
		entry?.dateInfo?.fullDate,
		entry?.meta?.entryID,
		entry?.meta?.ledger,
		entry?.meta?.reel,
		entry?.meta?.folioPage,
		entry?.meta?.owner,
		entry?.meta?.store,
		entry?.meta?.year,
		entry?.money?.colony,
		entry?.money?.quantity,
		entry?.money?.commodity,
		entry?.money?.currency.pounds,
		entry?.money?.currency.shilling,
		entry?.money?.currency.pence,
		entry?.money?.sterling.pounds,
		entry?.money?.sterling.shilling,
		entry?.money?.sterling.pence,
	];

	const handleToggle = (value: number) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	return (
		<div>
			<Dialog fullWidth maxWidth="md" onClose={handleClose} open={isOpen}>
				<DialogTitle>Viewing Entry {index}</DialogTitle>
				<Box sx={style}>
					<Grid container spacing={2}>
						{entryValues.map((value: any, i: number) => (
							<Grid item xs={4} key={i}>
								<Item>{labels[i]} {value}</Item>
							</Grid>
						))}
						<Grid item xs={4}>
							<Item>Sterling.Pence: {entry?.regularEntry}</Item>
						</Grid>
						<Grid item xs={4}>
							<Item>Sterling.Pence: {entry?.Money?.Sterling.Pence}</Item>
						</Grid>
						<Grid item xs={4}>
							<Item>Sterling.Pence: {entry?.Money?.Sterling.Pence}</Item>
						</Grid>

						<Grid item xs={12}>
							<Container>
								<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
									{entry?.itemEntry &&
										entry?.itemEntry.map((item: any, i: number) => {
											const labelId = `checkbox-list-label-${i}`;

											return (
												<ListItem key={i} disablePadding>
													<ListItemButton
														role={undefined}
														onClick={handleToggle(i)}
														dense
													>
														<ListItemIcon>
															<Checkbox
																edge="start"
																checked={checked.indexOf(i) !== -1}
																tabIndex={-1}
																disableRipple
																inputProps={{ 'aria-labelledby': labelId }}
															/>
														</ListItemIcon>
														<ListItemText
															id={labelId}
															primary={`Line item pounds ${item?.itemCost?.pounds}`}
														/>
													</ListItemButton>
												</ListItem>
											);
										})}
								</List>
							</Container>
						</Grid>
					</Grid>
				</Box>
			</Dialog>
		</div>
	);
}
