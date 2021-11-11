import TextField from '@mui/material/TextField';
import EntryMoneyForm from './EntryMoneyForm';
import EntryNotesFrom from './EntryNotesForm';
import MarkForm from './MarksForm';

const CreateTobaccoEntryFrom = ({ formikForm }: any) => {
    const ref = formikForm.values.tobaccoEntry;
    const touched = formikForm.touched;
    const errors = formikForm.errors;
    const atLeastOneError =
        touched && errors && touched?.tobaccoEntry && errors?.tobaccoEntry;
    let isError = false;
    let errorMessage: any;
    if (atLeastOneError) {
        isError = typeof errors !== 'undefined';
        errorMessage = touched && errors;
    }
    return (
        <div>
            {ref
                ? formikForm.values.tobaccoEntry && (
                      <div>
                          <TextField
                              fullWidth
                              margin="dense"
                              variant="standard"
                              name={`tobaccoEntry.entry`}
                              label={`Entry`}
                              value={ref?.entry}
                              onChange={formikForm.handleChange}
                              error={isError && Boolean(errorMessage?.entry)}
                              helperText={errorMessage?.entry}
                          />
                          <TextField
                              fullWidth
                              margin="dense"
                              variant="standard"
                              name={`tobaccoEntry.tobaccoShaved`}
                              label={`Tobacco Shaved`}
                              value={ref?.tobaccoShaved}
                              type="number"
                              inputProps={{ min: 0 }}
                              onChange={formikForm.handleChange}
                              error={
                                  isError &&
                                  Boolean(errorMessage?.tobaccoShaved)
                              }
                              helperText={errorMessage?.tobaccoShaved}
                          />
                          <MarkForm formikForm={formikForm} />
                          <EntryNotesFrom formikForm={formikForm} />
                          <EntryMoneyForm formikForm={formikForm} />
                      </div>
                  )
                : null}
        </div>
    );
};

export default CreateTobaccoEntryFrom;
