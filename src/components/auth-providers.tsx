import { FaGithub } from 'react-icons/fa';

import { signIn } from '@/auth';

import { providerMap } from '../../auth.config';

const providerIcons: { [key: string]: JSX.Element } = {
	github: <FaGithub className="mr-2" />
};

const AuthProviders = () => (
	<div className="flex flex-col gap-2 space-y-6">
		{Object.values(providerMap).map(provider => {
			if (!provider) {
				return null;
			}
			return (
				<form
					key={provider.id}
					action={async () => {
						'use server';
						await signIn(provider.id);
					}}
				>
					<button
						type="submit"
						className="flex w-full items-center justify-center rounded-md
                        bg-gray-800 p-3 text-white hover:bg-gray-900"
					>
						{provider.id in providerIcons && providerIcons[provider.id]}
						<span>Sign in with {provider.name}</span>
					</button>
				</form>
			);
		})}
	</div>
);

export default AuthProviders;
