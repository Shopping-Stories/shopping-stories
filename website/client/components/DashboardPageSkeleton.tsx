import SideMenu from '@components/SideMenu';
import { isInGroup } from '@hooks/useAuth.hook';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NavLink } from 'client/types';
import { Roles } from 'config/constants.config';
import { isEqual, uniqWith } from 'lodash';
// import { useRouter } from 'next/router';
// import DashBoardTabs from '@components/DashboardTabs';
// import Paper from '@mui/material/Paper';
// import { Fragment } from 'react';
// import { PaperStyles } from 'styles/styles';

const sideLinks: NavLink[] = [
    {title: 'Account Settings', path: '/dashboard/settings'}
    // { title: `manage categories`, path: `/dashboard/categories` },
    // { title: `manage places`, path: `/dashboard/places` },
    // { title: `manage tobacco marks`, path: `/dashboard/marks` },
];

const adminLinks: NavLink[] = [
    // { title: `import spreadsheet`, path: `/spreadsheet/newimport` },
    // { title: `manage item glossary`, path: `/dashboard/glossary/items` },
    // { title: `manage documents`, path: `/dashboard/documents` },
    { title: `manage users`, path: `/dashboard/users` },
    { title: `manage people`, path: `/dashboard/people` },
    { title: `manage items`, path: `/dashboard/items` },
    { title: `combine people`, path: `/dashboard/managepeople` },
    { title: `combine items`, path: `/dashboard/manageitems` },
    { title: `upload items and people`, path: `/dashboard/updateitemspeople` },
];

interface DashBoardPageSkeletonProps {
    children?: React.ReactNode;
    groups: string[];
}

const DashboardPageSkeleton = (props: DashBoardPageSkeletonProps) => {
    // const router = useRouter();
    const isSmallerThanMd = useMediaQuery((theme: any) =>
        theme.breakpoints.down('md'),
    );
    const isAdmin = isInGroup(Roles.Admin, props.groups);
    const isModerator = isInGroup(Roles.Moderator, props.groups);
    const isNotAdminOrModerator = !(isAdmin || isModerator);

    const links = isAdmin
        ? uniqWith([...sideLinks, ...adminLinks], isEqual)
        : sideLinks;

    // const currentPageIndex = links.findIndex(
    //     (link) => link.path === router.route,
    // );

    return (
        // <Fragment>
            <Grid container>
                {isNotAdminOrModerator
                    ? null
                    // : isSmallerThanMd ? (
                    // <Grid item xs={12}>
                    //     <Paper
                    //         sx={{
                    //             backgroundColor: 'var(--secondary)',
                    //             ...PaperStyles,
                    //         }}
                    //     >
                    //         <DashBoardTabs
                    //             pageIndex={currentPageIndex}
                    //             links={links}
                    //         />
                    //     </Paper>
                    // </Grid>
                    // )
                        : (
                    <Grid item xs={12}>
                        <SideMenu links={links} />
                    </Grid>
                )}
                <Grid
                    item
                    xs={isSmallerThanMd || isNotAdminOrModerator ? 12 : 12}
                >
                    {props.children}
                </Grid>
            </Grid>
        // </Fragment>
    );
};

export default DashboardPageSkeleton;
