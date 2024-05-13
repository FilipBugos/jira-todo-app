import LoginForm from "@/components/login-form";
import { signIn, auth, providerMap } from "@/auth";

const LoginPage = async () => {
  const session = await auth();
  console.log("session", session);
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <LoginForm />
        <div className="flex flex-col gap-2">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server";
                await signIn(provider.id);
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
};

export default LoginPage;
