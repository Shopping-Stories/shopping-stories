import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import CreateItemEntryFrom from './CreateItemEntryForm';
import CreateTobaccoEntryFrom from './CreateTobaccoEntryForm';
import CreateRegularEntryFrom from './CreateRegularEntryForm';

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
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
};

const EntrySelectionTabForm = ({ formikForm }: any) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (tabIndex == 0) {
            formikForm.setFieldValue('itemEntries', []);
            formikForm.setFieldValue('tobaccoEntry', null);
            formikForm.setFieldValue('regularEntry', null);
        } else if (tabIndex == 1) {
            formikForm.setFieldValue('itemEntries', null);
            formikForm.setFieldValue('regularEntry', null);
            formikForm.setFieldValue('tobaccoEntry', {
                entry: '',
                tobaccoShaved: 0,
                marks: [],
                notes: [],
                money: [],
            });
        } else if (tabIndex == 2) {
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
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                display: 'flex',
            }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabIndex}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
                <CreateItemEntryFrom formikForm={formikForm} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <CreateTobaccoEntryFrom formikForm={formikForm} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <CreateRegularEntryFrom formikForm={formikForm} />
            </TabPanel>
        </Box>
    );
};

export default EntrySelectionTabForm;
