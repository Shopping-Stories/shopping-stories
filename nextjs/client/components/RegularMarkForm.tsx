import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';
import { useState } from 'react';
import { useQuery } from 'urql';

const queryDef = `
query searchPeople($search: String!, $options: FindAllLimitAndSkip) {
  marks: findTobaccoMarks(search: $search, options: $options) {
    id
    markID: id
    markName: description
    # tobaccoMarkId
  }
}
`;

const RegularMarkForm = ({ formikForm }: any) => {
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

    const marksOptions = data?.marks ?? [];

    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="regularEntry.tobaccoMarks"
                render={(arrayHelpers: any) => {
                    // const [inputValue, setInputValue] = useState<string>('');
                    const refs = formikForm.values?.regularEntry?.tobaccoMarks;
                    const touched = formikForm.touched?.regularEntry?.tobaccoMarks;
                    const errors = formikForm.errors?.regularEntry?.tobaccoMarks;
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
                                          formikForm.values.regularEntry
                                              .tobaccoMarks && (
                                              <div key={index}>
                                                  <Autocomplete
                                                      value={
                                                          formikForm.values
                                                              .regularEntry
                                                              .tobaccoMarks[index]
                                                      }
                                                      onChange={(
                                                          _event: any,
                                                          newValue,
                                                      ) => {
                                                          if (newValue) {
                                                              formikForm.setFieldValue(
                                                                  `regularEntry.tobaccoMarks.${index}.markName`,
                                                                  newValue.markName,
                                                              );
                                                              formikForm.setFieldValue(
                                                                  `regularEntry.tobaccoMarks.${index}.markID`,
                                                                  newValue.markID,
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
                                                              `regularEntry.tobaccoMarks.${index}.markID`,
                                                              '',
                                                          );
                                                      }}
                                                      options={marksOptions}
                                                      getOptionLabel={(
                                                          option: any,
                                                      ) => option.markName || ''}
                                                      isOptionEqualToValue={(
                                                          option: any,
                                                          value: any,
                                                      ) =>
                                                          option.markName ===
                                                              value.markName || true
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
                                                                      option.markID
                                                                  }
                                                              >
                                                                  {option.markName ||
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
                                                              name={`regularEntry.tobaccoMarks.${index}.markName`}
                                                              label={`mark name`}
                                                              value={
                                                                  ref?.markName
                                                              }
                                                              onChange={
                                                                  formikForm.handleChange
                                                              }
                                                              error={
                                                                  isError &&
                                                                  Boolean(
                                                                      errorMessage?.markName,
                                                                  )
                                                              }
                                                              helperText={
                                                                  errorMessage?.markName
                                                              }
                                                          />
                                                      )}
                                                  />
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
                                    arrayHelpers.push({
                                        markName: '',
                                        markID: '',
                                    })
                                }
                            >
                                Add Mark
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default RegularMarkForm;
