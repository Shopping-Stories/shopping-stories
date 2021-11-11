import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';

const LedgerReferencesForm = ({ formikForm }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="ledgerRefs"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values.ledgerRefs;
                    const touched = formikForm.touched.ledgerRefs;
                    const errors = formikForm.errors.ledgerRefs;
                    const atLeastOneError =
                        touched &&
                        errors &&
                        touched.length > 0 &&
                        errors.length > 0;

                    return (
                        <div>
                            {refs && refs.length > 0
                                ? refs.map((ref: string, index: number) => {
                                      let isError = false;
                                      let errorMessage = '';
                                      if (atLeastOneError) {
                                          isError =
                                              typeof errors[index] !==
                                              'undefined';
                                          errorMessage =
                                              touched[index] && errors[index];
                                      }

                                      return (
                                          formikForm.values.folioRefs && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`ledgerRefs.${index}`}
                                                      label={`Ledger ${index}`}
                                                      value={ref}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={isError}
                                                      helperText={errorMessage}
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
                                onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                            >
                                Add a Ledger Reference
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default LedgerReferencesForm;
