import TextField, { TextFieldProps } from '@mui/material/TextField';
import { get } from 'lodash';

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
            value={get(formikForm.values, fieldName)}
            onChange={formikForm.handleChange}
            {...textFieldProps}
            error={
                get(formikForm.touched, fieldName) &&
                Boolean(get(formikForm.errors, fieldName))
            }
            helperText={
                get(formikForm.touched, fieldName) &&
                get(formikForm.errors, fieldName)
            }
        />
    );
};

export default TextFieldWithFormikValidation;
