import Header from '@components/Header';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import backgrounds from 'styles/backgrounds.module.css';

type Props = { formikForm: any; children?: React.ReactNode };

const styles = {
    backgroundColor: `var(--secondary-bg)`,
    margin: '3rem',
    padding: '1rem',
};

const AuthSkeleton = (props: Props) => {
    return (
        <>
            <div className={backgrounds.imageBackground}>
                <Header />
                <Container maxWidth="sm">
                    <Paper variant="outlined" sx={styles}>
                        <form onSubmit={props.formikForm.handleSubmit}>
                            {props.children}
                        </form>
                    </Paper>
                </Container>
            </div>
        </>
    );
};

export default AuthSkeleton;
