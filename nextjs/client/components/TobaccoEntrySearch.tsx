import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface TobaccoEntrySearchProps {
    formikForm: any;
}

const TobaccoEntrySearch = ({ formikForm }: TobaccoEntrySearchProps) => {
    const ref = formikForm.values.tobaccoEntry;
    const isSmallerThanMd = useMediaQuery((theme: any) =>
        theme.breakpoints.down('md'),
    );

    return (
        <div>
            {ref ? (
                <Stack
                    direction={isSmallerThanMd ? 'column' : 'row'}
                    spacing={2}
                >
                    <TextFieldWithFormikValidation
                        name={`tobaccoEntry.description`}
                        label={`Description`}
                        formikForm={formikForm}
                        fieldName={`tobaccoEntry.description`}
                    />
                    <TextFieldWithFormikValidation
                        name={`tobaccoEntry.tobaccoMarkName`}
                        label={`Tobacco Mark Name`}
                        formikForm={formikForm}
                        fieldName={`tobaccoEntry.tobaccoMarkName`}
                    />
                    <TextFieldWithFormikValidation
                        name={`tobaccoEntry.moneyType`}
                        label={`Type of Money`}
                        formikForm={formikForm}
                        fieldName={`tobaccoEntry.moneyType`}
                    />
                    <TextFieldWithFormikValidation
                        name={`tobaccoEntry.noteNumber`}
                        label={`Note Number`}
                        type="number"
                        inputProps={{ min: -1 }}
                        formikForm={formikForm}
                        fieldName={`tobaccoEntry.noteNumber`}
                    />
                </Stack>
            ) : null}
        </div>
    );
};

export default TobaccoEntrySearch;
