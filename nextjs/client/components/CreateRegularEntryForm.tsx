import TextField from '@mui/material/TextField';
import RegularItemsMentionedForm from './RegularItemsMentionedForm';
import RegularMarkForm from './RegularMarkForm';

const CreateRegularEntryFrom = ({ formikForm }: any) => {
    const ref = formikForm.values.regularEntry;
    const touched = formikForm.touched;
    const errors = formikForm.errors;
    const atLeastOneError =
        touched && errors && touched?.regularEntry && errors?.regularEntry;
    let isError = false;
    let errorMessage: any;
    if (atLeastOneError) {
        isError = typeof errors !== 'undefined';
        errorMessage = touched && errors;
    }
    return (
        <div>
            {ref
                ? formikForm.values.regularEntry && (
                      <div>
                          <TextField
                              fullWidth
                              margin="dense"
                              variant="standard"
                              name={`regularEntry.entry`}
                              label={`Entry`}
                              value={ref?.entry}
                              onChange={formikForm.handleChange}
                              error={isError && Boolean(errorMessage?.entry)}
                              helperText={errorMessage?.entry}
                          />
                          <RegularMarkForm formikForm={formikForm} />
                          <RegularItemsMentionedForm formikForm={formikForm} />
                      </div>
                  )
                : null}
        </div>
    );
};

export default CreateRegularEntryFrom;
