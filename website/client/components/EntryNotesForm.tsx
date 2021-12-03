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

interface EntryNotesFormProps {
    formikForm: any;
    disabled?: boolean;
}

const EntryNotesFrom = ({ formikForm, disabled }: EntryNotesFormProps) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="tobaccoEntry.notes"
                render={(arrayHelpers: any) => {
                    const refs = formikForm.values?.tobaccoEntry?.notes;

                    return (
                        <Stack spacing={2}>
                            {refs && refs.length > 0
                                ? refs.map((_: any, index: number) => {
                                      return (
                                          <Card key={index}>
                                              <CardContent>
                                                  <Typography>
                                                      Entry Note {index}
                                                  </Typography>

                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.notes[${index}].noteNum`}
                                                      label={`Note number`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.notes[${index}].noteNum`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.notes[${index}].totalWeight`}
                                                      label={`Total Weight`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.notes[${index}].totalWeight`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.notes[${index}].barrelWeight`}
                                                      label={`Barrel Weight`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.notes[${index}].barrelWeight`}
                                                      disabled={disabled}
                                                  />
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`tobaccoEntry.notes[${index}].tobaccoWeight`}
                                                      label={`Tobacco Weight`}
                                                      type="number"
                                                      inputProps={{
                                                          min: 0,
                                                      }}
                                                      formikForm={formikForm}
                                                      fieldName={`tobaccoEntry.notes[${index}].tobaccoWeight`}
                                                      disabled={disabled}
                                                  />
                                              </CardContent>
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
                                            noteNum: -1,
                                            totalWeight: 0,
                                            barrelWeight: 0,
                                            tobaccoWeight: 0,
                                        })
                                    }
                                >
                                    Add Note
                                </Button>
                            )}
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default EntryNotesFrom;
