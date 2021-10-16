export const handlePromise = async <T>(
	promise: Promise<T>,
): Promise<[T | null, unknown | null]> => {
	try {
		return [await promise, null];
	} catch (err) {
		return [null, err];
	}
};