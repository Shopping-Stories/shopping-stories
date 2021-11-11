import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';
import { useState } from 'react';
import { useQuery } from 'urql';

const queryDef = `
query searchPlaces($search: String!, $options: FindAllLimitAndSkip) {
  places: findPlaces(search: $search, options: $options) {
    id
    name: location
  }
}
`;

const EntryPlacesForm = ({ formikForm }: any) => {
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

    const placesOptions = data?.places ?? [];

    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="places"
                render={(arrayHelpers: any) => {
                    // const [inputValue, setInputValue] = useState<string>('');
                    const refs = formikForm.values.places;
                    const touched = formikForm.touched.places;
                    const errors = formikForm.errors.places;
                    const atLeastOneError =
                        touched &&
                        errors &&
                        touched.length > 0 &&
                        errors.length > 0;

                    return (
                        <div>
                            {refs && refs.length > 0
                                ? refs.map((ref: any, index: number) => {
                                      let isError = false;
                                      let errorMessage: any;
                                      if (atLeastOneError) {
                                          isError =
                                              typeof errors[index] !==
                                              'undefined';
                                          errorMessage =
                                              touched[index] && errors[index];
                                      }

                                      return (
                                          formikForm.values.places && (
                                              <div key={index}>
                                                  <Autocomplete
                                                      value={
                                                          formikForm.values
                                                              .places[index]
                                                      }
                                                      onChange={(
                                                          _event: any,
                                                          newValue,
                                                      ) => {
                                                          if (newValue) {
                                                              formikForm.setFieldValue(
                                                                  `places.${index}.name`,
                                                                  newValue.name,
                                                              );
                                                              formikForm.setFieldValue(
                                                                  `places.${index}.id`,
                                                                  newValue.id,
                                                              );
                                                          }
                                                      }}
                                                      onInputChange={(
                                                          _event,
                                                          newInputValue,
                                                      ) => {
                                                          setSearch(
                                                              newInputValue,
                                                          );
                                                          formikForm.setFieldValue(
                                                              `places.${index}.id`,
                                                              '',
                                                          );
                                                      }}
                                                      options={placesOptions}
                                                      getOptionLabel={(
                                                          option: any,
                                                      ) => option.name || ''}
                                                      isOptionEqualToValue={(
                                                          option: any,
                                                          value: any,
                                                      ) =>
                                                          option.name === value.name || true
                                                      }
                                                      freeSolo
                                                      renderOption={(
                                                          props: any,
                                                          option: any,
                                                      ) => {
                                                          return (
                                                              <li
                                                                  {...props}
                                                                  key={
                                                                      option.id
                                                                  }
                                                              >
                                                                  {option.name ||
                                                                      ''}
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
                                                              name={`places.${index}.name`}
                                                              label={`Name`}
                                                              value={ref?.name}
                                                              onChange={
                                                                  formikForm.handleChange
                                                              }
                                                              error={
                                                                  isError &&
                                                                  Boolean(
                                                                      errorMessage?.name,
                                                                  )
                                                              }
                                                              helperText={
                                                                  errorMessage?.name
                                                              }
                                                          />
                                                      )}
                                                  />
                                                  {/* <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`places.${index}.id`}
                                                      label={`ID`}
                                                      value={ref?.id}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.id,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.id
                                                      }
                                                  /> */}
                                                  <br />
                                                  <Button
                                                      variant="contained"
                                                      type="button"
                                                      onClick={() =>
                                                          arrayHelpers.remove(
                                                              index,
                                                          )
                                                      }
                                                  >
                                                      remove from list
                                                  </Button>
                                              </div>
                                          )
                                      );
                                  })
                                : null}
                            <Button
                                variant="contained"
                                type="button"
                                onClick={() =>
                                    arrayHelpers.push({ name: '', id: '' })
                                } // insert an empty string at a position
                            >
                                Add Place
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default EntryPlacesForm;
