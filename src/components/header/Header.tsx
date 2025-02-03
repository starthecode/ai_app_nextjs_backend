import NavItems from './NavItems';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/options';
import Link from 'next/link';

interface dataProps {
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    roles: string[];
  };
}

export default async function Header() {
  const session: dataProps | null = await getServerSession(authOptions);
  return (
    <header className="absolute flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm py-3 md:py-0">
      <nav className=" w-full mx-auto px-4 md:px-6 lg:px-8" aria-label="Global">
        <div className="flex relative w-full items-center justify-between">
          <Link
            className="flex items-center w-fit px-3 py-1 rounded-3xl gap-2 bg-[#8a6bf5] text-xl text-white font-bold text-md outline-none no-underline "
            href="/"
            aria-label="Brand"
          >
            Aesthify
          </Link>

          <NavItems data={session} />
        </div>
      </nav>
    </header>
  );
}
