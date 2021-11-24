import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface RegularEntrySearchProps {
    formikForm: any;
}

const RegularEntrySearch = ({ formikForm }: RegularEntrySearchProps) => {
    const ref = formikForm.values.regularEntry;
    const isSmallerThanMd = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    return (
        <div>
            {ref ? (
                <Stack direction={isSmallerThanMd ? "column" : "row"} spacing={2}>
                    <TextFieldWithFormikValidation
                        name={`regularEntry.entryDescription`}
                        label={`Description`}
                        formikForm={formikForm}
                        fieldName={`regularEntry.entryDescription`}
                    />
                    <TextFieldWithFormikValidation
                        name={`regularEntry.tobaccoMarkName`}
                        label={`Tobacco Mark Name`}
                        formikForm={formikForm}
                        fieldName={`regularEntry.tobaccoMarkName`}
                    />
                </Stack>
            ) : null}
        </div>
    );
};

export default RegularEntrySearch;
