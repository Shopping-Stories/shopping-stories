import AuthSkeleton from '@components/AuthSkeleton';
import MuiNextLink from '@components/MuiNextLink';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as yup from 'yup';

const signInSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

const SignInPage: NextPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openError, setErrorOpen] = useState(false);
    const [error, setError] = useState<string>('');

    const handleErrorClose = (
        _event: React.SyntheticEvent | React.MouseEvent,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const signInForm = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: signInSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { username, password } = values;
                await Auth.signIn(username, password);
                router.push(`/entries`);
            } catch (error: any) {
                if (error.message !== undefined) {
                    const includesUser = error.message
                        .toLowerCase()
                        .includes('user');
                    const includesPass = error.message
                        .toLowerCase()
                        .includes('pass');
                    if (includesUser && !includesPass) {
                        signInForm.setFieldError('username', error.message);
                    } else if (!includesUser && includesPass) {
                        signInForm.setFieldError('password', error.message);
                    } else if (includesUser && includesPass) {
                        setError(error.message);
                        setErrorOpen(true);
                    } else {
                        console.error(`Error:  ${error.message}`);
                        setError(error.message);
                        setErrorOpen(true);
                    }
                }
            }
            setIsLoading(false);
        },
    });

    const closeSnackBarButton = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleErrorClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    return (
        <AuthSkeleton formikForm={signInForm}>
            <FormGroup>
                <Typography variant="h2">Sign In</Typography>
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="username"
                    label="Username"
                    value={signInForm.values.username}
                    onChange={signInForm.handleChange}
                    error={
                        signInForm.touched.username &&
                        Boolean(signInForm.errors.username)
                    }
                    helperText={
                        signInForm.touched.username &&
                        signInForm.errors.username
                    }
                />
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="password"
                    label="Password"
                    type="password"
                    value={signInForm.values.password}
                    onChange={signInForm.handleChange}
                    error={
                        signInForm.touched.password &&
                        Boolean(signInForm.errors.password)
                    }
                    helperText={
                        signInForm.touched.password &&
                        signInForm.errors.password
                    }
                />

                <FormHelperText error={!!error}>{error}</FormHelperText>
                <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleErrorClose}
                    message={error}
                    action={closeSnackBarButton}
                />
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                >
                    Sign In
                </LoadingButton>
                <Container>
                    <MuiNextLink href="/auth/signup">
                        Don&#39;t have an account? Create one!
                    </MuiNextLink>
                    <Divider />
                    <MuiNextLink href="/auth/forgot-password">
                        Forgot your password? Click here!
                    </MuiNextLink>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    );
};

export default SignInPage;
