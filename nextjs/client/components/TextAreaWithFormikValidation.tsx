import { TextFieldProps } from '@mui/material/TextField';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface TextAreaFormikProps {
    formikForm: any;
    fieldName: string;
    name: string;
    label: string;
}

type TextAreaProps = TextFieldProps & TextAreaFormikProps;

const TextAreaWithFormikValidation = (props: TextAreaProps) => {
    const { formikForm, ...otherProps } = props;

    return (
        <div>
            <TextFieldWithFormikValidation
                fullWidth
                multiline
                minRows={5}
                {...otherProps}
                formikForm={formikForm}
            />
        </div>
    );
};

export default TextAreaWithFormikValidation;
