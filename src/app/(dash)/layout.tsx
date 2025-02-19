import DashHeader from '@/components/dashboard/DashHeader';
import PageName from '@/components/dashboard/PageName';
import SidebarItems from '@/components/sidebar/SidebarItems';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <section id="dash" className="flex min-h-screen">
        <Toaster position="top-center" />
        <SidebarItems />
        <div className="text-gray-800 w-full overflow-hidden">
          <DashHeader />
          <PageName />
          <div>{children}</div>
        </div>
      </section>
    </Suspense>
  );
}
