import { PaletteMode } from '@mui/material';
import { amber, deepPurple } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Theme } from "@mui/material";

type ThemeTypes = Theme["palette"]

const lightTheme: any = {
	// palette values for light mode
	primary: {
		main: '#283618',
		light: '#ab47bc'
	},
	secondary: {
		main: '#606C38',
		light: '#ab47bc'
	},
};

const darkTheme: any = {
	primary: {
		main: '#606c38',
		light: '#ab47bc'
	},
	secondary: {
		main: '#606C38',
		light: '#ab47bc'
	},
};

export const getDesignTokens = (mode: PaletteMode):ThemeTypes => ({
			mode,
			...(mode === 'light' ? lightTheme : darkTheme),
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
