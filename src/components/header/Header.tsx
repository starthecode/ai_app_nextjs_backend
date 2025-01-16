import NavItems from './NavItems';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/options';
import Link from 'next/link';
import HeaderDropdownProps from '@/types';

export default async function Header() {
  const session: HeaderDropdownProps | null = await getServerSession(
    authOptions
  );
  return (
    <header className="absolute flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm py-3 md:py-0">
      <nav className=" w-full mx-auto px-4 md:px-6 lg:px-8" aria-label="Global">
        <div className="flex relative w-full items-center justify-between">
          <Link
            className="flex items-center w-[200px] gap-2 text-slate-600 text-md font-semibold outline-none no-underline "
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
