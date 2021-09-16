import { useSession, signIn, signOut } from 'next-auth/react';

export default function NextAuthTest() {
	const { data: session } = useSession();

	console.log(session);
	if (session) {
		return (
			<div>
				Signed in as {(session as any).user.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</div>
		);
	}

	// https://next-auth.js.org/warnings#nextauth_url NEXTAUTH_URL environment variable not set
	return (
		<div>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</div>
	);
}
