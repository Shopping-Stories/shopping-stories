import Header from '@components/Header';
import SideMenu from '@components/SideMenu';
import useAuth from '@hooks/useAuth.hook';
import LinearProgress from '@mui/material/LinearProgress';
import { Roles } from 'config/constants.config';
import { NextPage } from 'next';

const AdminDashboardPage: NextPage = () => {
    const { groups, loading } = useAuth('/', [Roles.Admin]);

    if (loading) {
        return (
            <>
                <Header />
                <LinearProgress />
            </>
        );
    }

    return (
        <>
            <Header />
            <SideMenu groups={groups} />
        </>
    );
};

export default AdminDashboardPage;
