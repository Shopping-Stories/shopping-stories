import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import LoadingPage from '@components/LoadingPage';
import SnackBarCloseButton from '@components/SnackBarCloseButton';
import TabPanel from '@components/TabPanel';
import TextFieldWithFormikValidation from '@components/TextFieldWithFormikValidation';
import TextFieldWithHide from '@components/TextFieldWithHide';
import useAuth from '@hooks/useAuth.hook';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Auth } from 'aws-amplify';
import {
    changeEmailCodeSchema,
    changeEmailSchema,
    changeNamesSchema,
    changePasswordSchema,
} from 'client/formikSchemas';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { Fragment, useEffect, useState } from 'react';
import { PaperStylesSecondary } from 'styles/styles';

const a11yProps = (index: number) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
};
interface UserAttributes {
    family_name?: string;
    given_name?: string;
    email?: string;
}

const AdminDashboardPage: NextPage = () => {
    const { groups, loading } = useAuth('/');
    const [tabIndex, setTabIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [openError, setErrorOpen] = useState(false);
    const [openSuccess, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
        null,
    );

    const handleErrorClose = (
        _: Event | React.SyntheticEvent,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const handleSuccessClose = (
        _: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setUserAttributes(user.attributes);
            } catch (error: any) {
                console.error(error.message);
            }
        };
        getUser();
    }, []);

    const updateUser = async (attributes: UserAttributes) => {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, attributes);
    };

    const initChangeEmail = useFormik<Pick<UserAttributes, 'email'>>({
        enableReinitialize: true,
        initialValues: {
            email: userAttributes ? userAttributes.email : '',
        },
        validationSchema: changeEmailSchema,
        onSubmit: async (values, { resetForm }) => {
            setError('');
            setIsLoading(true);
            try {
                await updateUser(values);
                setUserAttributes((prev) => ({ ...prev, ...values }));
                setCodeSent(true);
                resetForm();
            } catch (error: any) {
                if (error.message !== undefined) {
                    console.error(`Error:  ${error.message}`);
                    setError(error.message);
                    setErrorOpen(true);
                }
            }
            setIsLoading(false);
        },
    });

    const confirmChangeEmail = useFormik<{ code: string }>({
        initialValues: {
            code: '',
        },
        validationSchema: changeEmailCodeSchema,
        onSubmit: async (values, { resetForm }) => {
            setError('');
            setIsLoading(true);
            try {
                await Auth.verifyCurrentUserAttributeSubmit(
                    'email',
                    values.code,
                );
                setSuccessMessage('Successfully updated your email');
                setSuccessOpen(true);
                setCodeSent(false);
                resetForm();
            } catch (error: any) {
                if (error.message !== undefined) {
                    console.error(`Error:  ${error.message}`);
                    setError(error.message);
                    setErrorOpen(true);
                }
            }
            setIsLoading(false);
        },
    });

    const changeNames = useFormik<Omit<UserAttributes, 'email'>>({
        enableReinitialize: true,
        initialValues: {
            family_name: userAttributes ? userAttributes.family_name : '',
            given_name: userAttributes ? userAttributes.given_name : '',
        },
        validationSchema: changeNamesSchema,
        onSubmit: async (values, { resetForm }) => {
            setError('');
            setIsLoading(true);
            try {
                await updateUser(values);
                setUserAttributes((prev) => ({ ...prev, ...values }));
                setSuccessMessage('Successfully updated your name(s)');
                setSuccessOpen(true);
                resetForm();
            } catch (error: any) {
                if (error.message !== undefined) {
                    console.error(`Error:  ${error.message}`);
                    setError(error.message);
                    setErrorOpen(true);
                }
            }
            setIsLoading(false);
        },
    });

    interface PasswordChange {
        oldPassword: string;
        password: string;
        confirmPassword: string;
    }

    const changePasswordForm = useFormik<PasswordChange>({
        initialValues: {
            oldPassword: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: changePasswordSchema,
        onSubmit: async (values, { resetForm }) => {
            setError('');
            setIsLoading(true);
            try {
                const { oldPassword, password } = values;
                const user = await Auth.currentAuthenticatedUser();
                await Auth.changePassword(user, oldPassword, password);
                setSuccessMessage('Successfully updated your password');
                setSuccessOpen(true);
                resetForm();
            } catch (error: any) {
                if (error.message !== undefined) {
                    const includesPass = error.message
                        .toLowerCase()
                        .includes('pass');
                    if (includesPass) {
                        changePasswordForm.setFieldError(
                            'oldPassword',
                            error.message,
                        );
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

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Fragment>
            <ColorBackground>
                <Header />
                <DashboardPageSkeleton groups={groups}>
                    <Container maxWidth="sm">
                        <Paper sx={PaperStylesSecondary}>
                            <Tabs
                                value={tabIndex}
                                onChange={handleChange}
                                centered
                            >
                                <Tab label="Change Name" {...a11yProps(0)} />
                                <Tab
                                    label="Change Password"
                                    {...a11yProps(1)}
                                />
                                <Tab label="Change Email" {...a11yProps(2)} />
                            </Tabs>
                            <TabPanel value={tabIndex} index={0}>
                                <Paper sx={{ p: '1rem' }}>
                                    <form onSubmit={changeNames.handleSubmit}>
                                        <TextFieldWithFormikValidation
                                            fullWidth
                                            name="given_name"
                                            label="First Name"
                                            fieldName="given_name"
                                            formikForm={changeNames}
                                        />
                                        <TextFieldWithFormikValidation
                                            fullWidth
                                            name="family_name"
                                            label="Last Name"
                                            formikForm={changeNames}
                                            fieldName="family_name"
                                        />
                                        <LoadingButton
                                            loading={isLoading}
                                            variant="contained"
                                            type="submit"
                                        >
                                            Change Name(s)
                                        </LoadingButton>
                                    </form>
                                </Paper>
                            </TabPanel>
                            <TabPanel value={tabIndex} index={1}>
                                <Paper sx={{ p: '1rem' }}>
                                    <Stack spacing={2}>
                                        <form
                                            onSubmit={
                                                changePasswordForm.handleSubmit
                                            }
                                        >
                                            <TextFieldWithHide
                                                fullWidth
                                                name="oldPassword"
                                                label="Current Password"
                                                fieldName="oldPassword"
                                                formikForm={changePasswordForm}
                                            />
                                            <TextFieldWithHide
                                                fullWidth
                                                name="password"
                                                label="New Password"
                                                formikForm={changePasswordForm}
                                                fieldName="password"
                                            />
                                            <TextFieldWithHide
                                                fullWidth
                                                name="confirmPassword"
                                                label="Confirm New Password"
                                                formikForm={changePasswordForm}
                                                fieldName="confirmPassword"
                                            />
                                            <LoadingButton
                                                loading={isLoading}
                                                variant="contained"
                                                type="submit"
                                            >
                                                Change Password
                                            </LoadingButton>
                                        </form>
                                    </Stack>
                                </Paper>
                            </TabPanel>
                            <TabPanel value={tabIndex} index={2}>
                                <Paper sx={{ p: '1rem' }}>
                                    {!codeSent ? (
                                        <form
                                            onSubmit={
                                                initChangeEmail.handleSubmit
                                            }
                                        >
                                            <TextFieldWithFormikValidation
                                                fullWidth
                                                name="email"
                                                label="Email"
                                                fieldName="email"
                                                formikForm={initChangeEmail}
                                            />
                                            <LoadingButton
                                                loading={isLoading}
                                                variant="contained"
                                                type="submit"
                                            >
                                                Change Email
                                            </LoadingButton>
                                        </form>
                                    ) : (
                                        <form
                                            onSubmit={
                                                confirmChangeEmail.handleSubmit
                                            }
                                        >
                                            <TextFieldWithFormikValidation
                                                fullWidth
                                                name="code"
                                                label="Confirmation Code"
                                                fieldName="code"
                                                formikForm={confirmChangeEmail}
                                            />
                                            <LoadingButton
                                                loading={isLoading}
                                                variant="contained"
                                                type="submit"
                                            >
                                                Confirm Change
                                            </LoadingButton>
                                        </form>
                                    )}
                                </Paper>
                            </TabPanel>
                        </Paper>
                    </Container>
                </DashboardPageSkeleton>

                <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleErrorClose}
                    action={SnackBarCloseButton({
                        handleClose: handleErrorClose,
                    })}
                >
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
                <Snackbar
                    open={openSuccess}
                    autoHideDuration={6000}
                    onClose={handleSuccessClose}
                    action={SnackBarCloseButton({
                        handleClose: handleSuccessClose,
                    })}
                >
                    <Alert severity="success">{successMessage}</Alert>
                </Snackbar>
            </ColorBackground>
        </Fragment>
    );
};

export default AdminDashboardPage;
