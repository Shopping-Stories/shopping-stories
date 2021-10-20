import { PaletteMode } from '@mui/material';
import { amber, deepPurple } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const lightTheme: any = {
	// palette values for light mode
	primary: {
		main: '#606c38',
	},
	secondary: {
		main: '#BB9457',
	},
};

const darkTheme: any = {
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
