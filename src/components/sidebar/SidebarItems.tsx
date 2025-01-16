import React from 'react';

const SidebarItems = () => {
  return (
    <aside className="hidden sm:flex sm:flex-col w-[200px]">
      <a
        href="#"
        className="flex text-2xl font-bold text-white w-full items-center justify-center h-20 bg-purple-600 hover:bg-purple-500 focus:bg-purple-500"
      >
        Aesthify
      </a>
      <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800">
        <nav className="flex flex-col mx-4 my-6 space-y-4">
          <a
            href="/ai-model"
            className="inline-flex text-sm text-left text-white px-3 py-2 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
          >
            <span className="sr-only">AI Model</span>
            AI Model
          </a>
          <a
            href="/users"
            className="inline-flex text-sm text-left text-white px-3 py-2 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
          >
            <span className="sr-only">Users</span>
            Users
          </a>
          <a
            href="/ai-generated-images"
            className="inline-flex text-sm text-left text-white px-3 py-2 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
          >
            Ai Generated Image
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default SidebarItems;
