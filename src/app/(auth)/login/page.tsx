'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [loader, setLoader] = React.useState<boolean>(false);
  const session = useSession();

  React.useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/');
    }
  });

  const loginUser = async () => {
    setLoader(true);
    await signIn('google', { redirect: false, prompt: 'login' });
  };

  return (
    <>
      <section className="flex h-screen w-full items-center py-16 justify-center ">
        <div className="mt-7 bg-slate-300 borrder border-gray-200 rounded-xl shadow-sm ">
          <div className="p-4 sm:p-7 w-full flex items-center justify-center text-center">
            <button
              type="button"
              onClick={loginUser}
              disabled={loader}
              className="flex gap-2 items-center justify-center text-slate-800 font-medium"
            >
              <FaGoogle size={20} fill="red" />{' '}
              {loader ? 'Signin..' : 'Signin with Google'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
