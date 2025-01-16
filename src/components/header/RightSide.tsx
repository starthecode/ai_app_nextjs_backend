import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import Link from 'next/link';

export default function RightSide({ session }: any) {
  return (
    <div className="pt-3 md:pt-0">
      {session ? (
        <HeaderDropdown data={session} />
      ) : (
        <Link
          className="px-2 py-1 bg-blue-600 rounded-sm text-white font-medium"
          href="/login"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
