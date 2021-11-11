import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';
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

const EntryPeopleForm = ({ formikForm }: any) => {
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
        <FormikProvider value={formikForm}>
            <FieldArray
                name="people"
                render={(arrayHelpers: any) => {
                    // const [inputValue, setInputValue] = useState<string>('');
                    const refs = formikForm.values.people;
                    const touched = formikForm.touched.people;
                    const errors = formikForm.errors.people;
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
                                          formikForm.values.people && (
                                              <div key={index}>
                                                  <Autocomplete
                                                      value={
                                                          formikForm.values
                                                              .people[index]
                                                      }
                                                      onChange={(
                                                          _event: any,
                                                          newValue,
                                                      ) => {
                                                          if (newValue) {
                                                              formikForm.setFieldValue(
                                                                  `people.${index}.name`,
                                                                  newValue.name,
                                                              );
                                                              formikForm.setFieldValue(
                                                                  `people.${index}.id`,
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
                                                              `people.${index}.id`,
                                                              '',
                                                          );
                                                      }}
                                                      options={peopleOptions}
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
                                                              name={`people.${index}.name`}
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
                                                      name={`people.${index}.id`}
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
                                Add Person
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default EntryPeopleForm;
