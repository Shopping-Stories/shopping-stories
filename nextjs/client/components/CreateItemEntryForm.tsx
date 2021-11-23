import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import ItemsMentionedForm from './ItemsMentionedForm';
import ItemsOrServicesForm from './itemsOrSevicesForm';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

const CreateItemEntryFrom = ({ formikForm }: any) => {
    return (
        <div>
            <FormikProvider value={formikForm}>
                <FieldArray
                    name="itemEntries"
                    render={(arrayHelpers: any) => {
                        const refs = formikForm.values.itemEntries;

                        return (
                            <Stack spacing={2}>
                                <Typography component="h2">
                                    Item Entries
                                </Typography>
                                {refs && refs.length > 0
                                    ? refs.map((_: any, index: number) => {
                                          return (
                                              formikForm.values.itemEntries && (
                                                  <Stack
                                                      spacing={2}
                                                      key={index}
                                                  >
                                                      <Typography component="h2">
                                                          Item Entry {index}
                                                      </Typography>
                                                      <TextFieldWithFormikValidation
                                                          fullWidth
                                                          name={`itemEntries.${index}.perOrder`}
                                                          label={`Amount Per Order`}
                                                          type="number"
                                                          inputProps={{
                                                              min: 0,
                                                          }}
                                                          formikForm={
                                                              formikForm
                                                          }
                                                          fieldName={`itemEntries.${index}.perOrder`}
                                                      />
                                                      <TextFieldWithFormikValidation
                                                          fullWidth
                                                          name={`itemEntries.${index}.percentage`}
                                                          label={`Percentage`}
                                                          type="number"
                                                          inputProps={{
                                                              min: 0,
                                                          }}
                                                          formikForm={
                                                              formikForm
                                                          }
                                                          fieldName={`itemEntries.${index}.percentage`}
                                                      />
                                                      <Card
                                                          sx={{
                                                              backgroundColor:
                                                                  'var(--secondary-bg)',
                                                          }}
                                                      >
                                                          <CardHeader title="Items or Services" />
                                                          <CardContent>
                                                              <ItemsOrServicesForm
                                                                  formikForm={
                                                                      formikForm
                                                                  }
                                                                  prevIdx={
                                                                      index
                                                                  }
                                                              />
                                                          </CardContent>
                                                      </Card>
                                                      <Card
                                                          sx={{
                                                              backgroundColor:
                                                                  'var(--secondary-bg)',
                                                          }}
                                                      >
                                                          <CardHeader title="Mentioned Items" />
                                                          <CardContent>
                                                              <ItemsMentionedForm
                                                                  formikForm={
                                                                      formikForm
                                                                  }
                                                                  prevIdx={
                                                                      index
                                                                  }
                                                              />
                                                          </CardContent>
                                                      </Card>
                                                      <div
                                                          style={{
                                                              display: 'flex',
                                                              alignItems:
                                                                  'center',
                                                          }}
                                                      >
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
                                                              remove entry{' '}
                                                              {index}
                                                          </Button>
                                                      </div>
                                                  </Stack>
                                              )
                                          );
                                      })
                                    : null}
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() =>
                                        arrayHelpers.push({
                                            perOrder: 0,
                                            percentage: 0,
                                            itemsOrServices: [],
                                            itemsMentioned: [],
                                        })
                                    }
                                >
                                    Add
                                </Button>
                            </Stack>
                        );
                    }}
                />
            </FormikProvider>
        </div>
    );
};

export default CreateItemEntryFrom;
