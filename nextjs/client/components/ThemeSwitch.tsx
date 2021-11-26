import Switch from '@mui/material/Switch';
import { useColorMode } from 'client/ThemeMode';
import { useState } from 'react';

export const ThemeSwitch = () => {
    const { toggleColorMode, mode } = useColorMode();
    const [toggleOn, setToggle] = useState<boolean>(mode !== 'light');
    return (
        <Switch
            checked={toggleOn}
            onChange={() => {
                toggleColorMode();
                setToggle((prev) => !prev);
            }}
        />
    );
};
