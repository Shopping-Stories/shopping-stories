import AuthClass from '@aws-amplify/auth';

export const handlePromise = async (promise: Promise<any>): Promise<[any, any]> => {
	try {
		return [await promise, null];
	} catch (err) {
		return [null, err];
	}
};

export const isLoggedIn = async (Auth: typeof AuthClass): Promise<Boolean> => {
	const [_res, err] = await handlePromise(Auth.currentAuthenticatedUser());
	if (err) {
		return false;
	}
	return true;
};
