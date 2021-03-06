import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface EntryMoneyFormProps {
    formikForm: any;
    disabled?: boolean;
}

const EntryMoneyFrom = ({ formikForm, disabled }: EntryMoneyFormProps) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="tobaccoEntry.money"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values?.tobaccoEntry?.money;

                    return (
                        <Stack spacing={2}>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => {
                                      return (
                                          <Card key={index}>
                                              <CardContent>
                                                  <Typography variant="subtitle1">
                                                      Money Note {index}
                                                  </Typography>
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].moneyType`}
                                                      label={`Type of money`}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].moneyType`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].tobaccoAmount`}
                                                      label={`Amount of tobacco`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].tobaccoAmount`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].casksInTransaction`}
                                                      label={`Casks in the transaction`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].casksInTransaction`}
                                                      disabled={disabled}
                                                  />

                                                  <Typography variant="subtitle2">
                                                      Rate for tobacco
                                                  </Typography>
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].rateForTobacco.pounds`}
                                                      label={`Pounds`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].rateForTobacco.pounds`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].rateForTobacco.shilling`}
                                                      label={`Shilling`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].rateForTobacco.shilling`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].rateForTobacco.pence`}
                                                      label={`Pence`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].rateForTobacco.pence`}
                                                      disabled={disabled}
                                                  />

                                                  <Typography variant="subtitle2">
                                                      Tobacco sold (money)
                                                  </Typography>
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].tobaccoSold.pounds`}
                                                      label={`Pounds`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].tobaccoSold.pounds`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].tobaccoSold.shilling`}
                                                      label={`Shilling`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].tobaccoSold.shilling`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].tobaccoSold.pence`}
                                                      label={`Pence`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].tobaccoSold.pence`}
                                                      disabled={disabled}
                                                  />

                                                  <Typography variant="subtitle2">
                                                      Casks sold for each
                                                  </Typography>
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].casksSoldForEach.pounds`}
                                                      label={`Pounds`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].casksSoldForEach.pounds`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].casksSoldForEach.shilling`}
                                                      label={`Shilling`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].casksSoldForEach.shilling`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.money[${index}].casksSoldForEach.pence`}
                                                      label={`Pence`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                          step: '0.01',
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.money[${index}].casksSoldForEach.pence`}
                                                      disabled={disabled}
                                                  />
                                                  {disabled === true ? null : (
                                                      <CardActions>
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
                                                      </CardActions>
                                                  )}
                                              </CardContent>
                                          </Card>
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

export default EntryMoneyFrom;
