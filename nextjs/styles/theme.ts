import { PaletteMode } from '@mui/material';
import { amber, deepPurple } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const lightTheme: any = {
	// palette values for light mode
	primary: {
		main: '#283618', // kombu
		// main: '#606c38', // dark olive
	},
	secondary: {
		main: '#606C38', // kombu
	},
};

const darkTheme: any = {
	primary: {
		main: '#606c38',
	},
};

export const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === 'light' ? lightTheme : darkTheme),
	},
});

// Create a theme instance.
let theme = createTheme({
	palette: {
		primary: deepPurple,
		secondary: amber,
	},
});

theme = responsiveFontSizes(theme);

export default theme;
