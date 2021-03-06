import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { handlePromise } from '../util';

export const isInGroup = (groupName: string, groups: null | string[]) => {
    if (!groups) {
        return false;
    }
    return groups.includes(groupName);
};

const useAuth = (redirectURL?: string, authorizedGroups: string[] = []) => {
    const router = useRouter();
    const [groups, setGroups] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<null | string>('idle');
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setLoading('loading...');
        setError(null);

        const checkUser = async () => {
            const [res, err] = await handlePromise(Auth.currentSession());
            // const [res, err] = await handlePromise(Auth.currentAuthenticatedUser());

            if (err && redirectURL) {
                err && setError(err);
                setIsLoggedIn(false);
                router.push(redirectURL);
                return;
            }
            const groupsUserIsIn =
                res?.getAccessToken().payload['cognito:groups'] ?? null;
            // res?.signInUserSession?.accessToken?.payload['cognito:groups'] ?? null;
            setGroups(groupsUserIsIn);
            const [authRes, _authErr] = await handlePromise(
                Auth.currentAuthenticatedUser(),
            );
            if (authRes) {
                setIsLoggedIn(true);
            }
            if (authorizedGroups.length !== 0 && redirectURL) {
                const isAuthorized = authorizedGroups
                    .map((group: string) => isInGroup(group, groupsUserIsIn))
                    .reduce((acc, cur) => acc || cur, false);
                if (!isAuthorized) {
                    router.push(redirectURL);
                    return;
                }
                setLoading(null);
            } else {
                setLoading(null);
            }
        };
        checkUser();
        return () => {};
    }, []);

    return { groups, loading, error, isLoggedIn };
};

export default useAuth;
