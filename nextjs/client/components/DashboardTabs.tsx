import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { NextRouter, useRouter } from 'next/router';
import { Fragment } from 'react';
import { NavLink } from '../types';

interface LinkTabProps {
    router: NextRouter;
    label?: string;
    href?: string;
}

function LinkTab(props: LinkTabProps) {
    const { router, ...otherProps } = props;
    return (
        <Tab
            component="a"
            onClick={(
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
            ) => {
                event.preventDefault();
                if (props.href !== undefined) {
                    router.push(props.href);
                }
            }}
            {...otherProps}
        />
    );
}

const DashBoardTabs = ({ links }: { links: NavLink[] }) => {
    const router = useRouter();
    return (
        <Fragment>
            <Tabs
                aria-label="DashBoard Navigation Tabs"
                scrollButtons
                allowScrollButtonsMobile
                variant="scrollable"
            >
                {links.map(({ title, path }, i) => (
                    <LinkTab
                        router={router}
                        label={title}
                        key={i}
                        href={path}
                    />
                ))}
            </Tabs>
        </Fragment>
    );
};

export default DashBoardTabs;
