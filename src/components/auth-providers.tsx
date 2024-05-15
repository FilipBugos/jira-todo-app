import { signIn, auth } from "@/auth";
import { providerMap } from '../../auth.config';

import { FaGithub } from 'react-icons/fa';

const providerIcons: { [key: string]: JSX.Element } = {
    "github": <FaGithub className="mr-2" />,
};

const AuthProviders = () => {
    return (
        <div className="flex flex-col gap-2 space-y-6">
            {Object.values(providerMap).map((provider) => {
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
                            className="flex items-center justify-center w-full p-3
                        text-white bg-gray-800 rounded-md hover:bg-gray-900"
                        >
                            {provider.id in providerIcons && providerIcons[provider.id]}
                            <span>Sign in with {provider.name}</span>
                        </button>
                    </form>
                );
            })}
        </div >
    );
};

export default AuthProviders;
