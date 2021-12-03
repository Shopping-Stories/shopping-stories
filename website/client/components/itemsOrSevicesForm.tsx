import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import ItemsOrServicesVariantsForm from './ItemsOrServicesVariants';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface ItemsOrServicesProps {
    formikForm: any;
    prevIdx: number;
    disabled?: boolean;
}

const ItemsOrServicesForm = ({
    formikForm,
    prevIdx,
    disabled,
}: ItemsOrServicesProps) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name={`itemEntries[${prevIdx}].itemsOrServices`}
                render={(arrayHelpers: any) => {
                    const refs =
                        formikForm.values.itemEntries[prevIdx].itemsOrServices;

                    return (
                        <Stack spacing={2}>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => {
                                      return (
                                          formikForm.values.itemEntries[prevIdx]
                                              .itemsOrServices && (
                                              <Card key={index}>
                                                  <CardContent>
                                                      <Stack spacing={2}>
                                                          <Typography>
                                                              Item or Service{' '}
                                                              {index.toString()}
                                                          </Typography>
                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsOrServices[${index}].quantity`}
                                                              label={`Quantity`}
                                                              type="number"
                                                              inputProps={{
                                                                  min: 0,
                                                                  step: '0.01',
                                                              }}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].quantity`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />
                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsOrServices[${index}].qualifier`}
                                                              label={`Qualifier`}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].qualifier`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />

                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsOrServices[${index}].item`}
                                                              label={`Item`}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].item`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />

                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsOrServices[${index}].category`}
                                                              label={`Category`}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].category`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />

                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsOrServices[${index}].subcategory`}
                                                              label={`Subcategory`}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].subcategory`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />
                                                          <Grid
                                                              container
                                                              spacing={2}
                                                          >
                                                              <Grid
                                                                  item
                                                                  xs={12}
                                                                  sm={6}
                                                              >
                                                                  <Typography>
                                                                      Unit Cost
                                                                  </Typography>
                                                                  <TextFieldWithFormikValidation
                                                                      fullWidth
                                                                      type="number"
                                                                      inputProps={{
                                                                          min: 0,
                                                                          step: '0.01',
                                                                      }}
                                                                      name={`itemEntries[${prevIdx}].itemsOrServices[${index}].unitCost.pounds`}
                                                                      label={`Pounds`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].unitCost.pounds`}
                                                                      disabled={
                                                                          disabled
                                                                      }
                                                                  />
                                                                  <TextFieldWithFormikValidation
                                                                      fullWidth
                                                                      type="number"
                                                                      inputProps={{
                                                                          min: 0,
                                                                          step: '0.01',
                                                                      }}
                                                                      name={`itemEntries[${prevIdx}].itemsOrServices[${index}].unitCost.shilling`}
                                                                      label={`Shilling`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].unitCost.shilling`}
                                                                      disabled={
                                                                          disabled
                                                                      }
                                                                  />
                                                                  <TextFieldWithFormikValidation
                                                                      fullWidth
                                                                      type="number"
                                                                      inputProps={{
                                                                          min: 0,
                                                                          step: '0.01',
                                                                      }}
                                                                      name={`itemEntries[${prevIdx}].itemsOrServices[${index}].unitCost.pence`}
                                                                      label={`Pence`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].unitCost.pence`}
                                                                      disabled={
                                                                          disabled
                                                                      }
                                                                  />
                                                              </Grid>

                                                              <Grid
                                                                  item
                                                                  xs={12}
                                                                  sm={6}
                                                              >
                                                                  <Typography>
                                                                      Item Cost
                                                                  </Typography>
                                                                  <TextFieldWithFormikValidation
                                                                      fullWidth
                                                                      type="number"
                                                                      inputProps={{
                                                                          min: 0,
                                                                          step: '0.01',
                                                                      }}
                                                                      name={`itemEntries[${prevIdx}].itemsOrServices[${index}].itemCost.pounds`}
                                                                      label={`Pounds`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].itemCost.pounds`}
                                                                      disabled={
                                                                          disabled
                                                                      }
                                                                  />
                                                                  <TextFieldWithFormikValidation
                                                                      fullWidth
                                                                      type="number"
                                                                      inputProps={{
                                                                          min: 0,
                                                                          step: '0.01',
                                                                      }}
                                                                      name={`itemEntries[${prevIdx}].itemsOrServices[${index}].itemCost.shilling`}
                                                                      label={`Shilling`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].itemCost.shilling`}
                                                                      disabled={
                                                                          disabled
                                                                      }
                                                                  />
                                                                  <TextFieldWithFormikValidation
                                                                      fullWidth
                                                                      type="number"
                                                                      inputProps={{
                                                                          min: 0,
                                                                          step: '0.01',
                                                                      }}
                                                                      name={`itemEntries[${prevIdx}].itemsOrServices[${index}].itemCost.pence`}
                                                                      label={`Pence`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevIdx}].itemsOrServices[${index}].itemCost.pence`}
                                                                      disabled={
                                                                          disabled
                                                                      }
                                                                  />
                                                              </Grid>
                                                          </Grid>

                                                          <ItemsOrServicesVariantsForm
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              prevPrevIdx={
                                                                  prevIdx
                                                              }
                                                              prevIdx={index}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />
                                                          {disabled ===
                                                          true ? null : (
                                                              <div
                                                                  style={{
                                                                      display:
                                                                          'flex',
                                                                      alignItems:
                                                                          'center',
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
                                                                      item or
                                                                      service{' '}
                                                                      {index}
                                                                  </Button>
                                                              </div>
                                                          )}
                                                      </Stack>
                                                  </CardContent>
                                              </Card>
                                          )
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
                            )}
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default ItemsOrServicesForm;
