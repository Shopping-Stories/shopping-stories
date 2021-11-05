import DsTabs from '@components/DsTabs';
import Header from '@components/Header';
import ParseTable from '@components/ParseTable';

import React from 'react';

const databasesearch = () => {
    return (
        <div>
            <Header />
            <DsTabs />
            <ParseTable entries={[]} />
        </div>
    );
};

export default databasesearch;
