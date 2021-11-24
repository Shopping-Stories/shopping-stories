import DsTabs from '@components/DsTabs';
import Header from '@components/Header';
import ParseTable from '@components/ParseTable';
import { Paper } from '@mui/material';

import React from 'react';

const databasesearch = () => {
    return (
        <div>
            <Header />
            
            <DsTabs />
            <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        boxShadow: 5,
                        borderRadius: 2,
                        border: 1,
                        textAlign: 'center',
                        mx: 'auto',
                        margin: '1rem',
                        padding: '1rem',
                    }}
                >
            <ParseTable entries={[]} />
                    </Paper>
        </div>
    );
};

export default databasesearch;
