import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FetchTobaccoMarks } from 'client/graphqlDefs';
import { Mark, OptionsType } from 'client/types';
import { FieldArray, FormikProvider } from 'formik';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import { useQuery } from 'urql';
import TobaccoMarkAutocomplete from './TobaccoMarkAutocomplete';

interface MarkFormProps {
    formikForm: any;
    disabled?: boolean;
}

const MarkForm = ({ formikForm, disabled }: MarkFormProps) => {
    const [search, setSearch] = useState<string>('');

    const [options, _setOptions] = useState<OptionsType>({
        limit: 10,
        skip: null,
    });
    interface MarkQuery {
        marks: Mark[];
    }

    const [{ data }, _executeQuery] = useQuery<MarkQuery>({
        query: FetchTobaccoMarks,
        variables: { options, search },
    });

    const marksOptions = data?.marks ?? [];

    const delayedTobaccoMarkSearch = useCallback(
        debounce((search: string, index: number) => {
            setSearch(search);
            formikForm.setFieldValue(`tobaccoEntry.marks[${index}].markID`, '');
        }, 250),
        [],
    );

    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="tobaccoEntry.marks"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values?.tobaccoEntry?.marks;

                    return (
                        <Stack spacing={2}>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => {
                                      return (
                                          <Stack
                                              spacing={2}
                                              direction="row"
                                              key={index}
                                          >
                                              <TobaccoMarkAutocomplete
                                                  fieldName={`tobaccoEntry.marks[${index}]`}
                                                  index={index}
                                                  label={`Mark ${index}`}
                                                  labelOptions={marksOptions}
                                                  search={
                                                      delayedTobaccoMarkSearch
                                                  }
                                                  formikForm={formikForm}
                                                  disabled={disabled}
                                              />
                                              {disabled === true ? null : (
                                                  <div
                                                      style={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                      }}
                                                  >
                                                      <Button
                                                          variant="contained"
                                                          type="button"
                                                          startIcon={
                                                              <DeleteIcon />
                                                          }
                                                          onClick={() =>
                                                              arrayHelpers.remove(
                                                                  index,
                                                              )
                                                          }
                                                      >
                                                          remove
                                                      </Button>
                                                  </div>
                                              )}
                                          </Stack>
                                      );
                                  })
                                : null}
                            {disabled === true ? null : (
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() =>
                                        arrayHelpers.push({
                                            markName: '',
                                            markID: '',
                                        })
                                    }
                                >
                                    Add
                                </Button>
                            )}
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default MarkForm;
