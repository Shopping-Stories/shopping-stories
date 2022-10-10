import AuthSkeleton from '@components/AuthSkeleton';
import SnackBarCloseButton from '@components/SnackBarCloseButton';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import TextFieldWithHide from '@components/TextFieldWithHide';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LinkColor } from 'styles/styles';
import * as yup from 'yup';

const initiatePassChangeSchema = yup.object({
    username: yup.string().required('Username is required'),
});

const submitPassChangeSchema = yup.object({
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
    code: yup
        .string()
        .matches(/[\S]+/, 'Please enter a properly formatted code')
        .required('A code is required'),
});

const SignInPage: NextPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openError, setErrorOpen] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>(null);

    const handleErrorClose = (
        _event: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const initiatePassChangeForm = useFormik({
        initialValues: {
            username: '',
        },
        validationSchema: initiatePassChangeSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { username } = values;
                await Auth.forgotPassword(username);
                setUser(username);
                setCodeSent(true);
            } catch (error: any) {
                if (error.message !== undefined) {
                    const includesUser = error.message
                        .toLowerCase()
                        .includes('user');
                    if (includesUser) {
                        initiatePassChangeForm.setFieldError(
                            'username',
                            error.message,
                        );
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

    const submitPassChangeForm = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            code: '',
        },
        validationSchema: submitPassChangeSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { username, code, password } = values;
                await Auth.forgotPasswordSubmit(username, code, password);
                router.push('/auth/signin');
            } catch (error: any) {
                if (error.message !== undefined) {
                    const includesUser = error.message
                        .toLowerCase()
                        .includes('user');
                    const includesCode = error.message
                        .toLowerCase()
                        .includes('code');
                    const includesPass = error.message
                        .toLowerCase()
                        .includes('pass');
                    if (includesUser && !includesPass) {
                        submitPassChangeForm.setFieldError(
                            'username',
                            error.message,
                        );
                    } else if (!includesUser && includesPass) {
                        submitPassChangeForm.setFieldError(
                            'password',
                            error.message,
                        );
                    } else if (includesUser && includesPass) {
                        setError(error.message);
                        setErrorOpen(true);
                    } else if (includesCode) {
                        submitPassChangeForm.setFieldError(
                            'code',
                            error.message,
                        );
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

    useEffect(() => {
        if (user) {
            submitPassChangeForm.setFieldValue('username', user);
        }
    }, [user]);

    return !codeSent ? (
        <AuthSkeleton formikForm={initiatePassChangeForm}>
            <FormGroup sx={{ textAlign: 'center' }}>
                <Typography variant="h2">Forgot Password</Typography>
                <TextFieldWithFormikValidation
                    fullWidth
                    name="username"
                    label="Username"
                    fieldName="username"
                    formikForm={initiatePassChangeForm}
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
                    Send code
                </LoadingButton>
                <Container>
                    <Link
                        sx={LinkColor}
                        component="button"
                        onClick={() => {
                            setCodeSent(true);
                        }}
                    >
                        Already have a code? Click here!
                    </Link>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    ) : (
        <AuthSkeleton formikForm={submitPassChangeForm}>
            <FormGroup sx={{ textAlign: 'center' }}>
                <Typography variant="h2">Change password</Typography>
                <TextFieldWithFormikValidation
                    fullWidth
                    name="username"
                    label="Username"
                    fieldName="username"
                    formikForm={submitPassChangeForm}
                />
                <TextFieldWithHide
                    fullWidth
                    name="password"
                    label="New Password"
                    formikForm={submitPassChangeForm}
                    fieldName="password"
                />
                <TextFieldWithHide
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    formikForm={submitPassChangeForm}
                    fieldName="confirmPassword"
                />
                <TextFieldWithFormikValidation
                    fullWidth
                    name="code"
                    label="Confirmation Code"
                    fieldName="code"
                    formikForm={submitPassChangeForm}
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
                    Change Password
                </LoadingButton>
                <Container>
                    <Link
                        sx={LinkColor}
                        component="button"
                        onClick={() => {
                            setCodeSent(false);
                        }}
                    >
                        Don&#39;t have a code? Click here!
                    </Link>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    );
};

export default SignInPage;
