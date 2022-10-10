import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FetchPersonQuery } from 'client/graphqlDefs';
import { Person, PersonOrPlace } from 'client/types';
import { get } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface PeoplePlacesAutocompleteProps {
    formikForm: any;
    fieldName: string;
    index: number;
    label: string;
    labelOptions: PersonOrPlace[];
    search: (search: string, index: number) => void;
    disabled?: boolean;
}

const PersonAutocomplete = (props: PeoplePlacesAutocompleteProps) => {
    const {
        formikForm,
        fieldName,
        index,
        label,
        labelOptions,
        search,
        disabled,
    } = props;
    const nameField = `${fieldName}.name`;
    const idField = `${fieldName}.id`;

    const id = get(formikForm.values, idField);
    const [queryId, setQueryId] = useState(id || '');

    interface PersonQuery {
        person: Person;
    }

    const [result] = useQuery<PersonQuery>({
        query: FetchPersonQuery,
        pause: !Boolean(queryId.trim()),
        variables: { id: queryId },
    });

    useEffect(() => {
        if (id) {
            setQueryId(id);
        }
    }, [id]);

    const optionalTypography = (title: string, fieldName: string) => {
        return (
            <Fragment>
                {get(result.data?.person, fieldName) ? (
                    <Typography variant="body2">
                        {title}: {get(result.data?.person, fieldName)}
                    </Typography>
                ) : null}
            </Fragment>
        );
    };

    return (
        <Autocomplete
            sx={{ width: '100%' }}
            value={get(formikForm.values, fieldName)}
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
            options={disabled ? [] : labelOptions}
            getOptionLabel={(option: String |PersonOrPlace) => {let pp = option as PersonOrPlace; return pp.name || ''}}
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
                <Stack spacing={2}>
                    <TextFieldWithFormikValidation
                        {...params}
                        fullWidth
                        name={nameField}
                        label={label}
                        disabled={disabled}
                        formikForm={formikForm}
                        fieldName={nameField}
                    />

                    {result.data?.person ? (
                        <Card sx={{ backgroundColor: 'var(--secondary-bg)' }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Tied to{' '}
                                    {`${result.data.person.firstName} ${result.data.person.lastName}`.trim()}
                                </Typography>
                                {optionalTypography('First name', 'firstName')}
                                {optionalTypography('Last name', 'lastName')}
                                {optionalTypography('Prefix', 'prefix')}
                                {optionalTypography('Suffix', 'suffix')}
                                {optionalTypography('Account', 'account')}
                                {optionalTypography('Enslaved', 'enslaved')}
                                {optionalTypography('Gender', 'gender')}
                                {optionalTypography('Location', 'location')}
                                {optionalTypography('Profession', 'profession')}
                                {optionalTypography('Location', 'firstName')}
                                {optionalTypography('Store', 'store')}
                                {optionalTypography('Variations', 'variations')}
                            </CardContent>
                        </Card>
                    ) : null}
                </Stack>
            )}
        />
    );
};

export default PersonAutocomplete;
