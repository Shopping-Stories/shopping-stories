import AuthSkeleton from '@components/AuthSkeleton';
import MuiNextLink from '@components/MuiNextLink';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import TextFieldWithHide from '@components/TextFieldWithHide';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as yup from 'yup';

const signUpSchema = yup.object({
    email: yup
        .string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    username: yup.string().required('Username is required'),
    password: yup
        .string()
        .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/,
            'A password must contain at least 1 uppercase character, 1 lowercase character, and at least 1 digit',
        )
        .min(8, 'A password must be at least 8 characters long')
        .required('A password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
    firstName: yup
        .string()
        .min(1, 'First name should be of minimum 1 character length')
        .required('First name is required'),
    lastName: yup
        .string()
        .min(1, 'Last name should be of minimum 1 character length')
        .required('Last name is required'),
});

const SignUpPage: NextPage = () => {
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

    const signUpForm = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { username, email, password, firstName, lastName } =
                    values;
                const { user } = await Auth.signUp({
                    username,
                    password,
                    attributes: {
                        email,
                        given_name: firstName,
                        family_name: lastName,
                    },
                });
                router.push(`/auth/signup/code?username=${user.getUsername()}`);
            } catch (error: any) {
                console.error('error signing up ->:', error);
                if (error.message !== undefined) {
                    const includesUser = error.message
                        .toLowerCase()
                        .includes('user');
                    const includesPass = error.message
                        .toLowerCase()
                        .includes('pass');
                    const includesEmail = error.message
                        .toLowerCase()
                        .includes('email');
                    const includesCode = error.message
                        .toLowerCase()
                        .includes('code');
                    if (includesUser && !includesPass) {
                        signUpForm.setFieldError('username', error.message);
                    } else if (!includesUser && includesPass) {
                        signUpForm.setFieldError('password', error.message);
                    } else if (includesEmail) {
                        signUpForm.setFieldError('email', error.message);
                    } else if (includesCode) {
                        setError(error.message);
                        setErrorOpen(true);
                    } else {
                        console.error(`Error:  ${error.message}`);
                        setError(error.message);
                        setErrorOpen(true);
                    }
                }
                // switch (error.message) {
                //     case 'User already exists':
                //         signUpForm.setFieldError('username', error.message);
                //         break;
                //     default:
                //         console.error(`Error:  ${error.message}`);
                // }
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
        <AuthSkeleton formikForm={signUpForm}>
            <FormGroup>
                <Typography variant="h2">Sign Up</Typography>
                <TextFieldWithFormikValidation
                    fullWidth
                    name="username"
                    label="Username"
                    fieldName="username"
                    formikForm={signUpForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    fieldName="email"
                    formikForm={signUpForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="firstName"
                    label="First name"
                    fieldName="firstName"
                    formikForm={signUpForm}
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="lastName"
                    label="Last name"
                    fieldName="lastName"
                    formikForm={signUpForm}
                />
                <TextFieldWithHide
                    fullWidth
                    name="password"
                    label="Password"
                    formikForm={signUpForm}
                    fieldName="password"
                />
                <TextFieldWithHide
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    formikForm={signUpForm}
                    fieldName="confirmPassword"
                />
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
                    Sign Up
                </LoadingButton>
                <Container>
                    <MuiNextLink href="/auth/signin">
                        Already have an account? Sign in here!
                    </MuiNextLink>
                    <br />
                    <MuiNextLink href={`${router.route}/code`}>
                        Already have a code? Confirm your email here!
                    </MuiNextLink>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    );
};

export default SignUpPage;
