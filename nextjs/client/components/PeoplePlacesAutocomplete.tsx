import Autocomplete from '@mui/material/Autocomplete';
import { PersonOrPlace } from 'client/types';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface PeoplePlacesAutocompleteProps {
    formikForm: any;
    fieldName: string;
    index: number;
    label: string;
    labelOptions: PersonOrPlace[];
    search: (search: string, index: number) => void;
}

const PeoplePlacesAutocomplete = (props: PeoplePlacesAutocompleteProps) => {
    const { formikForm, fieldName, index, label, labelOptions, search } = props;
    const nameField = `${fieldName}.name`;
    const idField = `${fieldName}.id`;

    return (
        <Autocomplete
            sx={{ width: '100%' }}
            value={formikForm.values[fieldName]}
            onChange={(_, newValue: any) => {
                if (newValue) {
                    formikForm.setFieldValue(nameField, newValue.name);
                    formikForm.setFieldValue(idField.trim(), newValue.id);
                }
            }}
            onInputChange={(_, newSearch: string, reason) => {
                if (reason !== 'reset') {
                    search(newSearch, index);
                }
            }}
            options={labelOptions}
            getOptionLabel={(option: PersonOrPlace) => option.name || ''}
            isOptionEqualToValue={(
                option: PersonOrPlace,
                value: PersonOrPlace,
            ) => option.name === value.name}
            freeSolo
            renderOption={(props, option: PersonOrPlace) => {
                return (
                    <li {...props} key={option.id}>
                        {option.name || ''}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextFieldWithFormikValidation
                    {...params}
                    fullWidth
                    name={nameField}
                    label={label}
                    formikForm={formikForm}
                    fieldName={nameField}
                />
            )}
        />
    );
};

export default PeoplePlacesAutocomplete;
