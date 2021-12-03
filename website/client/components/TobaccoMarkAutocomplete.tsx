import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FetchTobaccoMarkQuery } from 'client/graphqlDefs';
import { Mark, TobaccoMark } from 'client/types';
import { get } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'urql';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface MarkAutocompleteProps {
    formikForm: any;
    fieldName: string;
    index: number;
    label: string;
    labelOptions: Mark[];
    search: (search: string, index: number) => void;
    disabled?: boolean;
}

const TobaccoMarkAutocomplete = (props: MarkAutocompleteProps) => {
    const {
        formikForm,
        fieldName,
        index,
        label,
        labelOptions,
        search,
        disabled,
    } = props;
    const nameField = `${fieldName}.markName`;
    const idField = `${fieldName}.markID`;

    const id = get(formikForm.values, idField);
    const [queryId, setQueryId] = useState(id || '');

    interface MarkQuery {
        mark: TobaccoMark;
    }

    const [result] = useQuery<MarkQuery>({
        query: FetchTobaccoMarkQuery,
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
                {get(result.data?.mark, fieldName) ? (
                    <Typography variant="body2">
                        {title}: {get(result.data?.mark, fieldName)}
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
                    formikForm.setFieldValue(nameField, newValue.markName);
                    formikForm.setFieldValue(idField, newValue.markID);
                }
            }}
            onInputChange={(_, newSearch: string, reason) => {
                if (reason !== 'reset') {
                    search(newSearch, index);
                }
            }}
            options={disabled ? [] : labelOptions}
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
                <Stack spacing={2}>
                    <TextFieldWithFormikValidation
                        {...params}
                        fullWidth
                        label={label}
                        name={nameField}
                        formikForm={formikForm}
                        fieldName={nameField}
                        disabled={disabled}
                    />

                    {result.data?.mark ? (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Tied to {result.data.mark.tobaccoMarkId}
                                </Typography>
                                {optionalTypography(
                                    'Tobacco Mark ID',
                                    'tobaccoMarkId',
                                )}
                                {optionalTypography(
                                    'Description',
                                    'description',
                                )}
                                {optionalTypography('netWeight', 'netWeight')}
                                {optionalTypography('Note', 'note')}
                                {optionalTypography('Notes', 'Notes')}
                                {optionalTypography('Warehouse', 'warehouse')}
                                {optionalTypography('Where', 'where')}
                                {optionalTypography(
                                    'Who it represents',
                                    'whoRepresents',
                                )}
                                {optionalTypography('Under who', 'whoUnder')}
                            </CardContent>
                        </Card>
                    ) : null}
                </Stack>
            )}
        />
    );
};

export default TobaccoMarkAutocomplete;
