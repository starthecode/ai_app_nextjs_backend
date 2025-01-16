import React from 'react';
import RightSide from '../header/RightSide';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/options';

const DashHeader = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
      <div className="flex flex-shrink-0 items-center ml-auto">
        <RightSide session={session} />
      </div>
    </header>
  );
};

export default DashHeader;
