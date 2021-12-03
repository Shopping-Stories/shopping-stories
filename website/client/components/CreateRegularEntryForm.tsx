import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import RegularItemsMentionedForm from './RegularItemsMentionedForm';
import RegularMarkForm from './RegularMarkForm';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface RegularEntryFormProps {
    formikForm: any;
    disabled?: boolean;
}

const CreateRegularEntryFrom = ({
    formikForm,
    disabled,
}: RegularEntryFormProps) => {
    const ref = formikForm.values.regularEntry;
    return (
        <div>
            {ref ? (
                <Stack spacing={2}>
                    <TextFieldWithFormikValidation
                        fullWidth
                        name={`regularEntry.entry`}
                        label={`Entry`}
                        formikForm={formikForm}
                        fieldName={`regularEntry.entry`}
                        disabled={disabled}
                    />

                    <Card
                        sx={{
                            backgroundColor: 'var(--secondary-bg)',
                        }}
                    >
                        <CardHeader title="Tobacco Marks" />
                        <CardContent>
                            <RegularMarkForm
                                disabled={disabled}
                                formikForm={formikForm}
                            />
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            backgroundColor: 'var(--secondary-bg)',
                        }}
                    >
                        <CardHeader title="Items Mentioned" />
                        <CardContent>
                            <RegularItemsMentionedForm
                                formikForm={formikForm}
                                disabled={disabled}
                            />
                        </CardContent>
                    </Card>
                </Stack>
            ) : null}
        </div>
    );
};

export default CreateRegularEntryFrom;
