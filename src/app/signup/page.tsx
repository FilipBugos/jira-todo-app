import { SignupForm } from "@/components/ui/signup-form";
import { signIn } from "@/auth";

import { providerMap } from "../../../auth.config";

const SignupPage = () => (
  <main className="flex items-center justify-center md:h-screen">
    <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
      <SignupForm />
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

export default SignupPage;
