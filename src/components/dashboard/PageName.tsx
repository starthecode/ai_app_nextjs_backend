'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

const PageName = () => {
  const pathname = usePathname();
  const title = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/-/g, ' '); // Replace dashes with spaces

  return (
    <div className="flex px-10 pt-10 mb-8">
      <h2 className="text-3xl font-medium capitalize">{title}</h2>
    </div>
  );
};

export default PageName;
