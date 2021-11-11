import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';

const ItemsOrServicesVariantsForm = ({
    formikForm,
    prevPrevIdx,
    prevIdx,
}: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name={`itemEntries.${prevPrevIdx}.itemsOrServices.${prevIdx}.variants`}
                render={(arrayHelpers: any) => {
                    const refs =
                        formikForm.values.itemEntries[prevPrevIdx].itemsOrServices[
                            prevIdx
                        ].variants;
                    const touched = formikForm.touched.itemEntries;
                    const errors = formikForm.errors.itemEntries;
                    const atLeastOneError =
                        touched &&
                        errors &&
                        touched.length > 0 &&
                        errors.length > 0 &&
                        touched.itemsEntries[prevPrevIdx] &&
                        touched.itemsEntries[prevPrevIdx].itemsOrServices &&
                        touched.itemsEntries[prevPrevIdx].itemsOrServices.length > 0 &&
                        touched.itemsEntries[prevPrevIdx].itemsOrServices[prevIdx] &&
                        touched.itemsEntries[prevPrevIdx].itemsOrServices[prevIdx].length > 0 &&
                        touched.itemsEntries[prevPrevIdx].itemsOrServices[prevIdx].variants &&
                        touched.itemsEntries[prevPrevIdx].itemsOrServices[prevIdx].variants.length > 0;

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
                                          formikForm.values.itemEntries[
                                              prevPrevIdx
                                          ].itemsOrServices[prevIdx]
                                              .variants && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevPrevIdx}.itemsOrServices.${prevIdx}.variants.${index}`}
                                                      label={`Name`}
                                                      value={ref}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(errorMessage)
                                                      }
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
                                Add Variant
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default ItemsOrServicesVariantsForm;
