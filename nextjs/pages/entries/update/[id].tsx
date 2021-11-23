import ColorBackground from '@components/ColorBackground';
import EntryPeopleForm from '@components/EntryPeopleForm';
import EntryPlacesForm from '@components/EntryPlacesForm';
import EntrySelectionTabForm from '@components/EntrySelectionTabForm';
import FindAccountHolder from '@components/FindAccountHolder';
import FolioReferencesForm from '@components/FolioRefrencesForm';
import Header from '@components/Header';
import LedgerReferencesForm from '@components/LedgerReferencesForm';
import TextAreaWithFormikValidation from '@components/TextAreaWithFormikValidation';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createEntrySchema, entryInitialValues } from 'client/formikSchemas';
import { EntryFields } from 'client/graphqlDefs';
import { Entry } from 'client/types';
import { cloneWithoutTypename } from 'client/util';
import { useFormik } from 'formik';
import { merge } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PaperStyles } from 'styles/styles';
import { useMutation, useQuery } from 'urql';

const findEntryDef = `
query entryQuery($id: String!) {
  entry: findEntry(id: $id) {
  	...entryFields
  }
}
${EntryFields}
`;

const updateEntryDef = `
mutation updateEntry($id: String!, $updates: UpdateEntryInput!) {
  updateEntry(id: $id, updatedFields: $updates) {
    ...entryFields
}
}
${EntryFields}
`;

const UpdateEntryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;

    interface FetchEntry {
        entry: Entry & { id: string };
    }

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [viewEntries, setViewEntries] = useState(false);
    const [initialValues, setInitialValues] =
        useState<Entry>(entryInitialValues);

    const [findEntryResult, _findEntry] = useQuery<FetchEntry>({
        query: findEntryDef,
        variables: { id },
    });
    const entry = findEntryResult?.data?.entry;

    const [_updateEntryResult, updateEntry] = useMutation(updateEntryDef);

    useEffect(() => {
        if (entry !== undefined && Boolean(entry)) {
            const { id: _, ...fields } = entry;
            const cleanedFields = cloneWithoutTypename(fields);
            const values = merge(entryInitialValues, cleanedFields);
            values.dateInfo.fullDate = values.dateInfo.fullDate
                ? values.dateInfo.fullDate
                : new Date(1760, 0, 1);
            setInitialValues(values);
            if (values.itemEntries) {
                setTabIndex(0);
            }
            if (values.tobaccoEntry) {
                setTabIndex(1);
            }
            if (values.regularEntry) {
                setTabIndex(2);
            }
        }
    }, [entry]);

    const updateForm = useFormik<Entry>({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: createEntrySchema,
        onSubmit: async (values, { resetForm }) => {
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

            const res = await updateEntry({
                id,
                updates: entry,
            });

            if (res.error) {
            } else {
                resetForm();
            }
        },
    });
    console.log(updateForm.values);

    if (findEntryResult.fetching) {
        return <div>Fetching {router.query.id}</div>;
    } else if (findEntryResult.error) {
        console.log(findEntryResult.error);
        return <>error</>;
    } else {
        return (
            <ColorBackground>
                <Header />
                <Paper
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        ...PaperStyles,
                    }}
                >
                    <form onSubmit={updateForm.handleSubmit}>
                        <Grid container justifyContent="center" spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography component="h2">
                                    Account Holder Info
                                </Typography>
                                <Stack spacing={2}>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.accountFirstName"
                                        label="First Name"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.accountFirstName"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.accountLastName"
                                        label="Last Name"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.accountLastName"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.prefix"
                                        label="Prefix"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.prefix"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.suffix"
                                        label="Suffix"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.suffix"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.profession"
                                        label="Profession"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.profession"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.location"
                                        label="Location"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.location"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.reference"
                                        label="Reference"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.reference"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="accountHolder.debitOrCredit"
                                        type="number"
                                        inputProps={{ max: 1, min: -1 }}
                                        label="Debit or Credit?"
                                        formikForm={updateForm}
                                        fieldName="accountHolder.debitOrCredit"
                                    />
                                    <FindAccountHolder
                                        formikForm={updateForm}
                                    />
                                </Stack>
                                <Divider />
                                <Typography component="h2">
                                    Date Info
                                </Typography>
                                <Stack spacing={2}>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="dateInfo.day"
                                        label="Day"
                                        type="number"
                                        inputProps={{ min: 1, max: 31 }}
                                        formikForm={updateForm}
                                        fieldName="dateInfo.day"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="dateInfo.month"
                                        label="Month"
                                        type="number"
                                        inputProps={{ min: 1, max: 12 }}
                                        formikForm={updateForm}
                                        fieldName="dateInfo.month"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="dateInfo.year"
                                        label="Year"
                                        type="number"
                                        formikForm={updateForm}
                                        fieldName="dateInfo.year"
                                    />
                                    <InputLabel htmlFor="date-input">
                                        Full Date
                                    </InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        margin="dense"
                                        name="dateInfo.fullDate"
                                        type="date"
                                        value={
                                            updateForm.values.dateInfo.fullDate
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.dateInfo
                                                ?.fullDate &&
                                            Boolean(
                                                updateForm.errors.dateInfo
                                                    ?.fullDate,
                                            )
                                        }
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">
                                        {updateForm.touched.dateInfo
                                            ?.fullDate &&
                                            updateForm.errors.dateInfo
                                                ?.fullDate}
                                    </FormHelperText>
                                    <Paper sx={PaperStyles}>
                                        <FolioReferencesForm
                                            formikForm={updateForm}
                                        />
                                    </Paper>
                                    <Paper sx={PaperStyles}>
                                        <LedgerReferencesForm
                                            formikForm={updateForm}
                                        />
                                    </Paper>
                                    <Paper sx={PaperStyles}>
                                        <EntryPeopleForm
                                            formikForm={updateForm}
                                        />
                                    </Paper>
                                    <Paper sx={PaperStyles}>
                                        <EntryPlacesForm
                                            formikForm={updateForm}
                                        />
                                    </Paper>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography component="h2">
                                    Meta Info
                                </Typography>
                                <Stack spacing={2}>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.ledger"
                                        label="Ledger"
                                        formikForm={updateForm}
                                        fieldName="meta.ledger"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.reel"
                                        label="Reel"
                                        formikForm={updateForm}
                                        fieldName="meta.reel"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.owner"
                                        label="Owner"
                                        formikForm={updateForm}
                                        fieldName="meta.owner"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.store"
                                        label="Store"
                                        formikForm={updateForm}
                                        fieldName="meta.store"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.year"
                                        label="Year"
                                        formikForm={updateForm}
                                        fieldName="meta.year"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.folioPage"
                                        label="Folio Page"
                                        formikForm={updateForm}
                                        fieldName="meta.folioPage"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="meta.entryID"
                                        label="Entry ID"
                                        formikForm={updateForm}
                                        fieldName="meta.entryID"
                                    />
                                    <TextAreaWithFormikValidation
                                        name="meta.comments"
                                        label="Comments"
                                        fieldName="meta.comments"
                                        placeholder="Comments about the entry"
                                        formikForm={updateForm}
                                    />
                                    <Divider />
                                    <TextAreaWithFormikValidation
                                        name="entry"
                                        label="Original Entry Text"
                                        fieldName="entry"
                                        placeholder="Text of the original entry"
                                        formikForm={updateForm}
                                    />
                                    <Divider />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.commodity"
                                        label="Money Commodity"
                                        formikForm={updateForm}
                                        fieldName="money.commodity"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.colony"
                                        label="Type of money (what colony it is from)"
                                        formikForm={updateForm}
                                        fieldName="money.colony"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.quantity"
                                        label="Quantity of Money"
                                        formikForm={updateForm}
                                        fieldName="money.quantity"
                                    />
                                    <Divider />
                                    <Typography component="h2">
                                        Currency
                                    </Typography>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.currency.pounds"
                                        label="Pounds"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        formikForm={updateForm}
                                        fieldName="money.currency.pounds"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.currency.shilling"
                                        label="Shilling"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        formikForm={updateForm}
                                        fieldName="money.currency.shilling"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.currency.pence"
                                        label="Pence"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        formikForm={updateForm}
                                        fieldName="money.currency.pence"
                                    />
                                    <Divider />
                                    <Typography component="h2">
                                        Sterling
                                    </Typography>
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.sterling.pounds"
                                        label="Pounds"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        formikForm={updateForm}
                                        fieldName="money.sterling.pounds"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.sterling.shilling"
                                        label="Shilling"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        formikForm={updateForm}
                                        fieldName="money.sterling.shilling"
                                    />
                                    <TextFieldWithFormikValidation
                                        fullWidth
                                        name="money.sterling.pence"
                                        label="Pence"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        formikForm={updateForm}
                                        fieldName="money.sterling.pence"
                                    />
                                </Stack>
                            </Grid>
                            {!viewEntries && (
                                <Button onClick={() => setViewEntries(true)}>
                                    View Subentries
                                </Button>
                            )}
                            {viewEntries && (
                                <Grid item xs={12}>
                                    <EntrySelectionTabForm
                                        formikForm={updateForm}
                                        initialIndex={tabIndex}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <Button variant="contained" type="submit">
                            Submit
                        </Button>
                    </form>
                </Paper>
            </ColorBackground>
        );
    }
};

export default UpdateEntryPage;
