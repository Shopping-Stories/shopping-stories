import Autocomplete from '@mui/material/Autocomplete';
import { Mark } from 'client/types';
import { get } from 'lodash';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface MarkAutocompleteProps {
    formikForm: any;
    fieldName: string;
    index: number;
    label: string;
    labelOptions: Mark[];
    search: (search: string, index: number) => void;
}

const TobaccoMarkAutocomplete = (props: MarkAutocompleteProps) => {
    const { formikForm, fieldName, index, label, labelOptions, search } = props;
    const nameField = `${fieldName}.markName`;
    const idField = `${fieldName}.markID`;

    return (
        <Autocomplete
            sx={{ width: '100%' }}
            value={get(formikForm.values, fieldName)}
            onChange={(_, newValue: any) => {
                if (newValue) {
                    console.log(newValue);
                    formikForm.setFieldValue(nameField, newValue.markName);
                    formikForm.setFieldValue(idField, newValue.markID);
                }
            }}
            onInputChange={(_, newSearch: string, reason) => {
                if (reason !== 'reset') {
                    search(newSearch, index);
                }
            }}
            options={labelOptions}
            getOptionLabel={(option: Mark) => option.markName || ''}
            isOptionEqualToValue={(option: Mark, value: Mark) =>
                option.markName === value.markName ||
                option.markID === value.markID
            }
            freeSolo
            renderOption={(props, option: Mark) => {
                return (
                    <li {...props} key={option.markID}>
                        {option.markName || ''}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextFieldWithFormikValidation
                    {...params}
                    fullWidth
                    label={label}
                    name={nameField}
                    formikForm={formikForm}
                    fieldName={nameField}
                />
            )}
        />
    );
};

export default TobaccoMarkAutocomplete;
