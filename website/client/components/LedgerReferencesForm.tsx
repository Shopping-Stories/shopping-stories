import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

const LedgerReferencesForm = ({ formikForm }: any) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="ledgerRefs"
                render={(arrayHelpers: any) => {
                    const refs: string[] = formikForm.values.ledgerRefs;

                    return (
                        <Stack spacing={2}>
                            <Typography component="h2">
                                Ledger References
                            </Typography>
                            {refs && refs.length > 0
                                ? refs.map((_, index) => {
                                      return (
                                          formikForm.values.ledgerRefs && (
                                              <Stack
                                                  key={index}
                                                  direction="row"
                                                  spacing={2}
                                              >
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`ledgerRefs[${index}]`}
                                                      label={`Ledger ${index}`}
                                                      formikForm={formikForm}
                                                      fieldName={`ledgerRefs[${index}]`}
                                                  />
                                                  <div
                                                      style={{
                                                          display: 'flex',
                                                          alignItems: 'center',
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
                                                          remove
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
                                onClick={() => arrayHelpers.push('')}
                            >
                                Add
                            </Button>
                        </Stack>
                    );
                }}
            />
        </FormikProvider>
    );
};

export default LedgerReferencesForm;
