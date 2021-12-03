import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface ItemsMentionedProps {
    formikForm: any;
    prevIdx: number;
    disabled?: boolean;
}

const ItemsMentionedForm = ({
    formikForm,
    prevIdx,
    disabled,
}: ItemsMentionedProps) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name={`itemEntries[${prevIdx}].itemsMentioned`}
                render={(arrayHelpers: any) => {
                    const refs =
                        formikForm.values.itemEntries[prevIdx].itemsMentioned;

                    return (
                        <Stack spacing={2}>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => {
                                      return (
                                          formikForm.values.itemEntries[prevIdx]
                                              .itemsMentioned && (
                                              <Card key={index}>
                                                  <CardContent>
                                                      <Stack spacing={2}>
                                                          <Typography>
                                                              Mentioned Item{' '}
                                                              {index.toString()}
                                                          </Typography>
                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsMentioned[${index}].quantity`}
                                                              label={`Quantity`}
                                                              type="number"
                                                              inputProps={{
                                                                  min: 0,
                                                                  step: '0.01',
                                                              }}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsMentioned[${index}].quantity`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />

                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsMentioned[${index}].qualifier`}
                                                              label={`Qualifier`}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsMentioned[${index}].qualifier`}
                                                              disabled={
                                                                  disabled
                                                              }
                                                          />

                                                          <TextFieldWithFormikValidation
                                                              fullWidth
                                                              name={`itemEntries[${prevIdx}].itemsMentioned[${index}].item`}
                                                              label={`Item`}
                                                              formikForm={
                                                                  formikForm
                                                              }
                                                              fieldName={`itemEntries[${prevIdx}].itemsMentioned[${index}].item`}
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
                                                                      mentioned
                                                                      item{' '}
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
                                            item: '',
                                        })
                                    }
                                >
                                    Add Mentioned Item
                                </Button>
                            )}
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default ItemsMentionedForm;
