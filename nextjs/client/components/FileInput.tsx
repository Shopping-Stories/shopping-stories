import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Input = styled('input')({
  display: 'none',
});

const FileInput = ({ label, onChange }: any) => {
	const [_attachment, setAttachment] = useState<any>();

	const handleChange = (event: any) => {
		const files = Array.from(event.target.files);
		const [file]: any[] = files;
		setAttachment(file);
		if (!!onChange) onChange({ file });
		console.log(file);
	};

	return (
		<label htmlFor="contained-button-file">
			<Input
				id="contained-button-file"
				// @ts-ignore
				accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				multiple
				type="file"
				onChange={handleChange}
			/>
			<Button variant="contained" component="span">
				{label}
			</Button>
		</label>
	);
};

export default FileInput;
