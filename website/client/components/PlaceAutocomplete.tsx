import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FetchPlaceQuery } from 'client/graphqlDefs';
import { PersonOrPlace, Place } from 'client/types';
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

const PlaceAutocomplete = (props: PeoplePlacesAutocompleteProps) => {
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

    interface PlaceQuery {
        place: Place;
    }

    const [result] = useQuery<PlaceQuery>({
        query: FetchPlaceQuery,
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
                {get(result.data?.place, fieldName) ? (
                    <Typography variant="body2">
                        {title}: {get(result.data?.place, fieldName)}
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
            getOptionLabel={(option: String | PersonOrPlace) => {let pp = option as PersonOrPlace; return pp.name || ''}}
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
                        formikForm={formikForm}
                        fieldName={nameField}
                        disabled={disabled}
                    />

                    {result.data?.place ? (
                        <Card sx={{ backgroundColor: 'var(--secondary-bg)' }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Tied to {result.data.place.location}
                                </Typography>
                                {optionalTypography('Alias', 'alias')}
                                {optionalTypography('Descriptor', 'descriptor')}
                            </CardContent>
                        </Card>
                    ) : null}
                </Stack>
            )}
        />
    );
};

export default PlaceAutocomplete;
