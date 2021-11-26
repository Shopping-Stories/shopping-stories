import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { NextRouter, useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { NavLink } from '../types';

interface LinkTabProps {
    router: NextRouter;
    label?: string;
    href?: string;
    value: number;
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

const DashBoardTabs = ({
    links,
    pageIndex,
}: {
    links: NavLink[];
    pageIndex: number;
}) => {
    const router = useRouter();
    const [value, setValue] = useState(pageIndex);

    const handleChange = (_: any, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <Tabs
                aria-label="DashBoard Navigation Tabs"
                scrollButtons
                allowScrollButtonsMobile
                value={value}
                onChange={handleChange}
                variant="scrollable"
            >
                {links.map(({ title, path }, i) => (
                    <LinkTab
                        router={router}
                        label={title}
                        key={i}
                        value={i}
                        href={path}
                    />
                ))}
            </Tabs>
        </Fragment>
    );
};

export default DashBoardTabs;
