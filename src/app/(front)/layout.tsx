import Header from '@/components/header/Header';

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section id="front" className="flex bg-gray-100 h-screen w-full">
      <Header />
      {children}
    </section>
  );
}
