import { SignupForm } from "@/components/ui/signup-form";

import Image from 'next/image';
import logo from '/public/logo.png';
import AuthProviders from '@/components/auth-providers';

const SignupPage = () => (
  <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-3xl font-semibold mb-6 flex-col">Sign Up</h1>
    <div className="relative mx-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-lg">
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 md:w-50 md:h-50 flex items-center justify-center">
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
