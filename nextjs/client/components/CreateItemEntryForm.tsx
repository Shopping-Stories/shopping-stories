import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';
import ItemsMentionedForm from './ItemsMentionedForm';
import ItemsOrServicesForm from './itemsOrSevicesForm';

const CreateItemEntryFrom = ({ formikForm }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="itemEntries"
                render={(arrayHelpers: any) => {
                    // const [inputValue, setInputValue] = useState<string>('');
                    const refs = formikForm.values.itemEntries;
                    const touched = formikForm.touched.itemEntries;
                    const errors = formikForm.errors.itemEntries;
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
                                          formikForm.values.itemEntries && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${index}.perOrder`}
                                                      label={`Amount Per Order`}
                                                      value={ref?.perOrder}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.perOrder,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.perOrder
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${index}.percentage`}
                                                      label={`Percentage`}
                                                      value={ref?.percentage}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.percentage,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.percentage
                                                      }
                                                  />

                                                  <ItemsOrServicesForm formikForm={formikForm} prevIdx={index} />
                                                  <ItemsMentionedForm formikForm={formikForm} prevIdx={index} />

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
                                        perOrder: 0,
                                        percentage: 0,
                                        itemsOrServices: [],
                                        itemsMentioned: [],
                                    })
                                }
                            >
                                Add Item or Service
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default CreateItemEntryFrom;
