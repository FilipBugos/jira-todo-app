import LoginForm from '@/components/login-form';
import { auth } from '@/auth';
import AuthProviders from '@/components/auth-providers';

import Image from 'next/image';

import logo from '/public/logo.png';

const LoginPage = async () => {
	const session = await auth();
	return (
		<main className="flex flex-grow flex-col items-center justify-center bg-gray-100">
			<h1 className="mb-6 flex-col text-3xl font-semibold">Log In</h1>
			<div className="relative mx-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-lg">
				<div className="mb-6 flex justify-center">
					<div className="md:w-50 md:h-50 relative flex h-32 w-32 items-center justify-center">
						<Image src={logo} alt="Logo" className="object-fill" />
					</div>
				</div>
				<LoginForm />
				<div>
					<hr className="my-4 border-t border-gray-300 border-opacity-50" />
				</div>
				<AuthProviders />
			</div>
		</main>
	);
};

export default LoginPage;
