import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import RegularEntryForm from './RegularEntryForm';
import ItemEntryForm from './ItemEntryForm';
import TobaccoEntryForm from './TobaccoEntryForm';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const useStyles = makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: 'block'
    }
})

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const classes = useStyles()
    const [enter, setEnter] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if(enter){
            console.log(enter)
        }
    }

    const [value, setValue] = React.useState(0);
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="General Search" {...a11yProps(0)} />
                    <Tab label="Regular Entry" {...a11yProps(1)} />
                    <Tab label="Item Entry" {...a11yProps(2)} />
                    <Tab label="Tobacco Entry" {...a11yProps(3)} />
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                <TextField
                    onChange={(e) => setEnter(e.target.value)}
                    className={classes.field}
                    id="outlined-basic"
                    label="Enter"
                    variant="outlined"
                    fullWidth
                />
                <Button 
                type="submit"
                variant="contained"
                >
                    Search
                </Button>
                </form>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <RegularEntryForm />
            </TabPanel>

            <TabPanel value={value} index={2}>
                <ItemEntryForm />
            </TabPanel>

            <TabPanel value={value} index={3}>
                <TobaccoEntryForm />
            </TabPanel>
        </Box>
    );
}
