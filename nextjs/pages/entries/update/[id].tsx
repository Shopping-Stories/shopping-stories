import EntryPeopleForm from '@components/EntryPeopleForm';
import EntryPlacesForm from '@components/EntryPlacesForm';
import EntrySelectionTabForm from '@components/EntrySelectionTabForm';
import FindAccountHolder from '@components/FindAccountHolder';
import FolioReferencesForm from '@components/FolioRefrencesForm';
import Header from '@components/Header';
import LedgerReferencesForm from '@components/LedgerReferencesForm';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { EntryFields } from 'client/graphqlDefs';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'urql';
import * as yup from 'yup';

const findEntryDef = `
query entryQuery($id: String!) {
  findEntry(id: $id) {
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

const poundShillingPence = yup.object({
    pounds: yup.number().default(0),
    shilling: yup.number().default(0),
    pence: yup.number().default(0),
});

const updateEntrySchema = yup.object({
    accountHolder: yup.object({
        accountFirstName: yup.string().default(''),
        accountLastName: yup.string().default(''),
        prefix: yup.string().default(''),
        suffix: yup.string().default(''),
        profession: yup.string().default(''),
        location: yup.string().default(''),
        reference: yup.string().default(''),
        debitOrCredit: yup.number().default(2),
        accountHolderID: yup
            .string()
            .default('')
            .matches(/^[a-fA-F0-9]{24}$/, 'You much pick a person'),
    }),
    meta: yup.object({
        ledger: yup.string().default(''),
        reel: yup.string().default(''),
        owner: yup.string().default(''),
        store: yup.string().default(''),
        year: yup.string().default(''),
        folioPage: yup.string().default(''),
        entryID: yup.string().default(''),
        comments: yup.string().default(''),
    }),
    dateInfo: yup.object({
        day: yup.number().default(-1),
        month: yup.number().default(-1),
        year: yup.number().default(-1),
        fullDate: yup.date().nullable(),
    }),
    folioRefs: yup.array().of(yup.string().default('')).default([]),
    ledgerRefs: yup.array().of(yup.string().default('')).default([]),
    itemEntries: yup
        .array()
        .of(
            yup.object({
                perOrder: yup.number().default(-1),
                percentage: yup.number().default(-1),
                itemsOrServices: yup.array().of(
                    yup.object({
                        quantity: yup.number().default(0),
                        qualifier: yup.string().default(''),
                        variants: yup.array().of(yup.string().default('')),
                        item: yup.string().default(''),
                        category: yup.string().default(''),
                        subcategory: yup.string().default(''),
                        unitCost: poundShillingPence,
                        itemCost: poundShillingPence,
                    }),
                ),
                itemsMentioned: yup.array().of(
                    yup.object({
                        quantity: yup.number().default(0),
                        qualifier: yup.string().default(''),
                        item: yup.string().default(''),
                    }),
                ),
            }),
        )
        .default(null)
        .nullable(),
    tobaccoEntry: yup
        .object({
            entry: yup.string().default(''),
            marks: yup.array().of(
                yup.object({
                    markID: yup.string().default(null).nullable(),
                    markName: yup.string().default(''),
                }),
            ),
            notes: yup.array().of(
                yup.object({
                    noteNum: yup.number().default(-1),
                    totalWeight: yup.number().default(0),
                    barrelWeight: yup.number().default(0),
                    tobaccoWeight: yup.number().default(0),
                }),
            ),
            money: yup.array().of(
                yup.object({
                    moneyType: yup.string().default(''),
                    tobaccoAmount: yup.number().default(0),
                    rateForTobacco: poundShillingPence,
                    casksInTransaction: yup.number().default(0),
                    tobaccoSold: poundShillingPence,
                    casksSoldForEach: poundShillingPence,
                }),
            ),
            tobaccoShaved: yup.number().default(0),
        })
        .default(null)
        .nullable(),
    regularEntry: yup
        .object({
            entry: yup.string().default(''),
            tobaccoMarks: yup.array().of(
                yup.object({
                    markID: yup.string().default(null).nullable(),
                    markName: yup.string().default(''),
                }),
            ),
            itemsMentioned: yup.array().of(
                yup.object({
                    quantity: yup.number().default(0),
                    qualifier: yup.string().default(''),
                    item: yup.string().default(''),
                }),
            ),
        })
        .default(null)
        .nullable(),
    people: yup.array().of(
        yup.object({
            name: yup.string().default(''),
            id: yup.string().default('').nullable(),
        }),
    ),
    places: yup.array().of(
        yup.object({
            name: yup.string().default(''),
            id: yup.string().default('').nullable(),
        }),
    ),
    entry: yup.string().default(''),
    money: yup.object({
        commodity: yup.string().default(''),
        colony: yup.string().default(''),
        quantity: yup.string().default(''),
        currency: poundShillingPence,
        sterling: poundShillingPence,
    }),
});

const UpdateEntryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const [findEntryResult, _findEntry] = useQuery({
        query: findEntryDef,
        variables: { id },
    });
    const entry = findEntryResult?.data?.findEntry;
    const [_updateEntryResult, updateEntry] = useMutation(updateEntryDef);


    const updateForm = useFormik({
        initialValues: {
            accountHolder: {
                accountFirstName: '',
                accountLastName: '',
                prefix: '',
                suffix: '',
                profession: '',
                location: '',
                reference: '',
                debitOrCredit: -1,
                accountHolderID: '',
            },
            meta: {
                ledger: '',
                reel: '',
                owner: '',
                store: '',
                year: '',
                folioPage: '',
                entryID: '',
                comments: '',
            },
            dateInfo: {
                day: -1,
                month: -1,
                year: -1,
                fullDate: '',
            },
            folioRefs: [],
            ledgerRefs: [],
            itemEntries: null,
            tobaccoEntry: null,
            regularEntry: null,
            people: [],
            places: [],
            entry: '',
            money: {
                commodity: '',
                colony: '',
                quantity: '',
                currency: {
                    pounds: 0,
                    shilling: 0,
                    pence: 0,
                },
                sterling: {
                    pounds: 0,
                    shilling: 0,
                    pence: 0,
                },
            },
        },
        validationSchema: updateEntrySchema,
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

            if (entry.dateInfo && !Boolean(entry?.dateInfo?.fullDate)) {
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

    useMemo(() => {
        if (Boolean(entry)) {
            const { id: _, ...fields } = entry;
            const omitTypename = (key: string, value: any) => (key === '__typename' ? undefined : value);
            const cleanFields = JSON.parse(JSON.stringify(fields), omitTypename);
            console.log(cleanFields);
            updateForm.setValues(cleanFields);
        }
    }, [entry]);

    if (findEntryResult.fetching) {
        return <div>Fetching {router.query.id}</div>;
    } else if (findEntryResult.error) {
        console.log(findEntryResult.error);
        return <>error</>;
    } else {

        return (
            <div>
                {/* {entry.id} yay */}
                <Header />
                <Paper
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >
                    <form onSubmit={updateForm.handleSubmit}>
                        <Grid container justifyContent="center" spacing={4}>
                            <Grid item xs={4}>
                                <Typography component="h2">
                                    Account Holder Info
                                </Typography>
                                <FormGroup>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.accountFirstName"
                                        label="First Name"
                                        value={
                                            updateForm.values.accountHolder
                                                .accountFirstName
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.accountFirstName &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.accountFirstName,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.accountFirstName &&
                                            updateForm.errors.accountHolder
                                                ?.accountFirstName
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.accountLastName"
                                        label="Last Name"
                                        value={
                                            updateForm.values.accountHolder
                                                .accountLastName
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.accountLastName &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.accountLastName,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.accountLastName &&
                                            updateForm.errors.accountHolder
                                                ?.accountLastName
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.prefix"
                                        label="Prefix"
                                        value={
                                            updateForm.values.accountHolder
                                                .prefix
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.prefix &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.prefix,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.prefix &&
                                            updateForm.errors.accountHolder
                                                ?.prefix
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.suffix"
                                        label="Suffix"
                                        value={
                                            updateForm.values.accountHolder
                                                .suffix
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.suffix &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.suffix,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.suffix &&
                                            updateForm.errors.accountHolder
                                                ?.suffix
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.profession"
                                        label="Profession"
                                        value={
                                            updateForm.values.accountHolder
                                                .profession
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.profession &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.profession,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.profession &&
                                            updateForm.errors.accountHolder
                                                ?.profession
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.location"
                                        label="Location"
                                        value={
                                            updateForm.values.accountHolder
                                                .location
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.location &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.location,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.location &&
                                            updateForm.errors.accountHolder
                                                ?.location
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.reference"
                                        label="Reference"
                                        value={
                                            updateForm.values.accountHolder
                                                .reference
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.reference &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.reference,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.reference &&
                                            updateForm.errors.accountHolder
                                                ?.reference
                                        }
                                    />

                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="accountHolder.debitOrCredit"
                                        type="number"
                                        inputProps={{ max: 1, min: -1 }}
                                        label="Debit or Credit?"
                                        value={
                                            updateForm.values.accountHolder
                                                .debitOrCredit
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.accountHolder
                                                ?.debitOrCredit &&
                                            Boolean(
                                                updateForm.errors.accountHolder
                                                    ?.debitOrCredit,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.accountHolder
                                                ?.debitOrCredit &&
                                            updateForm.errors.accountHolder
                                                ?.debitOrCredit
                                        }
                                    />
                                    <FindAccountHolder
                                        formikForm={updateForm}
                                    />
                                </FormGroup>
                                <Divider />
                                <Typography component="h2">
                                    Date Info
                                </Typography>
                                <FormGroup>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="dateInfo.day"
                                        label="Day"
                                        type="number"
                                        inputProps={{ min: -1, max: 31 }}
                                        value={updateForm.values.dateInfo.day}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.dateInfo?.day &&
                                            Boolean(
                                                updateForm.errors.dateInfo?.day,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.dateInfo?.day &&
                                            updateForm.errors.dateInfo?.day
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="dateInfo.month"
                                        label="Month"
                                        type="number"
                                        inputProps={{ min: -1, max: 12 }}
                                        value={updateForm.values.dateInfo.month}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.dateInfo
                                                ?.month &&
                                            Boolean(
                                                updateForm.errors.dateInfo
                                                    ?.month,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.dateInfo
                                                ?.month &&
                                            updateForm.errors.dateInfo?.month
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="dateInfo.year"
                                        label="Year"
                                        value={updateForm.values.dateInfo.year}
                                        type="number"
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.dateInfo?.year &&
                                            Boolean(
                                                updateForm.errors.dateInfo
                                                    ?.year,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.dateInfo?.year &&
                                            updateForm.errors.dateInfo?.year
                                        }
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
                                    <FolioReferencesForm
                                        formikForm={updateForm}
                                    />
                                    <LedgerReferencesForm
                                        formikForm={updateForm}
                                    />
                                    <EntryPeopleForm formikForm={updateForm} />
                                    <EntryPlacesForm formikForm={updateForm} />
                                    {/* <Button
                                    onClick={() =>
                                        createForm.setFieldValue(
                                            'people.0.name',
                                            'hello',
                                        )
                                    }
                                >
                                    click
                                </Button> */}
                                </FormGroup>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography component="h2">
                                    Meta Info
                                </Typography>
                                <FormGroup>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.ledger"
                                        label="Ledger"
                                        value={updateForm.values.meta.ledger}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.ledger &&
                                            Boolean(
                                                updateForm.errors.meta?.ledger,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.ledger &&
                                            updateForm.errors.meta?.ledger
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.reel"
                                        label="Reel"
                                        value={updateForm.values.meta.reel}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.reel &&
                                            Boolean(
                                                updateForm.errors.meta?.reel,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.reel &&
                                            updateForm.errors.meta?.reel
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.owner"
                                        label="Owner"
                                        value={updateForm.values.meta.owner}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.owner &&
                                            Boolean(
                                                updateForm.errors.meta?.owner,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.owner &&
                                            updateForm.errors.meta?.owner
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.store"
                                        label="Store"
                                        value={updateForm.values.meta.store}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.store &&
                                            Boolean(
                                                updateForm.errors.meta?.store,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.store &&
                                            updateForm.errors.meta?.store
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.year"
                                        label="Year"
                                        value={updateForm.values.meta.year}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.year &&
                                            Boolean(
                                                updateForm.errors.meta?.year,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.year &&
                                            updateForm.errors.meta?.year
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.folioPage"
                                        label="Folio Page"
                                        value={updateForm.values.meta.folioPage}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta
                                                ?.folioPage &&
                                            Boolean(
                                                updateForm.errors.meta
                                                    ?.folioPage,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta
                                                ?.folioPage &&
                                            updateForm.errors.meta?.folioPage
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.entryID"
                                        label="Entry ID"
                                        value={updateForm.values.meta.entryID}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.entryID &&
                                            Boolean(
                                                updateForm.errors.meta?.entryID,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.entryID &&
                                            updateForm.errors.meta?.entryID
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="meta.comments"
                                        label="Comments"
                                        value={updateForm.values.meta.comments}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.meta?.comments &&
                                            Boolean(
                                                updateForm.errors.meta
                                                    ?.comments,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.meta?.comments &&
                                            updateForm.errors.meta?.comments
                                        }
                                    />
                                    <Divider />
                                    <FormControlLabel
                                        value=""
                                        control={
                                            <TextareaAutosize
                                                // fullWidth
                                                // margin="dense"
                                                // variant="standard"
                                                name="entry"
                                                // label="Original Entry"
                                                value={updateForm.values.entry}
                                                onChange={
                                                    updateForm.handleChange
                                                }
                                                placeholder="Text of original entry"
                                            />
                                        }
                                        label="Original Entry Text"
                                        labelPlacement="top"
                                    />
                                    <FormHelperText
                                        error={
                                            updateForm.touched.entry &&
                                            Boolean(updateForm.errors.entry)
                                        }
                                    >
                                        {updateForm.touched.entry &&
                                            updateForm.errors.entry}
                                    </FormHelperText>
                                    <Divider />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.commodity"
                                        label="Money Commodity"
                                        value={
                                            updateForm.values.money.commodity
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money
                                                ?.commodity &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.commodity,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money
                                                ?.commodity &&
                                            updateForm.errors.money?.commodity
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.colony"
                                        label="Colony of Money"
                                        value={updateForm.values.money.colony}
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.colony &&
                                            Boolean(
                                                updateForm.errors.money?.colony,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.colony &&
                                            updateForm.errors.money?.colony
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.quantity"
                                        label="Quantity of Money"
                                        value={
                                            updateForm.values.money?.quantity
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money
                                                ?.quantity &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.quantity,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money
                                                ?.quantity &&
                                            updateForm.errors.money?.quantity
                                        }
                                    />
                                    <Divider />
                                    <Typography component="h2">
                                        Currency
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.currency.pounds"
                                        label="Pounds"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={
                                            updateForm.values.money.currency
                                                .pounds
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.currency
                                                ?.pounds &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.currency?.pounds,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.currency
                                                ?.pounds &&
                                            updateForm.errors.money?.currency
                                                ?.pounds
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.currency.shilling"
                                        label="Shilling"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={
                                            updateForm.values.money.currency
                                                .shilling
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.currency
                                                ?.shilling &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.currency?.shilling,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.currency
                                                ?.shilling &&
                                            updateForm.errors.money?.currency
                                                ?.shilling
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.currency.pence"
                                        label="Pence"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={
                                            updateForm.values.money.currency
                                                .pence
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.currency
                                                ?.pence &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.currency?.pence,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.currency
                                                ?.pence &&
                                            updateForm.errors.money?.currency
                                                ?.pence
                                        }
                                    />
                                    <Divider />
                                    <Typography component="h2">
                                        Sterling
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.sterling.pounds"
                                        label="Pounds"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={
                                            updateForm.values.money.sterling
                                                .pounds
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.sterling
                                                ?.pounds &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.sterling?.pounds,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.sterling
                                                ?.pounds &&
                                            updateForm.errors.money?.sterling
                                                ?.pounds
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.sterling.shilling"
                                        label="Day"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={
                                            updateForm.values.money.sterling
                                                .shilling
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.sterling
                                                ?.shilling &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.sterling?.shilling,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.sterling
                                                ?.shilling &&
                                            updateForm.errors.money?.sterling
                                                ?.shilling
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        variant="standard"
                                        name="money.sterling.pence"
                                        label="Day"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={
                                            updateForm.values.money.sterling
                                                .pence
                                        }
                                        onChange={updateForm.handleChange}
                                        error={
                                            updateForm.touched.money?.sterling
                                                ?.pence &&
                                            Boolean(
                                                updateForm.errors.money
                                                    ?.sterling?.pence,
                                            )
                                        }
                                        helperText={
                                            updateForm.touched.money?.sterling
                                                ?.pence &&
                                            updateForm.errors.money?.sterling
                                                ?.pence
                                        }
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <EntrySelectionTabForm
                                    formikForm={updateForm}
                                />
                            </Grid>
                        </Grid>
                        <Button variant="contained" type="submit">
                            Submit
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }
};

export default UpdateEntryPage;
