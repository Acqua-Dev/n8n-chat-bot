import Image from 'next/image';
import Link from 'next/link';

export default function HeaderBar() {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-[var(--chat-water-blue)] text-white sm:px-12">
      <div>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={30}
            priority
            className="h-[40px] w-auto"
          />
        </Link>
      </div>
      
      <div className="flex space-x-6">
        <Link 
          href="/chat"
          className="text-white hover:text-gray-200 transition-colors"
        >
          Chat
        </Link>
      </div>
    </header>
  );
}
