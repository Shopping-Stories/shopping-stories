import DashBoardTabs from '@components/DashboardTabs';
import SideMenu from '@components/SideMenu';
import { isInGroup } from '@hooks/useAuth.hook';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NavLink } from 'client/types';
import { Roles } from 'config/constants.config';
import { isEqual, uniqWith } from 'lodash';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { PaperStyles } from 'styles/styles';

const adminLinks: NavLink[] = [
    { title: `import spreadsheet`, path: `/spreadsheet/import` },
    { title: `manage item glossary`, path: `/dashboard/glossary/items` },
    { title: `manage documents`, path: `/dashboard/documents` },
];

const sideLinks: NavLink[] = [
    { title: `manage categories`, path: `/dashboard/categories` },
    { title: `manage items`, path: `/dashboard/items` },
    { title: `manage people`, path: `/dashboard/people` },
    { title: `manage places`, path: `/dashboard/places` },
    { title: `manage tobacco marks`, path: `/dashboard/marks` },
];

interface DashBoardPageSkeletonProps {
    children?: React.ReactNode;
    groups: string[];
}

const DashboardPageSkeleton = (props: DashBoardPageSkeletonProps) => {
    const router = useRouter();
    const isSmallerThanMd = useMediaQuery((theme: any) =>
        theme.breakpoints.down('md'),
    );
    const isAdmin = isInGroup(Roles.Admin, props.groups);
    const isModerator = isInGroup(Roles.Moderator, props.groups);
    const isNotAdminOrModerator = !(isAdmin || isModerator);

    const links = isAdmin
        ? uniqWith([...adminLinks, ...sideLinks], isEqual)
        : sideLinks;

    const currentPageIndex = links.findIndex(
        (link) => link.path === router.route,
    );

    return (
        <Fragment>
            <Grid container>
                {isNotAdminOrModerator ? null : isSmallerThanMd ? (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                backgroundColor: 'var(--secondary)',
                                ...PaperStyles,
                            }}
                        >
                            <DashBoardTabs
                                pageIndex={currentPageIndex}
                                links={links}
                            />
                        </Paper>
                    </Grid>
                ) : (
                    <Grid item xs={4}>
                        <SideMenu links={links} />
                    </Grid>
                )}
                <Grid
                    item
                    xs={isSmallerThanMd || isNotAdminOrModerator ? 12 : 8}
                >
                    {props.children}
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default DashboardPageSkeleton;
