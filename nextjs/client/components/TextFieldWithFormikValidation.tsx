import TextField, { TextFieldProps } from '@mui/material/TextField';

interface TextFieldFormikProps {
    formikForm: any;
    fieldName: string;
}

type Props = TextFieldProps & TextFieldFormikProps;

const TextFieldWithFormikValidation = (props: Props) => {
    const { formikForm, fieldName, ...textFieldProps } = props;
    return (
        <TextField
            margin="dense"
            variant="filled"
            {...textFieldProps}
            value={formikForm.values[fieldName]}
            onChange={formikForm.handleChange}
            error={
                formikForm.touched[fieldName] &&
                Boolean(formikForm.errors[fieldName])
            }
            helperText={
                formikForm.touched[fieldName] && formikForm.errors[fieldName]
            }
        />
    );
};

export default TextFieldWithFormikValidation;
