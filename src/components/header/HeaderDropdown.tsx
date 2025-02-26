'use client';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface dataProps {
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    roles: string[];
  };
}

export default function HeaderDropdown({ data }: { data: dataProps | null }) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const router = useRouter();

  const name = data?.user?.name || 'Guest';
  const email = data?.user?.email || '';
  const image = data?.user?.image || '';
  function handleDropdown() {
    console.log(showDropdown);

    setShowDropdown(!showDropdown);
  }

  async function logoutHandle() {
    await signOut({ redirect: false }).then(() => {
      router.push('/');
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <div className="profile relative z-10" onClick={handleDropdown}>
          <div className="user">
            <h3>Welcome {name.split(' ')[0]}</h3>
          </div>
          <div className="img-box bg-slate-300">
            {image && (
              <Image
                src={image}
                className="p-1 rounded-full"
                width={30}
                height={30}
                alt="profile logo"
              />
            )}
          </div>
        </div>

        {showDropdown && (
          <div className="absolute top-20 right-5 bg-white w-[200px] h-auto overflow-hidden">
            <div className="py-2 px-2 flex-col flex justify-start text-left bg-gray-100 rounded-t-lg dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Signed in as
              </p>
              <p className="text-[0.8rem] font-medium text-gray-800 dark:text-gray-300">
                {email.substring(0, 20) + '...'}
              </p>
            </div>

            <ul>
              <li className="flex items-center px-2 py-2">
                <Link href="/main">Dashboard</Link>
              </li>
              <li className="flex items-center px-2 py-2">
                <button onClick={logoutHandle}>Sign Out</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
