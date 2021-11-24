import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FetchPlacesQuery } from 'client/graphqlDefs';
import { OptionsType, PersonOrPlace } from 'client/types';
import { FieldArray, FormikProvider } from 'formik';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import { useQuery } from 'urql';
import PeoplePlacesAutocomplete from './PeoplePlacesAutocomplete';

const EntryPlacesForm = ({ formikForm }: any) => {
    const [search, setSearch] = useState<string>('');

    const [options, _setOptions] = useState<OptionsType>({
        limit: 10,
        skip: null,
    });
    interface FetchPlacesQuery {
        places: PersonOrPlace[];
    }

    const [{ data }, _executeQuery] = useQuery<FetchPlacesQuery>({
        query: FetchPlacesQuery,
        variables: { options, search },
    });

    const placesOptions = data?.places ?? [];

    const delayedPlacesSearch = useCallback(
        debounce((search: string, index: number) => {
            setSearch(search);
            formikForm.setFieldValue(`places[${index}].id`, '');
        }, 250),
        [],
    );

    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="places"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values.places;
                    return (
                        <Stack spacing={2}>
                            <Typography component="h2">Places</Typography>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => (
                                      <Stack
                                          key={index}
                                          direction="row"
                                          spacing={2}
                                      >
                                          <PeoplePlacesAutocomplete
                                              formikForm={formikForm}
                                              fieldName={`places[${index}]`}
                                              index={index}
                                              label={`Place ${index}`}
                                              labelOptions={placesOptions}
                                              search={delayedPlacesSearch}
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

export default EntryPlacesForm;
