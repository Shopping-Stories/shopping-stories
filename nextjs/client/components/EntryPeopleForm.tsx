import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FetchPeopleQuery } from 'client/graphqlDefs';
import { OptionsType, PersonOrPlace } from 'client/types';
import { FieldArray, FormikProvider } from 'formik';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import { useQuery } from 'urql';
import PeoplePlacesAutocomplete from './PeoplePlacesAutocomplete';

const EntryPeopleForm = ({ formikForm }: any) => {
    const [search, setSearch] = useState<string>('');

    const [options, _setOptions] = useState<OptionsType>({
        limit: 10,
        skip: null,
    });

    interface FetchPeopleQuery {
        people: PersonOrPlace[];
    }

    const [{ data }, _executeQuery] = useQuery<FetchPeopleQuery>({
        query: FetchPeopleQuery,
        variables: { options, search },
    });

    const peopleOptions = data?.people ?? [];

    const delayedPersonSearch = useCallback(
        debounce((search: string, index: number) => {
            setSearch(search);
            formikForm.setFieldValue(`people.${index}.id`, '');
        }, 250),
        [],
    );

    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="people"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values.people;
                    return (
                        <Stack spacing={2}>
                            <Typography component="h2">People</Typography>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => (
                                      <Stack
                                          key={index}
                                          direction="row"
                                          spacing={2}
                                      >
                                          <PeoplePlacesAutocomplete
                                              formikForm={formikForm}
                                              fieldName={`people.${index}`}
                                              index={index}
                                              label={`Person ${index}`}
                                              labelOptions={peopleOptions}
                                              search={delayedPersonSearch}
                                          />
                                          <div
                                              style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                              }}
                                          >
                                              <Button
                                                  variant="contained"
                                                  startIcon={<DeleteIcon />}
                                                  type="button"
                                                  onClick={() =>
                                                      arrayHelpers.remove(index)
                                                  }
                                              >
                                                  remove
                                              </Button>
                                          </div>
                                      </Stack>
                                  ))
                                : null}
                            <Button
                                variant="contained"
                                type="button"
                                startIcon={<AddCircleIcon />}
                                onClick={() =>
                                    arrayHelpers.push({ name: '', id: '' })
                                }
                            >
                                Add
                            </Button>
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default EntryPeopleForm;
