import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FieldArray, FormikProvider } from 'formik';

const EntryMoneyFrom = ({ formikForm }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="tobaccoEntry.money"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values?.tobaccoEntry?.money;
                    const touched = formikForm.touched?.tobaccoEntry?.money;
                    const errors = formikForm.errors?.tobaccoEntry?.money;
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
                                              ?.money && (
                                              <div key={index}>
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.moneyType`}
                                                      label={`Type of Money`}
                                                      value={ref?.moneyType}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.moneyType,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.moneyType
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.tobaccoAmount`}
                                                      label={`Amount of Tobacco`}
                                                      value={ref?.tobaccoAmount}
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.tobaccoAmount,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.tobaccoAmount
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.casksInTransaction`}
                                                      label={`Barrel Weight`}
                                                      value={
                                                          ref?.casksInTransaction
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage?.casksInTransaction,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage?.casksInTransaction
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.rateForTobacco.pounds`}
                                                      label={`Rate for Tobacco: Pounds`}
                                                      value={
                                                          ref?.rateForTobacco
                                                              .pounds
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.rateForTobacco
                                                                  .pounds,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.rateForTobacco
                                                              .pounds
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.rateForTobacco.shilling`}
                                                      label={`Rate for Tobacco: shilling`}
                                                      value={
                                                          ref?.rateForTobacco
                                                              .shilling
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.rateForTobacco
                                                                  .shilling,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.rateForTobacco
                                                              .shilling
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.rateForTobacco.pence`}
                                                      label={`Rate for Tobacco: pence`}
                                                      value={
                                                          ref?.rateForTobacco
                                                              .pence
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.rateForTobacco
                                                                  .pence,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.rateForTobacco
                                                              .pence
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.tobaccoSold.pounds`}
                                                      label={`Tobacco Sold: Pounds`}
                                                      value={
                                                          ref?.tobaccoSold
                                                              .pounds
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.tobaccoSold
                                                                  .pounds,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.tobaccoSold
                                                              .pounds
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.tobaccoSold.shilling`}
                                                      label={`Rate for Tobacco: shilling`}
                                                      value={
                                                          ref?.tobaccoSold
                                                              .shilling
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.tobaccoSold
                                                                  .shilling,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.tobaccoSold
                                                              .shilling
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.tobaccoSold.pence`}
                                                      label={`Tobacco Sold: pence`}
                                                      value={
                                                          ref?.tobaccoSold.pence
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.tobaccoSold
                                                                  .pence,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.tobaccoSold
                                                              .pence
                                                      }
                                                  />

                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.casksSoldForEach.pounds`}
                                                      label={`Casks Sold for Each: Pounds`}
                                                      value={
                                                          ref?.casksSoldForEach
                                                              .pounds
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.casksSoldForEach
                                                                  .pounds,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.casksSoldForEach
                                                              .pounds
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.casksSoldForEach.shilling`}
                                                      label={`Casks Sold for Each: shilling`}
                                                      value={
                                                          ref?.casksSoldForEach
                                                              .shilling
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.casksSoldForEach
                                                                  .shilling,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.casksSoldForEach
                                                              .shilling
                                                      }
                                                  />
                                                  <TextField
                                                      fullWidth
                                                      margin="dense"
                                                      variant="standard"
                                                      name={`tobaccoEntry.money.${index}.casksSoldForEach.pence`}
                                                      label={`Casks Sold for Each: pence`}
                                                      value={
                                                          ref?.casksSoldForEach
                                                              .pence
                                                      }
                                                      type="number"
                                                      inputProps={{ min: 0 }}
                                                      onChange={
                                                          formikForm.handleChange
                                                      }
                                                      error={
                                                          isError &&
                                                          Boolean(
                                                              errorMessage
                                                                  ?.casksSoldForEach
                                                                  .pence,
                                                          )
                                                      }
                                                      helperText={
                                                          errorMessage
                                                              ?.casksSoldForEach
                                                              .pence
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
                                        moneyType: '',
                                        tobaccoAmount: 0,
                                        rateForTobacco: {
                                            pounds: 0,
                                            shilling: 0,
                                            pence: 0,
                                        },
                                        casksInTransaction: 0,
                                        tobaccoSold: {
                                            pounds: 0,
                                            shilling: 0,
                                            pence: 0,
                                        },
                                        casksSoldForEach: {
                                            pounds: 0,
                                            shilling: 0,
                                            pence: 0,
                                        },
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

export default EntryMoneyFrom;
