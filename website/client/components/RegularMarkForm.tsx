import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FetchTobaccoMarks } from 'client/graphqlDefs';
import { OptionsType, RegularEntry } from 'client/types';
import { FieldArray, FormikProvider } from 'formik';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import { useQuery } from 'urql';
import TobaccoMarkAutocomplete from './TobaccoMarkAutocomplete';

const RegularMarkForm = ({ formikForm }: any) => {
    const [search, setSearch] = useState<string>('');

    const [options, _setOptions] = useState<OptionsType>({
        limit: 10,
        skip: null,
    });

    const [{ data }, _executeQuery] = useQuery({
        query: FetchTobaccoMarks,
        variables: { options, search },
        requestPolicy: 'cache-and-network',
    });

    const marksOptions = data?.marks ?? [];

    const delayedMarkSearch = useCallback(
        debounce((search: string, index: number) => {
            setSearch(search);
            formikForm.setFieldValue(
                `regularEntry.tobaccoMarks[${index}].markID`,
                '',
            );
        }, 500),
        [],
    );

    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="regularEntry.tobaccoMarks"
                render={(arrayHelpers: any) => {
                    const refs: RegularEntry['tobaccoMarks'] =
                        formikForm.values?.regularEntry?.tobaccoMarks;

                    return (
                        <Stack spacing={2}>
                            {refs && refs.length > 0
                                ? refs.map((_, index) => {
                                      return (
                                          <Stack
                                              spacing={2}
                                              direction="row"
                                              key={index}
                                          >
                                              <TobaccoMarkAutocomplete
                                                  fieldName={`regularEntry.tobaccoMarks[${index}]`}
                                                  index={index}
                                                  label={`Mark ${index}`}
                                                  labelOptions={marksOptions}
                                                  search={delayedMarkSearch}
                                                  formikForm={formikForm}
                                              />
                                              <div
                                                  style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                  }}
                                              >
                                                  <Button
                                                      variant="contained"
                                                      type="button"
                                                      startIcon={<DeleteIcon />}
                                                      onClick={() =>
                                                          arrayHelpers.remove(
                                                              index,
                                                          )
                                                      }
                                                  >
                                                      remove
                                                  </Button>
                                              </div>
                                          </Stack>
                                      );
                                  })
                                : null}
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
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default RegularMarkForm;
