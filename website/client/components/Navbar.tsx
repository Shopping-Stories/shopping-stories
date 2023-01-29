import MuiNextLink from '@components/MuiNextLink';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from 'client/types';
import { signOut } from 'client/util';
import { useRouter } from 'next/router';
import { ButtonStyles } from 'styles/styles';
import { ThemeSwitch } from './ThemeSwitch';

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
                display: { xs: `none`, md: `flex`, alignItems: 'center' },
            }}
        >
            <Stack direction="row" spacing={2}>
                {navLinks.map(({ title, path }, i) => (
                    <Button key={`${title}${i}`}>
                        <MuiNextLink
                            href={path}
                            variant="button"
                            sx={{ color: `#FFFFFF`, opacity: 0.7 }}
                        >
                            {title}
                        </MuiNextLink>
                    </Button>
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
            <ThemeSwitch />
            </Stack>
        </Toolbar>
    );
};

export default Navbar;
