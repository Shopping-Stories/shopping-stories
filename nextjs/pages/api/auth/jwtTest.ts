import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
// const secret = process.env.JWT_SECRET;
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	console.log('JSON Web Token', session);
	res.end();
};
