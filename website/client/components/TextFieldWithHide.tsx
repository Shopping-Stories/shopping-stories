import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { TextFieldProps } from '@mui/material/TextField';
import { SystemCssProperties, Theme } from '@mui/system';
import { useState } from 'react';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface TextFieldFormikProps {
    formikForm: any;
    fieldName: string;
}

const buttonStyles: SystemCssProperties<Theme> = {
    position: 'absolute',
    marginTop: '20px',
    marginLeft: '-35px',
};

type TextFieldWithHideProps = Omit<TextFieldProps, 'type'> &
    TextFieldFormikProps;

const TextFieldWithHide = (props: TextFieldWithHideProps) => {
    const [showPassword, setShow] = useState(false);

    const handleShow = (): void => setShow(!showPassword);

    const buttonProps = {
        size: 'small' as const,
        sx: buttonStyles,
        onClick: handleShow,
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <TextFieldWithFormikValidation
                {...props}
                type={showPassword ? 'text' : 'password'}
            />
            {showPassword ? (
                <IconButton {...buttonProps}>
                    <VisibilityIcon />
                </IconButton>
            ) : (
                <IconButton {...buttonProps}>
                    <VisibilityOffIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default TextFieldWithHide;
