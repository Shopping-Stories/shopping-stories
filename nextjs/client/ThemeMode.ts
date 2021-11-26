import { PaletteMode } from '@mui/material';
import { createContext, useContext } from 'react';

export const ColorModeContext = createContext<{
    toggleColorMode: () => void;
    mode: PaletteMode;
}>({
    toggleColorMode: () => undefined,
    mode: 'light',
});

export const useColorMode = () => {
    return useContext(ColorModeContext);
};