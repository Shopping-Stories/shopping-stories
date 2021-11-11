
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';

const RegularItemsMentionedForm = ({ formikForm }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name={`regularEntry.itemsMentioned`}
                render={(arrayHelpers: any) => {
                    const refs =
                        formikForm.values.regularEntry.itemsMentioned;
                    const touched = formikForm.touched.itemEntries;
                    const errors = formikForm.errors.itemEntries;
                    const atLeastOneError =
                        touched &&
                        errors &&
                        touched.length > 0 &&
                        errors.length > 0 &&
                        touched.regularEntry &&
                        touched.regularEntry.itemsMentioned &&
                        touched.regularEntry.itemsMentioned.length > 0;

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
                                              .itemsMentioned && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`regularEntry.itemsMentioned.${index}.quantity`}
                                                      label={`quantity`}
                                                      value={ref?.quantity}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.quantity,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.quantity
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`regularEntry.itemsMentioned.${index}.qualifier`}
                                                      label={`Qualifier`}
                                                      value={ref?.qualifier}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.qualifier,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.qualifier
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`regularEntry.itemsMentioned.${index}.item`}
                                                      label={`Item`}
                                                      value={ref?.item}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.item,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.item
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
                                        quantity: 0,
                                        qualifier: '',
                                        item: '',
                                    })
                                }
                            >
                                Add Mentioned Item
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default RegularItemsMentionedForm;
