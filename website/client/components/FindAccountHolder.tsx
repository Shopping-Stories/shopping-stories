import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FetchPersonQuery } from 'client/graphqlDefs';
import { Person } from 'client/types';
import { get } from 'lodash';
import debounce from 'lodash/debounce';
import { Fragment, useCallback, useEffect, useState } from 'react';
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

interface FindAccountProps {
    formikForm: any;
    disabled?: boolean;
}

const FindAccountHolder = ({ formikForm, disabled }: FindAccountProps) => {
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
        requestPolicy: 'cache-and-network',
    });

    const peopleOptions = data?.people ?? [];

    const delayedPersonSearch = useCallback(
        debounce((search: string) => {
            setSearch(search);
            formikForm.setFieldValue(`accountHolder.accountHolderID`, '');
        }, 250),
        [],
    );

    const id = formikForm.values.accountHolder.accountHolderID;
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

    // only display the field if it exists
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
            value={{
                name: search,
                id: formikForm.values.accountHolder.accountHolderID,
            }}
            onChange={(_, newValue: any) => {
                if (newValue) {
                    formikForm.setFieldValue(
                        `accountHolder.accountHolderID`,
                        newValue.id,
                    );
                    setSearch(newValue.name);
                }
            }}
            onInputChange={(_, newSearch: string, reason) => {
                if (reason !== 'reset') {
                    delayedPersonSearch(newSearch);
                }
            }}
            options={disabled ? [] : peopleOptions}
            getOptionLabel={(option: any) => option.name || ''}
            isOptionEqualToValue={(option: any, value: any) =>
                option.name === value.name
            }
            freeSolo
            renderOption={(props, option: any) => {
                return (
                    <li {...props} key={option.id}>
                        {option.name || ''}
                    </li>
                );
            }}
            renderInput={(params) => (
                <Stack spacing={2}>
                    <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        label={`Account Holder`}
                        disabled={disabled}
                        error={
                            formikForm.touched.accountHolder?.accountHolderID &&
                            Boolean(
                                formikForm.errors.accountHolder
                                    ?.accountHolderID,
                            )
                        }
                        helperText={
                            formikForm.touched.accountHolder?.accountHolderID &&
                            formikForm.errors.accountHolder?.accountHolderID
                        }
                    />
                    {result.data?.person ? (
                        <Card>
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

export default FindAccountHolder;
