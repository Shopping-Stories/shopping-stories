import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import EntryMoneyForm from './EntryMoneyForm';
import EntryNotesFrom from './EntryNotesForm';
import MarkForm from './MarksForm';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface TobaccoEntryFormProps {
    formikForm: any;
    disabled?: boolean;
}

const CreateTobaccoEntryFrom = ({
    formikForm,
    disabled,
}: TobaccoEntryFormProps) => {
    const ref = formikForm.values.tobaccoEntry;
    return (
        <div>
            {ref ? (
                <Stack spacing={2}>
                    <TextFieldWithFormikValidation
                        fullWidth
                        name={`tobaccoEntry.entry`}
                        label={`Entry`}
                        formikForm={formikForm}
                        fieldName={`tobaccoEntry.entry`}
                        disabled={disabled}
                    />
                    <TextFieldWithFormikValidation
                        fullWidth
                        name={`tobaccoEntry.tobaccoShaved`}
                        label={`Tobacco Shaved`}
                        type="number"
                        inputProps={{ min: 0 }}
                        formikForm={formikForm}
                        fieldName={`tobaccoEntry.tobaccoShaved`}
                        disabled={disabled}
                    />
                    <Card
                        sx={{
                            backgroundColor: 'var(--secondary-bg)',
                        }}
                    >
                        <CardHeader title="Tobacco Marks" />
                        <CardContent>
                            <MarkForm
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
                        <CardHeader title="Entry Notes" />
                        <CardContent>
                            <EntryNotesFrom
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
                        <CardHeader title="Money" />
                        <CardContent>
                            <EntryMoneyForm
                                disabled={disabled}
                                formikForm={formikForm}
                            />
                        </CardContent>
                    </Card>
                </Stack>
            ) : null}
        </div>
    );
};

export default CreateTobaccoEntryFrom;
