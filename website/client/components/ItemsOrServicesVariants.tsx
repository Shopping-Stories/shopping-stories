import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

const ItemsOrServicesVariantsForm = ({
    formikForm,
    prevPrevIdx,
    prevIdx,
}: any) => {
    return (
        formikForm.values.itemEntries[prevPrevIdx].itemsOrServices[prevIdx]
            .variants && (
            <FormikProvider value={formikForm}>
                <FieldArray
                    name={`itemEntries[${prevPrevIdx}].itemsOrServices[${prevIdx}].variants`}
                    render={(arrayHelpers: any) => {
                        const refs =
                            formikForm.values.itemEntries[prevPrevIdx]
                                .itemsOrServices[prevIdx].variants;

                        return (
                            <Grid container spacing={2}>
                                {refs && refs.length > 0
                                    ? refs.map((_: any, index: number) => {
                                          return (
                                              formikForm.values.itemEntries[
                                                  prevPrevIdx
                                              ].itemsOrServices[prevIdx]
                                                  .variants && (
                                                  <Grid
                                                      item
                                                      xs={12}
                                                      sm={6}
                                                      key={index}
                                                  >
                                                      <Card
                                                          sx={{
                                                              backgroundColor:
                                                                  'var(--secondary-bg)',
                                                          }}
                                                      >
                                                          <CardContent>
                                                              <Stack
                                                                  spacing={2}
                                                              >
                                                                  <Typography>
                                                                      Variant{' '}
                                                                      {index.toString()}
                                                                  </Typography>
                                                                  <TextFieldWithFormikValidation
                                                                      name={`itemEntries[${prevPrevIdx}].itemsOrServices[${prevIdx}].variants[${index}]`}
                                                                      label={`Variant ${index}`}
                                                                      formikForm={
                                                                          formikForm
                                                                      }
                                                                      fieldName={`itemEntries[${prevPrevIdx}].itemsOrServices[${prevIdx}].variants[${index}]`}
                                                                  />
                                                                  <Button
                                                                      variant="contained"
                                                                      startIcon={
                                                                          <DeleteIcon />
                                                                      }
                                                                      type="button"
                                                                      onClick={() =>
                                                                          arrayHelpers.remove(
                                                                              index,
                                                                          )
                                                                      }
                                                                  >
                                                                      remove
                                                                      variant{' '}
                                                                      {index}
                                                                  </Button>
                                                              </Stack>
                                                          </CardContent>
                                                      </Card>
                                                  </Grid>
                                              )
                                          );
                                      })
                                    : null}

                                <Grid item xs={12}>
                                    <Button
                                        startIcon={<AddCircleIcon />}
                                        variant="contained"
                                        type="button"
                                        onClick={() => arrayHelpers.push('')}
                                    >
                                        Add Variant
                                    </Button>
                                </Grid>
                            </Grid>
                        );
                    }}
                />
            </FormikProvider>
        )
    );
};

export default ItemsOrServicesVariantsForm;
