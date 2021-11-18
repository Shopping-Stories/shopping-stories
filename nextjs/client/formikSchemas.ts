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
            thumbnailImage: yup.string(),
            name: yup.string(),
            material: yup.string(),
            width: yup.number(),
            height: yup.number(),
            date: yup.string(),
            caption: yup.string(),
            collectionCitation: yup.string(),
            url: yup.string(),
            license: yup.string(),
        }),
    ),
    examplePurchases: yup.array().of(
        yup.object({
            folio: yup.string(),
            folioItem: yup.string(),
            quantityPurchased: yup.number(),
            accountHolder: yup.string(),
            customer: yup.string(),
            purchaseDate: yup.date(),
            pounds: yup.number(),
            shilling: yup.number(),
            pence: yup.number(),
        }),
    ),
});