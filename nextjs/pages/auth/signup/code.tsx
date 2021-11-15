import AuthSkeleton from '@components/AuthSkeleton';
import LoadingButton from '@mui/lab/LoadingButton';
import FormGroup from '@mui/material/FormGroup';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import Button from '@mui/material/Button';

const confirmationCodeSchema = yup.object({
    username: yup.string().required(),
    code: yup
        .string()
        .matches(/[\S]+/, 'Please enter a properly formatted code')
        .required('A code is required'),
});

const ConfirmAccountPage: NextPage = () => {
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

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { username } = router.query;

    const confirmEmailForm = useFormik({
        initialValues: {
            code: '',
            username: (username as string) || '',
        },
        validationSchema: confirmationCodeSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { code, username } = values;
                const { user: _user } = await Auth.confirmSignUp(
                    username,
                    code,
                );
                router.push('/auth/signin');
            } catch (error: any) {
                if (error.message !== undefined) {
                    if (error.message.toLowerCase().includes('code')) {
                        confirmEmailForm.setFieldError('code', error.message);
                    } else if (error.message.toLowerCase().includes('user')) {
                        confirmEmailForm.setFieldError(
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

    const resendCode = async () => {
        if (confirmEmailForm.values.username) {
            setError('');
            try {
                await Auth.resendSignUp(confirmEmailForm.values.username);
            } catch (error: any) {
                console.error(`Error resending sign up code: ${error.message}`);
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        if (username) {
            confirmEmailForm.setFieldValue('username', username);
        }
    }, [username]);

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
        <AuthSkeleton formikForm={confirmEmailForm}>
            <FormGroup>
                <Typography variant="h3">
                    Please confirm your account
                </Typography>
                {!router.query.username && (
                    <TextField
                        fullWidth
                        margin="dense"
                        variant="standard"
                        name="username"
                        label="Username"
                        value={confirmEmailForm.values.username}
                        onChange={confirmEmailForm.handleChange}
                        error={
                            confirmEmailForm.touched.username &&
                            Boolean(confirmEmailForm.errors.username)
                        }
                        helperText={
                            confirmEmailForm.touched.username &&
                            confirmEmailForm.errors.username
                        }
                    />
                )}
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="code"
                    label="Verification code"
                    value={confirmEmailForm.values.code}
                    onChange={confirmEmailForm.handleChange}
                    error={
                        confirmEmailForm.touched.code &&
                        Boolean(confirmEmailForm.errors.code)
                    }
                    helperText={
                        confirmEmailForm.touched.code &&
                        confirmEmailForm.errors.code
                    }
                />
                <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleErrorClose}
                    message={error}
                    action={closeSnackBarButton}
                />
                <Button
                    size="small"
                    sx={{ margin: '1em', alignSelf: 'center', width: '50%' }}
                    variant="outlined"
                    onClick={resendCode}
                >
                    Resend Code
                </Button>
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                >
                    Verify email
                </LoadingButton>
            </FormGroup>
        </AuthSkeleton>
    );
};

export default ConfirmAccountPage;
