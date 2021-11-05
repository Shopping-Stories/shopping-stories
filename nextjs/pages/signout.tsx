import Header from '@components/Header';
import { Auth } from 'aws-amplify';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import backgrounds from 'styles/backgrounds.module.css';

const SignOutPage: NextPage = () => {
    const router = useRouter();
    useEffect(() => {
        const signOut = () => {
            Auth.signOut()
                .then(() => router.push('/'))
                .catch(() => router.push('/'));
        };

        signOut();
    });

    return (
        <div className={backgrounds.colorBackground}>
            <Header />
        </div>
    );
};

export default SignOutPage;
