import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center text-center w-full">
      <Image
        width={2000}
        height={600}
        className="w-auto h-auto"
        src={'/ai-app-banner.jpg'}
        alt="ai-app"
      />
    </div>
  );
}
