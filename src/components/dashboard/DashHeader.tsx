import React from 'react';
import RightSide from '../header/RightSide';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/options';

interface dataProps {
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    roles: string[];
  };
}

const DashHeader = async () => {
  const session: dataProps | null = await getServerSession(authOptions);

  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
      <div className="flex flex-shrink-0 items-center ml-auto">
        <RightSide data={session} />
      </div>
    </header>
  );
};

export default DashHeader;
