'use client';

import Link from 'next/link';
import React from 'react';
import RightSide from './RightSide';

const headerLinks = [
  {
    label: 'Text to Image',
    route: '/',
  },
  {
    label: 'Ai Avatar',
    route: '/',
  },
  {
    label: 'Background Remover',
    route: '/',
  },
  {
    label: 'Image Upscale',
    route: '/',
  },
];

interface dataProps {
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    roles: string[];
  };
}

export default function NavItems({ data }: { data: dataProps | null }) {
  const [active, setActive] = React.useState<boolean>(false);

  return (
    <>
      <div className="md:hidden">
        <button
          onClick={() => setActive(!active)}
          type="button"
          className="hs-collapse-toggle flex justify-center items-center w-9 h-9 text-sm font-semibold rounded-lg border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-black dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          data-hs-collapse="#navbar-collapse-with-animation"
          aria-controls="navbar-collapse-with-animation"
          aria-label="Toggle navigation"
        >
          <svg
            className="hs-collapse-open:hidden flex-shrink-0 w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="black"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
          <svg
            className="hs-collapse-open:block hidden flex-shrink-0 w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div
        className={`hs-collapse ${
          active ? 'w-full absolute top-[50px] z-10 bg-white' : 'hidden'
        } overflow-hidden transition-all duration-300 basis-full grow md:block`}
      >
        <div className="overflow-hidden overflow-y-auto max-h-[75vh]">
          <div className="flex flex-col gap-x-0 mt-5 divide-y divide-dashed divide-gray-200 md:flex-row md:items-center md:justify-end md:gap-x-7 md:mt-0 md:ps-7 md:divide-y-0 md:divide-solid dark:divide-gray-700">
            {headerLinks &&
              headerLinks.map((link, index) => (
                <Link
                  key={index}
                  className="font-medium uppercase text-xs text-gray-600 hover:text-violet-600 py-3 md:py-6 dark:text-black dark:hover:text-violet-600 focus:outline-none"
                  href={link.route}
                >
                  {link.label}
                </Link>
              ))}

            <RightSide data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
