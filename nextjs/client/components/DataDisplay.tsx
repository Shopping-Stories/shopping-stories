import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows: GridRowsProp = [
  
];

const columns: GridColDef[] = [
  { field: 'accName', headerName: 'Account Holder', flex: 1,
  minWidth: 100, },
  { field: 'date', headerName: 'Date', flex: 1,
  minWidth: 100 },
  { field: 'store', headerName: 'Store', flex: 1,
  minWidth: 100 },
  { field: 'items', headerName: 'Items | Category | Sub-Category', flex: 2,
  minWidth: 100 },
  { field: 'personMen', headerName: 'Persons Mentioned', flex: 1.25,
  minWidth: 100 },
  { field: 'placeMen', headerName: 'Places Mentioned', flex: 1.25,
  minWidth: 100 },
  { field: 'crdr', headerName: 'Credit(CR) or Debit(DB)', flex: 1,
  minWidth: 100},
  { field: 'price', headerName: 'Price', flex: 1,
  minWidth: 100 },
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

