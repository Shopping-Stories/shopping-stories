import * as yup from 'yup';

export interface GlossaryItem {
    id: string;
    name: string;
    description: string;
    origin: string;
    use: string;
    category: string;
    subcategory: string;
    qualifiers: string;
    culturalContext: string;
    citations: string;
    images: [
        {
            dimensions: string;
            imageKey: string;
            name: string;
            material: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        },
    ];
}

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
