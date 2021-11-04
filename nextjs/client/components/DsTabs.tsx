import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="General Search" {...a11yProps(0)} />
          <Tab label="Regular Entry" {...a11yProps(1)} />
          <Tab label="Item Entry" {...a11yProps(2)} />
          <Tab label="Tobacco Entry" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}> 
      <TextField id="outlined-basic" label="Enter" variant="outlined" />
      <Button variant="contained">Search</Button>
      </TabPanel>

      <TabPanel value={value} index={1}>
      <TextField id="outlined-basic" label="Reel" variant="outlined" />
      <TextField id="outlined-basic" label="Store Owner" variant="outlined" />
      <TextField id="outlined-basic" label="Folio Year" variant="outlined" />
      <TextField id="outlined-basic" label="Folio Page" variant="outlined" />
      <TextField id="outlined-basic" label="Entry ID" variant="outlined" />
      <TextField id="outlined-basic" label="Account Holder Name" variant="outlined" />
      
      <TextField id="outlined-basic" label="People" variant="outlined" />
      <TextField id="outlined-basic" label="Places" variant="outlined" />
      <TextField id="outlined-basic" label="Commodity" variant="outlined" />
      <TextField id="outlined-basic" label="Colony" variant="outlined" />
      <TextField
          id="outlined-multiline-static"
          label="Entry Description"
          multiline
          rows={4}
          defaultValue="..."
        />
      <TextField id="outlined-basic" label="Tobacco Mark Name" variant="outlined" />
      <Button variant="contained">Search</Button>
      </TabPanel>

      <TabPanel value={value} index={2}>
      <TextField id="outlined-basic" label="Reel" variant="outlined" />
      <TextField id="outlined-basic" label="Store Owner" variant="outlined" />
      <TextField id="outlined-basic" label="Folio Year" variant="outlined" />
      <TextField id="outlined-basic" label="Folio Page" variant="outlined" />
      <TextField id="outlined-basic" label="Entry ID" variant="outlined" />
      <TextField id="outlined-basic" label="Account Holder Name" variant="outlined" />
    
      <TextField id="outlined-basic" label="People" variant="outlined" />
      <TextField id="outlined-basic" label="Places" variant="outlined" />
      <TextField id="outlined-basic" label="Commodity" variant="outlined" />
      <TextField id="outlined-basic" label="Colony" variant="outlined" />
      <TextField
          required
          id="outlined-required"
          label="Per Order (Yes or No)"
          defaultValue="1 for Yes, 0 for no"
        />
      <TextField id="outlined-basic" label="Item Name" variant="outlined" />
      <TextField id="outlined-basic" label="Category" variant="outlined" />
      <TextField id="outlined-basic" label="Sub-Category" variant="outlined" />
      <TextField id="outlined-basic" label="Varient" variant="outlined" />
      <Button variant="contained">Search</Button>
      </TabPanel>

      <TabPanel value={value} index={3}>
      <TextField id="outlined-basic" label="Reel" variant="outlined" />
      <TextField id="outlined-basic" label="Store Owner" variant="outlined" />
      <TextField id="outlined-basic" label="Folio Year" variant="outlined" />
      <TextField id="outlined-basic" label="Folio Page" variant="outlined" />
      <TextField id="outlined-basic" label="Entry ID" variant="outlined" />
      <TextField id="outlined-basic" label="Account Holder Name" variant="outlined" />
    
      <TextField id="outlined-basic" label="People" variant="outlined" />
      <TextField id="outlined-basic" label="Places" variant="outlined" />
      <TextField id="outlined-basic" label="Commodity" variant="outlined" />
      <TextField id="outlined-basic" label="Colony" variant="outlined" />
      <TextField
          id="outlined-multiline-static"
          label="Entry Description"
          multiline
          rows={4}
          defaultValue="..."
        />
      <TextField id="outlined-basic" label="Tobacco Mark Name" variant="outlined" />
      <TextField id="outlined-basic" label="Note Number" variant="outlined" />
      <TextField id="outlined-basic" label="Money Type" variant="outlined" />
      <Button variant="contained">Search</Button>
      </TabPanel>
    </Box>
  );
}
