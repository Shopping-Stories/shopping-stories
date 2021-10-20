import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const LinearProgressWithLabel = (props: any) => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography
					variant="body2"
					color="text.secondary"
				>{`${props.value}`}</Typography>
			</Box>
		</Box>
	);
};

export default LinearProgressWithLabel;
