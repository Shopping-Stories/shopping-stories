import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';

const Input = styled('input')({
    display: 'none',
});

interface FileInputProps {
    label: string;
    accept?: string;
    multiple?: boolean;
    onChange?: (input: { files: File | File[] }) => any;
    icon?: boolean;
    children?: React.ReactNode;
    initialFilename?: string;
}

const FileInput = (props: FileInputProps) => {
    const {
        label,
        onChange,
        accept,
        multiple = false,
        icon = false,
        initialFilename,
    } = props;
    const [fileOrFiles, setSelectedFiles] = useState<File | File[]>();

    const handleChange = (event: { target: HTMLInputElement }) => {
        if (event.target.files) {
            const files = [...event.target.files];
            const currentFileOrFiles = multiple ? files : files[0];
            setSelectedFiles(currentFileOrFiles);
            if (!!onChange) {
                onChange({ files: currentFileOrFiles });
            }
        }
    };

    return (
        <label>
            <Input
                accept={accept}
                multiple={multiple}
                type="file"
                onChange={handleChange}
            />
            {icon ? (
                <IconButton component="span">{props.children}</IconButton>
            ) : (
                <Button variant="contained" component="span">
                    {label}
                </Button>
            )}
            {fileOrFiles && !multiple ? (
                <>
                    <br />
                    <Typography>
                        Selected:{' '}
                        {(fileOrFiles instanceof File && fileOrFiles.name) ||
                            initialFilename}
                    </Typography>
                </>
            ) : (
                <>
                    <br />
                    <Typography>
                        Selected: {initialFilename || 'none'}
                    </Typography>
                </>
            )}
        </label>
    );
};

export default FileInput;
