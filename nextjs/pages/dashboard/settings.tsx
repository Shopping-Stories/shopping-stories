import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import useAuth from '@hooks/useAuth.hook';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';
import { Fragment } from 'react';

const AdminDashboardPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin, Roles.Moderator]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Fragment>
            <ColorBackground>
                <Header />
                <DashboardPageSkeleton groups={groups} />
            </ColorBackground>
        </Fragment>
    );
};

export default AdminDashboardPage;
