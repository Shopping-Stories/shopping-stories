import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import { PaperStyles } from 'styles/styles';
import CreateItemEntryFrom from './CreateItemEntryForm';
import CreateRegularEntryFrom from './CreateRegularEntryForm';
import CreateTobaccoEntryFrom from './CreateTobaccoEntryForm';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
};

const EntrySelectionTabForm = ({
    formikForm,
    initialIndex,
}: {
    formikForm: any;
    initialIndex?: number;
}) => {
    const [tabIndex, setTabIndex] = useState(initialIndex || 0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (tabIndex === 0) {
            formikForm.setFieldValue('itemEntries', []);
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('regularEntry', null);
        } else if (tabIndex === 1) {
            formikForm.setFieldValue('itemEntries', null);
            formikForm.setFieldValue('regularEntry', null);
            formikForm.setFieldValue('tobaccoEntry', {
                entry: '',
                tobaccoShaved: 0,
                marks: [],
                notes: [],
                money: [],
            });
        } else if (tabIndex === 2) {
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('itemEntries', null);
            formikForm.setFieldValue('regularEntry', {
                entry: '',
                tobaccoMarks: [],
                itemsMentioned: [],
            });
        }
    }, [tabIndex]);

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={tabIndex} onChange={handleChange} centered>
                <Tab label="Item Entries" {...a11yProps(0)} />
                <Tab label="Tobacco Entry" {...a11yProps(1)} />
                <Tab label="Regular Entry" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
                <Paper sx={PaperStyles}>
                    <CreateItemEntryFrom formikForm={formikForm} />
                </Paper>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Paper sx={PaperStyles}>
                    <CreateTobaccoEntryFrom formikForm={formikForm} />
                </Paper>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Paper sx={PaperStyles}>
                    <CreateRegularEntryFrom formikForm={formikForm} />
                </Paper>
            </TabPanel>
        </Box>
    );
};

export default EntrySelectionTabForm;
