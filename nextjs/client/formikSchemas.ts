import * as yup from 'yup';

export const glossaryItemSchema = yup.object({
    name: yup.string(),
    description: yup.string(),
    origin: yup.string(),
    use: yup.string(),
    category: yup.string(),
    subcategory: yup.string(),
    qualifiers: yup.string(),
    culturalContext: yup.string(),
    citations: yup.string(),
    images: yup.array().of(
        yup.object({
            imageKey: yup.string(),
            name: yup.string(),
            material: yup.string(),
            dimensions: yup.string(),
            date: yup.string(),
            caption: yup.string(),
            collectionCitation: yup.string(),
            url: yup.string(),
            license: yup.string(),
        }),
    ),
});

export const searchSchema = yup.object({
    search: yup.string(),
});

export const CreateDocumentSchema = yup.object({
    name: yup.string().required('A name is required'),
    description: yup.string().required('A description is required'),
    fileKey: yup.string().required('A file key is required'),
});

export const UpdateDocumentSchema = yup.object({
    name: yup.string().required('A name is required'),
    description: yup.string().required('A description is required'),
    fileKey: yup.string().required('A file key is required'),
});

export const entryInitialValues = {
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
        fullDate: new Date(100, 0, 1).toISOString().substring(0, 10),
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
};

export const poundShillingPence = yup.object({
    pounds: yup.number().default(0),
    shilling: yup.number().default(0),
    pence: yup.number().default(0),
});

export const accountHolderSchema = yup.object({
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
});

export const metaSchema = yup.object({
    ledger: yup.string().default(''),
    reel: yup.string().default(''),
    owner: yup.string().default(''),
    store: yup.string().default(''),
    year: yup.string().default(''),
    folioPage: yup.string().default(''),
    entryID: yup.string().default(''),
    comments: yup.string().default(''),
});

export const dateInfoSchema = yup.object({
    day: yup.number().default(-1),
    month: yup.number().default(-1),
    year: yup.number().default(-1),
    fullDate: yup.date().nullable(),
});

export const itemsMentionedSchema = yup.array().of(
    yup.object({
        quantity: yup.number().default(0),
        qualifier: yup.string().default(''),
        item: yup.string().default(''),
    }),
);

export const itemEntriesSchema = yup
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
            itemsMentioned: itemsMentionedSchema,
        }),
    )
    .default(null)
    .nullable();

export const tobaccoEntrySchema = yup
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
    .nullable();

export const regularEntrySchema = yup
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
    .nullable();

export const createEntrySchema = yup.object({
    accountHolder: accountHolderSchema,
    meta: metaSchema,
    dateInfo: dateInfoSchema,
    folioRefs: yup.array().of(yup.string().default('')).default([]),
    ledgerRefs: yup.array().of(yup.string().default('')).default([]),
    itemEntries: itemEntriesSchema,
    tobaccoEntry: tobaccoEntrySchema,
    regularEntry: regularEntrySchema,
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

export const advancedSearchSchema = yup.object({
    reel: yup.string(),
    storeOwner: yup.string(),
    folioYear: yup.string(),
    folioPage: yup.string(),
    entryID: yup.string(),
    accountHolderName: yup.string(),
    date: yup.date(),
    date2: yup.date(),
    people: yup.string(),
    places: yup.string(),
    commodity: yup.string(),
    colony: yup.string(),
    itemEntry: yup.object({
        perOrder: yup.number(),
        items: yup.string(),
        category: yup.string(),
        subcategory: yup.string(),
        variant: yup.string(),
    }).nullable(),
    tobaccoEntry: yup.object({
        description: yup.string(),
        tobaccoMarkName: yup.string(),
        noteNumber: yup.number(),
        moneyType: yup.string(),
    }).nullable(),
    regularEntry: yup.object({
        entryDescription: yup.string(),
        tobaccoMarkName: yup.string(),
    }).nullable(),
});
