import Image from 'next/image';

import { SignupForm } from '@/components/ui/signup-form';

import logo from '/public/logo.png';

import AuthProviders from '@/components/auth-providers';

const SignupPage = () => (
	<main className="flex flex-grow flex-col items-center justify-center bg-gray-100">
		<h1 className="mb-6 flex-col text-3xl font-semibold">Sign Up</h1>
		<div className="relative mx-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-lg">
			<div className="mb-6 flex justify-center">
				<div className="md:w-50 md:h-50 relative flex h-32 w-32 items-center justify-center">
					<Image src={logo} alt="Logo" className="object-fill" />
				</div>
			</div>
			<SignupForm />
			<div>
				<hr className="my-4 border-t border-gray-300 border-opacity-50" />
			</div>
			<AuthProviders />
		</div>
	</main>
);

export default SignupPage;
