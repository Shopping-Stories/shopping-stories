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
import { entryFields } from 'client/graphqlDefs';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useMutation } from 'urql';
import * as yup from 'yup';

const createEntryDef = `
mutation createEntry($entry: CreateEntryInput!) {
  createEntry(createEntryInput: $entry) {
    ...entryFields
  }
}
${entryFields}
`;


const poundShillingPence = yup.object({
    pounds: yup.number().default(0),
    shilling: yup.number().default(0),
    pence: yup.number().default(0),
});

const createEntrySchema = yup.object({
    accountHolder: yup.object({
        accountFirstName: yup.string().default(''),
        accountLastName: yup.string().default(''),
        prefix: yup.string().default(''),
        suffix: yup.string().default(''),
        profession: yup.string().default(''),
        location: yup.string().default(''),
        reference: yup.string().default(''),
        debitOrCredit: yup.number().default(2),
        accountHolderID: yup.string().default('').matches(/^[a-fA-F0-9]{24}$/, "You much pick a person"),
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
        year: yup.string().default(''),
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

const CreateEntryPage: NextPage = () => {
    const [_createEntryResult, createEntry] = useMutation(createEntryDef);

    const createForm = useFormik({
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
                year: '',
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
        validationSchema: createEntrySchema,
        onSubmit: async (values, { resetForm }) => {
            // do your stuff
            const res = await createEntry({
                entry: values,
            });
            console.log({ values });
            if (res.error) {
            } else {
            resetForm();
            }
        },
    });

    return (
        <div>
            <Header />
            <Paper
                sx={{
                    backgroundColor: `var(--secondary-bg)`,
                    margin: '3rem',
                    padding: '1rem',
                }}
            >
                <form onSubmit={createForm.handleSubmit}>
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
                                        createForm.values.accountHolder
                                            .accountFirstName
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.accountFirstName &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.accountFirstName,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.accountFirstName &&
                                        createForm.errors.accountHolder
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
                                        createForm.values.accountHolder
                                            .accountLastName
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.accountLastName &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.accountLastName,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.accountLastName &&
                                        createForm.errors.accountHolder
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
                                        createForm.values.accountHolder.prefix
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.prefix &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.prefix,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.prefix &&
                                        createForm.errors.accountHolder?.prefix
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="accountHolder.suffix"
                                    label="Suffix"
                                    value={
                                        createForm.values.accountHolder.suffix
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.suffix &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.suffix,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.suffix &&
                                        createForm.errors.accountHolder?.suffix
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="accountHolder.profession"
                                    label="Profession"
                                    value={
                                        createForm.values.accountHolder
                                            .profession
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.profession &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.profession,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.profession &&
                                        createForm.errors.accountHolder
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
                                        createForm.values.accountHolder.location
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.location &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.location,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.location &&
                                        createForm.errors.accountHolder
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
                                        createForm.values.accountHolder
                                            .reference
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.reference &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.reference,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.reference &&
                                        createForm.errors.accountHolder
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
                                        createForm.values.accountHolder
                                            .debitOrCredit
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.accountHolder
                                            ?.debitOrCredit &&
                                        Boolean(
                                            createForm.errors.accountHolder
                                                ?.debitOrCredit,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.accountHolder
                                            ?.debitOrCredit &&
                                        createForm.errors.accountHolder
                                            ?.debitOrCredit
                                    }
                                />
                                <FindAccountHolder formikForm={createForm}/>
                            </FormGroup>
                            <Divider />
                            <Typography component="h2">Date Info</Typography>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="dateInfo.day"
                                    label="Day"
                                    type="number"
                                    inputProps={{ min: -1, max: 31 }}
                                    value={createForm.values.dateInfo.day}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.dateInfo?.day &&
                                        Boolean(createForm.errors.dateInfo?.day)
                                    }
                                    helperText={
                                        createForm.touched.dateInfo?.day &&
                                        createForm.errors.dateInfo?.day
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
                                    value={createForm.values.dateInfo.month}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.dateInfo?.month &&
                                        Boolean(
                                            createForm.errors.dateInfo?.month,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.dateInfo?.month &&
                                        createForm.errors.dateInfo?.month
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="dateInfo.year"
                                    label="Year"
                                    value={createForm.values.dateInfo.year}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.dateInfo?.year &&
                                        Boolean(
                                            createForm.errors.dateInfo?.year,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.dateInfo?.year &&
                                        createForm.errors.dateInfo?.year
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
                                    value={createForm.values.dateInfo.fullDate}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.dateInfo?.fullDate &&
                                        Boolean(
                                            createForm.errors.dateInfo
                                                ?.fullDate,
                                        )
                                    }
                                />
                                <FormHelperText id="outlined-weight-helper-text">
                                    {createForm.touched.dateInfo?.fullDate &&
                                        createForm.errors.dateInfo?.fullDate}
                                </FormHelperText>
                                <FolioReferencesForm formikForm={createForm} />
                                <LedgerReferencesForm formikForm={createForm} />
                                <EntryPeopleForm formikForm={createForm} />
                                <EntryPlacesForm formikForm={createForm} />
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
                            <Typography component="h2">Meta Info</Typography>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.ledger"
                                    label="Ledger"
                                    value={createForm.values.meta.ledger}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.ledger &&
                                        Boolean(createForm.errors.meta?.ledger)
                                    }
                                    helperText={
                                        createForm.touched.meta?.ledger &&
                                        createForm.errors.meta?.ledger
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.reel"
                                    label="Reel"
                                    value={createForm.values.meta.reel}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.reel &&
                                        Boolean(createForm.errors.meta?.reel)
                                    }
                                    helperText={
                                        createForm.touched.meta?.reel &&
                                        createForm.errors.meta?.reel
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.owner"
                                    label="Owner"
                                    value={createForm.values.meta.owner}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.owner &&
                                        Boolean(createForm.errors.meta?.owner)
                                    }
                                    helperText={
                                        createForm.touched.meta?.owner &&
                                        createForm.errors.meta?.owner
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.store"
                                    label="Store"
                                    value={createForm.values.meta.store}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.store &&
                                        Boolean(createForm.errors.meta?.store)
                                    }
                                    helperText={
                                        createForm.touched.meta?.store &&
                                        createForm.errors.meta?.store
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.year"
                                    label="Year"
                                    value={createForm.values.meta.year}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.year &&
                                        Boolean(createForm.errors.meta?.year)
                                    }
                                    helperText={
                                        createForm.touched.meta?.year &&
                                        createForm.errors.meta?.year
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.folioPage"
                                    label="Folio Page"
                                    value={createForm.values.meta.folioPage}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.folioPage &&
                                        Boolean(
                                            createForm.errors.meta?.folioPage,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.meta?.folioPage &&
                                        createForm.errors.meta?.folioPage
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.entryID"
                                    label="Entry ID"
                                    value={createForm.values.meta.entryID}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.entryID &&
                                        Boolean(createForm.errors.meta?.entryID)
                                    }
                                    helperText={
                                        createForm.touched.meta?.entryID &&
                                        createForm.errors.meta?.entryID
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="meta.comments"
                                    label="Comments"
                                    value={createForm.values.meta.comments}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.meta?.comments &&
                                        Boolean(
                                            createForm.errors.meta?.comments,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.meta?.comments &&
                                        createForm.errors.meta?.comments
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
                                            value={createForm.values.entry}
                                            onChange={createForm.handleChange}
                                            placeholder="Text of original entry"
                                        />
                                    }
                                    label="Original Entry Text"
                                    labelPlacement="top"
                                />
                                <FormHelperText
                                    error={
                                        createForm.touched.entry &&
                                        Boolean(createForm.errors.entry)
                                    }
                                >
                                    {createForm.touched.entry &&
                                        createForm.errors.entry}
                                </FormHelperText>
                                <Divider />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="money.commodity"
                                    label="Money Commodity"
                                    value={createForm.values.money.commodity}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.commodity &&
                                        Boolean(
                                            createForm.errors.money?.commodity,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.commodity &&
                                        createForm.errors.money?.commodity
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="money.colony"
                                    label="Colony of Money"
                                    value={createForm.values.money.colony}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.colony &&
                                        Boolean(createForm.errors.money?.colony)
                                    }
                                    helperText={
                                        createForm.touched.money?.colony &&
                                        createForm.errors.money?.colony
                                    }
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="money.quantity"
                                    label="Quantity of Money"
                                    value={createForm.values.money?.quantity}
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.quantity &&
                                        Boolean(
                                            createForm.errors.money?.quantity,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.quantity &&
                                        createForm.errors.money?.quantity
                                    }
                                />
                                <Divider />
                                <Typography component="h2">Currency</Typography>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="money.currency.pounds"
                                    label="Pounds"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={
                                        createForm.values.money.currency.pounds
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.currency
                                            ?.pounds &&
                                        Boolean(
                                            createForm.errors.money?.currency
                                                ?.pounds,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.currency
                                            ?.pounds &&
                                        createForm.errors.money?.currency
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
                                        createForm.values.money.currency
                                            .shilling
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.currency
                                            ?.shilling &&
                                        Boolean(
                                            createForm.errors.money?.currency
                                                ?.shilling,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.currency
                                            ?.shilling &&
                                        createForm.errors.money?.currency
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
                                        createForm.values.money.currency.pence
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.currency
                                            ?.pence &&
                                        Boolean(
                                            createForm.errors.money?.currency
                                                ?.pence,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.currency
                                            ?.pence &&
                                        createForm.errors.money?.currency?.pence
                                    }
                                />
                                <Divider />
                                <Typography component="h2">Sterling</Typography>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    variant="standard"
                                    name="money.sterling.pounds"
                                    label="Pounds"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={
                                        createForm.values.money.sterling.pounds
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.sterling
                                            ?.pounds &&
                                        Boolean(
                                            createForm.errors.money?.sterling
                                                ?.pounds,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.sterling
                                            ?.pounds &&
                                        createForm.errors.money?.sterling
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
                                        createForm.values.money.sterling
                                            .shilling
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.sterling
                                            ?.shilling &&
                                        Boolean(
                                            createForm.errors.money?.sterling
                                                ?.shilling,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.sterling
                                            ?.shilling &&
                                        createForm.errors.money?.sterling
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
                                        createForm.values.money.sterling.pence
                                    }
                                    onChange={createForm.handleChange}
                                    error={
                                        createForm.touched.money?.sterling
                                            ?.pence &&
                                        Boolean(
                                            createForm.errors.money?.sterling
                                                ?.pence,
                                        )
                                    }
                                    helperText={
                                        createForm.touched.money?.sterling
                                            ?.pence &&
                                        createForm.errors.money?.sterling?.pence
                                    }
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <EntrySelectionTabForm formikForm={createForm} />
                        </Grid>
                    </Grid>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default CreateEntryPage;
