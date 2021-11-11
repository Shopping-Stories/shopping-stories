import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import ItemsOrServicesVariantsForm from './ItemsOrServicesVariants';

const ItemsOrServicesForm = ({ formikForm, prevIdx }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name={`itemEntries.${prevIdx}.itemsOrServices`}
                render={(arrayHelpers: any) => {
                    const refs =
                        formikForm.values.itemEntries[prevIdx].itemsOrServices;
                    const touched = formikForm.touched.itemEntries;
                    const errors = formikForm.errors.itemEntries;
                    const atLeastOneError =
                        touched &&
                        errors &&
                        touched.length > 0 &&
                        errors.length > 0 &&
                        touched.itemsEntries[prevIdx] &&
                        touched.itemsEntries[prevIdx].itemsOrServices &&
                        touched.itemsEntries[prevIdx].itemsOrServices.length > 0;

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
                                          formikForm.values.itemEntries[prevIdx]
                                              .itemsOrServices && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.quantity`}
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
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.qualifier`}
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
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.item`}
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

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.category`}
                                                      label={`category`}
                                                      value={ref?.category}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.category,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.category
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.subcategory`}
                                                      label={`Subcategory`}
                                                      value={ref?.subcategory}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.subcategory,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.subcategory
                                                      }
                                                  />

                                                  <Typography component="div" variant='h2'>
                                                      Unit Cost
                                                  </Typography>

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.unitCost.pounds`}
                                                      label={`Pounds`}
                                                      value={
                                                          ref?.unitCost.pounds
                                                      }
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.unitCost
                                                                  .pounds,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.unitCost
                                                              .pounds
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.unitCost.shilling`}
                                                      label={`Shilling`}
                                                      value={
                                                          ref?.unitCost.shilling
                                                      }
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.unitCost
                                                                  .shilling,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.unitCost
                                                              .shilling
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.unitCost.pence`}
                                                      label={`Pence`}
                                                      value={
                                                          ref?.unitCost.pence
                                                      }
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.unitCost
                                                                  .pence,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.unitCost
                                                              .pence
                                                      }
                                                  />
                                                  <Typography component="div" variant="h2">
                                                      Item Cost
                                                  </Typography>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.itemCost.pounds`}
                                                      label={`Pounds`}
                                                      value={
                                                          ref?.itemCost.pounds
                                                      }
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.itemCost
                                                                  .pounds,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.itemCost
                                                              .pounds
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.itemCost.shilling`}
                                                      label={`Shilling`}
                                                      value={
                                                          ref?.itemCost.shilling
                                                      }
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.itemCost
                                                                  .shilling,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.itemCost
                                                              .shilling
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`itemEntries.${prevIdx}.itemsOrServices.${index}.itemCost.pence`}
                                                      label={`Pence`}
                                                      value={
                                                          ref?.itemCost.pence
                                                      }
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.itemCost
                                                                  .pence,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.itemCost
                                                              .pence
                                                      }
                                                  />

                                                  <ItemsOrServicesVariantsForm
                                                      formikForm={formikForm}
                                                      prevPrevIdx={prevIdx}
                                                      prevIdx={index}
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
                                        variants: [],
                                        item: '',
                                        category: '',
                                        subcategory: '',
                                        unitCost: {
                                            pounds: 0,
                                            shilling: 0,
                                            pence: 0,
                                        },
                                        itemCost: {
                                            pounds: 0,
                                            shilling: 0,
                                            pence: 0,
                                        },
                                    })
                                }
                            >
                                add Item or Service
                            </Button>
                        </div>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default ItemsOrServicesForm;
