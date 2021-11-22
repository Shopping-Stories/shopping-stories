import FormControlLabel, {
    FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextareaAutosize, {
    TextareaAutosizeProps,
} from '@mui/material/TextareaAutosize';

interface TextAreaFormikProps {
    formikForm: any;
    fieldName: string;
    name: string;
    label: string;
    formControlLabelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
}

type TextAreaProps = TextareaAutosizeProps & TextAreaFormikProps;

const TextAreaWithFormikValidation = (props: TextAreaProps) => {
    const { formikForm, fieldName, name, label, ...textAreaProps } = props;

    return (
        <>
            <FormControlLabel
                labelPlacement="top"
                {...props.formControlLabelProps}
                control={
                    <TextareaAutosize
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                        }}
                        name={name}
                        minRows={5}
                        {...textAreaProps}
                        value={formikForm.values[fieldName]}
                        onChange={formikForm.handleChange}
                    />
                }
                label={label}
            />
            <FormHelperText
                error={
                    formikForm.touched[fieldName] &&
                    Boolean(formikForm.errors[fieldName])
                }
            >
                {formikForm.touched[fieldName] && formikForm.errors[fieldName]}
            </FormHelperText>
        </>
    );
};

export default TextAreaWithFormikValidation;
