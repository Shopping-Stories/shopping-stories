import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Input = styled('input')({
    display: 'none',
});

interface FileInputProps {
    label: string;
    accept?: string;
    multiple?: boolean;
    onChange?: (input: { files: File | File[] }) => any;
}

const FileInput = ({
    label,
    onChange,
    accept,
    multiple = false,
}: FileInputProps) => {
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
        <label htmlFor="contained-button-file">
            <Input
                id="contained-button-file"
                accept={accept}
                multiple={multiple}
                type="file"
                onChange={handleChange}
            />
            <Button variant="contained" component="span">
                {label}
            </Button>
            {fileOrFiles && !multiple && (
                <Typography>
                    Selected: {fileOrFiles instanceof File && fileOrFiles.name}
                </Typography>
            )}
        </label>
    );
};

export default FileInput;
