import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';

const EntryNotesFrom = ({ formikForm }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="tobaccoEntry.notes"
                render={(arrayHelpers: any) => {
                    // const [inputValue, setInputValue] = useState<string>('');
                    const refs = formikForm.values?.tobaccoEntry?.notes;
                    const touched = formikForm.touched?.tobaccoEntry?.notes;
                    const errors = formikForm.errors?.tobaccoEntry?.notes;
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
                                          formikForm.values?.tobaccoEntry
                                              ?.notes && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.notes.${index}.noteNum`}
                                                      label={`Note number`}
                                                      value={ref?.noteNum}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.noteNum,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.noteNum
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.notes.${index}.totalWeight`}
                                                      label={`Total Weight`}
                                                      value={ref?.totalWeight}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.totalWeight,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.totalWeight
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.notes.${index}.barrelWeight`}
                                                      label={`Barrel Weight`}
                                                      value={ref?.barrelWeight}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.barrelWeight,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.barrelWeight
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.notes.${index}.tobaccoWeight`}
                                                      label={`Tobacco Weight`}
                                                      value={ref?.tobaccoWeight}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.tobaccoWeight,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.tobaccoWeight
                                                      }
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
                                        noteNum: -1,
                                        totalWeight: 0,
                                        barrelWeight: 0,
                                        tobaccoWeight: 0,
                                    })
                                }
                            >
                                Add Note
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default EntryNotesFrom;
