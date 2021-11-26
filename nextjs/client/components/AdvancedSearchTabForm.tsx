import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import ItemEntrySearch from './ItemEntrySearch';
import RegularEntrySearch from './RegularEntrySearch';
import TabPanel from './TabPanel';
import TobaccoEntrySearch from './TobaccoEntrySearch';

const a11yProps = (index: number) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
};

const AdvancedSearchTabForm = ({ formikForm }: { formikForm: any }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (tabIndex === 0) {
            if (!Boolean(formikForm.values.itemEntry)) {
                formikForm.setFieldValue('itemEntry', {
                    perOrder: -1,
                    items: '',
                    category: '',
                    subcategory: '',
                    variant: '',
                });
            }
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('regularEntry', null);
        } else if (tabIndex === 1) {
            formikForm.setFieldValue('itemEntry', null);
            formikForm.setFieldValue('regularEntry', null);
            if (!Boolean(formikForm.values.tobaccoEntry)) {
                formikForm.setFieldValue('tobaccoEntry', {
                    description: '',
                    tobaccoMarkName: '',
                    noteNumber: -1,
                    moneyType: '',
                });
            }
        } else if (tabIndex === 2) {
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('itemEntry', null);
            if (!Boolean(formikForm.values.regularEntry)) {
                formikForm.setFieldValue('regularEntry', {
                    entryDescription: '',
                    tobaccoMarkName: '',
                });
            }
        }
    }, [tabIndex]);

    return (
        <Paper sx={{ width: '100%', backgroundColor: 'var(--secondary)' }}>
            <Tabs value={tabIndex} onChange={handleChange} centered>
                <Tab label="Item Entry" {...a11yProps(0)} />
                <Tab label="Tobacco Entry" {...a11yProps(1)} />
                <Tab label="Regular Entry" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
                <Paper sx={{ p: '1rem' }}>
                    <ItemEntrySearch formikForm={formikForm} />
                </Paper>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Paper sx={{ p: '1rem' }}>
                    <TobaccoEntrySearch formikForm={formikForm} />
                </Paper>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Paper sx={{ p: '1rem' }}>
                    <RegularEntrySearch formikForm={formikForm} />
                </Paper>
            </TabPanel>
        </Paper>
    );
};

export default AdvancedSearchTabForm;
