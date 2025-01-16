import React from 'react';
import HeaderDropdown from './HeaderDropdown';
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
export default function RightSide({ data }: { data: dataProps | null }) {
  console.log('check 2', data);

  return (
    <div className="pt-3 md:pt-0">
      {data ? (
        <HeaderDropdown data={data} />
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
