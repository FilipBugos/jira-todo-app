import LoginForm from '@/components/login-form';
import { signIn, auth, providerMap } from "@/auth"

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <LoginForm />
                <div className="flex flex-col gap-2">
                    {Object.values(providerMap).map((provider) => (
                        <form
                            action={async () => {
                                "use server"
                                await signIn(provider.id)
                            }}
                        >
                            <button type="submit">
                                <span>Sign in with {provider.name}</span>
                            </button>
                        </form>
                    ))}
                </div>
            </div>
        </main>
    );
}