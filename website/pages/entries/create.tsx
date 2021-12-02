import ColorBackground from '@components/ColorBackground';
import EntryPeopleForm from '@components/EntryPeopleForm';
import EntryPlacesForm from '@components/EntryPlacesForm';
import EntrySelectionTabForm from '@components/EntrySelectionTabForm';
import FindAccountHolder from '@components/FindAccountHolder';
import FolioReferencesForm from '@components/FolioRefrencesForm';
import Header from '@components/Header';
import LedgerReferencesForm from '@components/LedgerReferencesForm';
import LoadingPage from '@components/LoadingPage';
import TextAreaWithFormikValidation from '@components/TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createEntrySchema, entryInitialValues } from 'client/formikSchemas';
import { EntryFields } from 'client/graphqlDefs';
import { Entry } from 'client/types';
import { Roles } from 'config/constants.config';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PaperStyles } from 'styles/styles';
import { useMutation } from 'urql';

const createEntryDef = `
mutation createEntry($entry: CreateEntryInput!, $populate: Boolean!) {
  createEntry(createEntryInput: $entry) {
    ...entryFields
  }
}
${EntryFields}
`;

const CreateEntryPage: NextPage = () => {
    const router = useRouter();
    const { loading } = useAuth('/entries', [Roles.Admin]);
    const [_createEntryResult, createEntry] = useMutation(createEntryDef);
    const [isLoading, setIsLoading] = useState(false);

    const createForm = useFormik<Entry>({
        initialValues: entryInitialValues,
        validationSchema: createEntrySchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            const entry = JSON.parse(JSON.stringify(values));

            entry.people.map((person: any) => {
                if (!Boolean(person.id)) {
                    delete person.id;
                }
                return person;
            });

            entry.places.map((place: any) => {
                if (!Boolean(place.id)) {
                    delete place.id;
                }
                return place;
            });

            if (entry.regularEntry) {
                entry.regularEntry.tobaccoMarks.map((mark: any) => {
                    if (!Boolean(mark.markID)) {
                        delete mark.markID;
                    }
                    return mark;
                });
            }

            if (entry.tobaccoEntry) {
                entry.tobaccoEntry.marks.map((mark: any) => {
                    if (!Boolean(mark.markID)) {
                        delete mark.markID;
                    }
                    return mark;
                });
            }

            if (!Boolean(entry.dateInfo.fullDate)) {
                delete entry.dateInfo.fullDate;
            }

            const res = await createEntry({
                entry,
                populate: false,
            });

            if (res.error) {
                console.error(res.error);
            } else {
                router.push('/entries');
                resetForm();
            }
            setIsLoading(false);
        },
    });

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <ColorBackground>
            <Header />
            <Paper
                sx={{
                    backgroundColor: `var(--secondary-bg)`,
                    ...PaperStyles,
                }}
            >
                <form onSubmit={createForm.handleSubmit}>
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={12}>
                            <Button variant="contained" href="/entries/">Back entry list</Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography component="h2">
                                Account Holder Info
                            </Typography>
                            <Stack spacing={2}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.accountFirstName"
                                    label="First Name"
                                    formikForm={createForm}
                                    fieldName="accountHolder.accountFirstName"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.accountLastName"
                                    label="Last Name"
                                    formikForm={createForm}
                                    fieldName="accountHolder.accountLastName"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.prefix"
                                    label="Prefix"
                                    formikForm={createForm}
                                    fieldName="accountHolder.prefix"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.suffix"
                                    label="Suffix"
                                    formikForm={createForm}
                                    fieldName="accountHolder.suffix"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.profession"
                                    label="Profession"
                                    formikForm={createForm}
                                    fieldName="accountHolder.profession"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.location"
                                    label="Location"
                                    formikForm={createForm}
                                    fieldName="accountHolder.location"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.reference"
                                    label="Reference"
                                    formikForm={createForm}
                                    fieldName="accountHolder.reference"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="accountHolder.debitOrCredit"
                                    type="number"
                                    inputProps={{ max: 1, min: -1 }}
                                    label="Debit or Credit?"
                                    formikForm={createForm}
                                    fieldName="accountHolder.debitOrCredit"
                                />
                                <FindAccountHolder formikForm={createForm} />
                            </Stack>
                            <Divider />
                            <Typography component="h2">Date Info</Typography>
                            <Stack spacing={2}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="dateInfo.day"
                                    label="Day"
                                    type="number"
                                    inputProps={{ min: 1, max: 31 }}
                                    formikForm={createForm}
                                    fieldName="dateInfo.day"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="dateInfo.month"
                                    label="Month"
                                    type="number"
                                    inputProps={{ min: 1, max: 12 }}
                                    formikForm={createForm}
                                    fieldName="dateInfo.month"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="dateInfo.year"
                                    label="Year"
                                    type="number"
                                    formikForm={createForm}
                                    fieldName="dateInfo.year"
                                />
                                <TextFieldWithFormikValidation
                                    name="dateInfo.fullDate"
                                    type="date"
                                    InputProps={{
                                        startAdornment: <span></span>,
                                    }}
                                    formikForm={createForm}
                                    label="Full Date"
                                    fieldName="dateInfo.fullDate"
                                />
                                <Paper sx={PaperStyles}>
                                    <FolioReferencesForm
                                        formikForm={createForm}
                                    />
                                </Paper>
                                <Paper sx={PaperStyles}>
                                    <LedgerReferencesForm
                                        formikForm={createForm}
                                    />
                                </Paper>
                                <Paper sx={PaperStyles}>
                                    <EntryPeopleForm formikForm={createForm} />
                                </Paper>
                                <Paper sx={PaperStyles}>
                                    <EntryPlacesForm formikForm={createForm} />
                                </Paper>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography component="h2">Meta Info</Typography>
                            <Stack spacing={2}>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.ledger"
                                    label="Ledger"
                                    formikForm={createForm}
                                    fieldName="meta.ledger"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.reel"
                                    label="Reel"
                                    formikForm={createForm}
                                    fieldName="meta.reel"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.owner"
                                    label="Owner"
                                    formikForm={createForm}
                                    fieldName="meta.owner"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.store"
                                    label="Store"
                                    formikForm={createForm}
                                    fieldName="meta.store"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.year"
                                    label="Year"
                                    formikForm={createForm}
                                    fieldName="meta.year"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.folioPage"
                                    label="Folio Page"
                                    formikForm={createForm}
                                    fieldName="meta.folioPage"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="meta.entryID"
                                    label="Entry ID"
                                    formikForm={createForm}
                                    fieldName="meta.entryID"
                                />
                                <TextAreaWithFormikValidation
                                    name="meta.comments"
                                    label="Comments"
                                    fieldName="meta.comments"
                                    placeholder="Comments about the entry"
                                    formikForm={createForm}
                                />
                                <Divider />
                                <TextAreaWithFormikValidation
                                    name="entry"
                                    label="Original Entry Text"
                                    fieldName="entry"
                                    placeholder="Text of the original entry"
                                    formikForm={createForm}
                                />
                                <Divider />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.commodity"
                                    label="Money Commodity"
                                    formikForm={createForm}
                                    fieldName="money.commodity"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.colony"
                                    label="Type of money (what colony it is from)"
                                    formikForm={createForm}
                                    fieldName="money.colony"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.quantity"
                                    label="Quantity of Money"
                                    formikForm={createForm}
                                    fieldName="money.quantity"
                                />
                                <Divider />
                                <Typography component="h2">Currency</Typography>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.currency.pounds"
                                    label="Pounds"
                                    type="number"
                                    inputProps={{ min: 0, step: '0.01' }}
                                    formikForm={createForm}
                                    fieldName="money.currency.pounds"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.currency.shilling"
                                    label="Shilling"
                                    type="number"
                                    inputProps={{ min: 0, step: '0.01' }}
                                    formikForm={createForm}
                                    fieldName="money.currency.shilling"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.currency.pence"
                                    label="Pence"
                                    type="number"
                                    inputProps={{ min: 0, step: '0.01' }}
                                    formikForm={createForm}
                                    fieldName="money.currency.pence"
                                />
                                <Divider />
                                <Typography component="h2">Sterling</Typography>
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.sterling.pounds"
                                    label="Pounds"
                                    type="number"
                                    inputProps={{ min: 0, step: '0.01' }}
                                    formikForm={createForm}
                                    fieldName="money.sterling.pounds"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.sterling.shilling"
                                    label="Shilling"
                                    type="number"
                                    inputProps={{ min: 0, step: '0.01' }}
                                    formikForm={createForm}
                                    fieldName="money.sterling.shilling"
                                />
                                <TextFieldWithFormikValidation
                                    fullWidth
                                    name="money.sterling.pence"
                                    label="Pence"
                                    type="number"
                                    inputProps={{ min: 0, step: '0.01' }}
                                    formikForm={createForm}
                                    fieldName="money.sterling.pence"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <EntrySelectionTabForm formikForm={createForm} />
                        </Grid>
                        <Grid item xs={12}>
                            <Container maxWidth="sm">
                                <LoadingButton
                                    fullWidth
                                    loading={isLoading}
                                    variant="contained"
                                    type="submit"
                                >
                                    Submit
                                </LoadingButton>
                            </Container>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </ColorBackground>
    );
};

export default CreateEntryPage;
