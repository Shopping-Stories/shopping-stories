import MuiNextLink from '@components/MuiNextLink';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from 'client/types';
import { signOut } from 'client/util';
import { useRouter } from 'next/router';
import { ButtonStyles } from 'styles/styles';

interface NavBarProps {
    navLinks: NavLink[];
    isLoggedIn?: boolean;
}

const Navbar = ({ navLinks, isLoggedIn }: NavBarProps) => {
    const router = useRouter();
    return (
        <Toolbar
            component="nav"
            sx={{
                display: { xs: `none`, md: `flex` },
            }}
        >
            <Stack direction="row" spacing={4}>
                {navLinks.map(({ title, path }, i) => (
                    <MuiNextLink
                        key={`${title}${i}`}
                        href={path}
                        variant="button"
                        sx={{ color: `#FFFFFF`, opacity: 0.7 }}
                    >
                        {title}
                    </MuiNextLink>
                ))}
                {isLoggedIn ? (
                    <Button
                        sx={ButtonStyles}
                        variant="contained"
                        onClick={() => signOut(router)}
                    >
                        Sign out
                    </Button>
                ) : (
                    <Button
                        sx={ButtonStyles}
                        variant="contained"
                        onClick={() => router.push('/auth/signin')}
                    >
                        Sign In
                    </Button>
                )}
            </Stack>
        </Toolbar>
    );
};

export default Navbar;
