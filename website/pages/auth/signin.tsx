import AuthSkeleton from '@components/AuthSkeleton';
import MuiNextLink from '@components/MuiNextLink';
import SnackBarCloseButton from '@components/SnackBarCloseButton';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import TextFieldWithHide from '@components/TextFieldWithHide';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LinkColor } from 'styles/styles';
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
        _event: React.SyntheticEvent | Event,
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

    return (
        <AuthSkeleton formikForm={signInForm}>
            <FormGroup sx={{ textAlign: 'center' }}>
                <Typography variant="h2">Sign In</Typography>
                <TextFieldWithFormikValidation
                    fullWidth
                    name="username"
                    label="Username"
                    formikForm={signInForm}
                    fieldName="username"
                />
                <TextFieldWithHide
                    fullWidth
                    name="password"
                    label="Password"
                    formikForm={signInForm}
                    fieldName="password"
                />
                <FormHelperText error={!!error}>{error}</FormHelperText>
                <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleErrorClose}
                    message={error}
                    action={SnackBarCloseButton({
                        handleClose: handleErrorClose,
                    })}
                />
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                >
                    Sign In
                </LoadingButton>
                <Container>
                    <MuiNextLink sx={LinkColor} href="/auth/signup">
                        Don&#39;t have an account? Create one!
                    </MuiNextLink>
                    <Divider />
                    <MuiNextLink sx={LinkColor} href="/auth/forgot-password">
                        Forgot your password? Click here!
                    </MuiNextLink>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    );
};

export default SignInPage;
