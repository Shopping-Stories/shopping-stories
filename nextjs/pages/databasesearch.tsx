import Header from '@components/Header'
import React from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@mui/material';
import DataDisplay from '@components/DataDisplay';


const databasesearch = () => {
    return(
        <div>
           <Header/> 
           <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={peopleMaster}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Person" />}
    />

    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={placeMaster}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Places" />}
    />

    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={itemMaster}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Items" />}
    />
    <Button variant="contained">Search</Button>
    <DataDisplay/>
        </div>
    )
}
const peopleMaster = [
    { label: 'Abel Abwards', lastName: 'Abwards', prefix: '', firstName: 'Abel', suffix: ''},
    { label: 'James Acton', lastName: 'Acton', prefix: '', firstName: 'James', suffix: ''},
    { label: 'Abednigo Adams', lastName: 'Adams', prefix: '', firstName: 'Abednigo', suffix: '' },
    { label: 'James Adams', lastName: 'Adams', prefix: '', firstName: 'James', suffix: '' },
    { label: 'Philip Adams', lastName: 'Adams', prefix: '', firstName: 'Philip', suffix: '' },
    { label: 'Robert Adams', lastName: 'Adams', prefix: '', firstName: 'Robert', suffix: '' },
    { label: 'Mr. Robert Adams', lastName: 'Adams', prefix: 'Mr', firstName: 'Robert', suffix: '' },
    { label: 'Sylvester Adams', lastName: 'Adams', prefix: 'Mr', firstName: 'Sylvester', suffix: '' },
    { label: 'Mr. William Adams Gentleman', lastName: 'Adams', prefix: 'Mr', firstName: 'William', suffix: 'Gentleman' },
    { label: 'William Adams', lastName: 'Adams', prefix: '', firstName: 'William', suffix: 'Junior' },
  ];
  const placeMaster = [
      {label: 'Colchester'},
  ]
  const itemMaster = [
    {label: 'Colchester'},
]

export default databasesearch