import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import TextFieldWithFormikValidation from './TextFieldWithFormikValidation';

interface ItemEntrySearchProps {
    formikForm: any;
}

const ItemEntrySearch = ({ formikForm }: ItemEntrySearchProps) => {
    const ref = formikForm.values.itemEntry;
    const isSmallerThanMd = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    return (
        <div>
            {ref ? (
                <Stack direction={isSmallerThanMd ? "column" : "row"} spacing={2}>
                    <TextFieldWithFormikValidation
                        name={`itemEntry.items`}
                        label={`Item Name`}
                        formikForm={formikForm}
                        fieldName={`itemEntry.items`}
                    />
                    <TextFieldWithFormikValidation
                        name={`itemEntry.category`}
                        label={`Category`}
                        formikForm={formikForm}
                        fieldName={`itemEntry.category`}
                    />
                    <TextFieldWithFormikValidation
                        name={`itemEntry.subcategory`}
                        label={`Subcategory`}
                        formikForm={formikForm}
                        fieldName={`itemEntry.subcategory`}
                    />
                    <TextFieldWithFormikValidation
                        name={`itemEntry.variant`}
                        label={`Variant`}
                        formikForm={formikForm}
                        fieldName={`itemEntry.variant`}
                    />
                    <TextFieldWithFormikValidation
                        name={`itemEntry.perOrder`}
                        label={`Per-Order`}
                        type="number"
                        inputProps={{ min: -1 }}
                        formikForm={formikForm}
                        fieldName={`itemEntry.perOrder`}
                    />
                </Stack>
            ) : null}
        </div>
    );
};

export default ItemEntrySearch;
