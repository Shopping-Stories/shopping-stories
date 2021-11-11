import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useQuery } from 'urql';

const queryDef = `
query searchPeople($search: String!, $options: FindAllLimitAndSkip) {
  people: findPeople(search: $search, options: $options) {
    id
    firstName
    lastName
    name: fullName
  }
}
`;

const FindAccountHolder = ({ formikForm }: any) => {
    interface OptionsType {
        limit: number | null;
        skip: number | null;
    }

    const [search, setSearch] = useState<string>('');

    const [options, _setOptions] = useState<OptionsType>({
        limit: 10,
        skip: null,
    });

    const [{ data }, _executeQuery] = useQuery({
        query: queryDef,
        variables: { options, search },
    });

    const peopleOptions = data?.people ?? [];

    return (
        <Autocomplete
            value={{
                name: search,
                id: formikForm.values.accountHolder.accountHolderID,
            }}
            onChange={(_event: any, newValue: any) => {
                if (newValue) {
                    formikForm.setFieldValue(
                        `accountHolder.accountHolderID`,
                        newValue.id,
                    );
                    setSearch(newValue.name);
                }
            }}
            onInputChange={(_event, newInputValue) => {
                setSearch(newInputValue);
                formikForm.setFieldValue(`accountHolder.accountHolderID`, '');
            }}
            options={peopleOptions}
            getOptionLabel={(option: any) => option.name || ''}
            isOptionEqualToValue={(option: any, value: any) =>
                option.name === value.name || true
            }
            freeSolo
            renderOption={(props: any, option: any) => {
                return (
                    <li {...props} key={option.id}>
                        {option.name || ''}
                    </li>
                );
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    margin="dense"
                    variant="standard"
                    label={`Account Holder`}
                    error={
                        formikForm.touched.accountHolder?.accountHolderID &&
                        Boolean(
                            formikForm.errors.accountHolder?.accountHolderID,
                        )
                    }
                    helperText={
                        formikForm.touched.accountHolder?.accountHolderID &&
                        formikForm.errors.accountHolder?.accountHolderID
                    }
                />
            )}
        />
    );
};

export default FindAccountHolder;
