import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows: GridRowsProp = [
  
];

const columns: GridColDef[] = [
  { field: 'accName', headerName: 'Account Holder\'s Name', width: 180 },
  { field: 'date', headerName: 'Date', width: 70 },
  { field: 'store', headerName: 'Store', width: 100 },
  { field: 'items', headerName: 'Items | Category | Sub-Category', width: 200 },
  { field: 'personMen', headerName: 'Persons Mentioned', width: 100 },
  { field: 'placeMen', headerName: 'Places Mentioned', width: 100 },
  { field: 'crdr', headerName: 'Credit(CR) or Debit(DB)', width: 100},
  { field: 'price', headerName: 'Price', width: 50 },
];

export default function App() {
    return (
        <div style={{ height: 400, width: '100%' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
            <DataGrid rows={rows} columns={columns} />
            </div>
          </div>
        </div>
      );
    }

