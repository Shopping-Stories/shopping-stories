import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import { PaperStyles } from 'styles/styles';
import CreateItemEntryFrom from './CreateItemEntryForm';
import CreateRegularEntryFrom from './CreateRegularEntryForm';
import CreateTobaccoEntryFrom from './CreateTobaccoEntryForm';
import TabPanel from './TabPanel';

const a11yProps = (index: number) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
};

const EntrySelectionTabForm = ({
    formikForm,
    initialIndex,
    disabled,
}: {
    formikForm: any;
    initialIndex?: number;
    disabled?: boolean;
}) => {
    const [tabIndex, setTabIndex] = useState(initialIndex || 0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (tabIndex === 0) {
            if (!Boolean(formikForm.values.itemEntries)) {
                formikForm.setFieldValue('itemEntries', []);
            }
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('regularEntry', null);
        } else if (tabIndex === 1) {
            formikForm.setFieldValue('itemEntries', null);
            formikForm.setFieldValue('regularEntry', null);
            if (!Boolean(formikForm.values.tobaccoEntry)) {
                formikForm.setFieldValue('tobaccoEntry', {
                    entry: '',
                    tobaccoShaved: 0,
                    marks: [],
                    notes: [],
                    money: [],
                });
            }
        } else if (tabIndex === 2) {
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('itemEntries', null);
            if (!Boolean(formikForm.values.regularEntry)) {
                formikForm.setFieldValue('regularEntry', {
                    entry: '',
                    tobaccoMarks: [],
                    itemsMentioned: [],
                });
            }
        }
    }, [tabIndex]);

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                value={tabIndex}
                onChange={disabled === true ? () => {} : handleChange}
            >
                <Tab label="Item Entries" {...a11yProps(0)} />
                <Tab label="Tobacco Entry" {...a11yProps(1)} />
                <Tab label="Regular Entry" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
                <Paper sx={PaperStyles}>
                    <CreateItemEntryFrom
                        disabled={disabled}
                        formikForm={formikForm}
                    />
                </Paper>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Paper sx={PaperStyles}>
                    <CreateTobaccoEntryFrom
                        disabled={disabled}
                        formikForm={formikForm}
                    />
                </Paper>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Paper sx={PaperStyles}>
                    <CreateRegularEntryFrom
                        disabled={disabled}
                        formikForm={formikForm}
                    />
                </Paper>
            </TabPanel>
        </Box>
    );
};

export default EntrySelectionTabForm;
