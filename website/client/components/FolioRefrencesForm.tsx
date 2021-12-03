import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, FormikProvider } from 'formik';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface FolioReferencesFormProps {
    formikForm: any;
    disabled?: boolean;
}

const FolioReferencesForm = ({
    formikForm,
    disabled,
}: FolioReferencesFormProps) => {
    return (
        <FormikProvider value={formikForm}>
            <FieldArray
                name="folioRefs"
                render={(arrayHelpers: any) => {
                    const refs: string[] = formikForm.values.folioRefs;

                    return (
                        <Stack spacing={2}>
                            <Typography component="h2">
                                Folio References
                            </Typography>
                            {refs && refs.length > 0
                                ? refs.map((_, index) => {
                                      return (
                                          formikForm.values.folioRefs && (
                                              <Stack
                                                  key={index}
                                                  direction="row"
                                                  spacing={2}
                                              >
                                                  <TextFieldWithFormikValidation
                                                      fullWidth
                                                      name={`folioRefs[${index}]`}
                                                      label={`Reference ${index}`}
                                                      formikForm={formikForm}
                                                      fieldName={`folioRefs[${index}]`}
                                                      disabled={disabled}
                                                  />
                                                  {disabled === true ? null : (
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
                                                              remove
                                                          </Button>
                                                      </div>
                                                  )}
                                              </Stack>
                                          )
                                      );
                                  })
                                : null}
                            {disabled === true ? null : (
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() => arrayHelpers.push('')}
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

export default FolioReferencesForm;
